import { gql, GraphQLClient } from "graphql-request";
import { GraphQLError } from "graphql";

import { RepoAdvancedInfo, RepoBasicInfo, RepoErrorInfo } from "common/repo.js";

export type Repositories = Record<
  string,
  {
    owner: string;
    name: string;
  }
>;

export async function githubGql(
  minedRepos: RepoBasicInfo[],
): Promise<
  {
    repos: RepoAdvancedInfo[];
    notResolvedRepos: RepoErrorInfo[];
  }
> {
  const githubRepos = minedRepos.filter((repo) => repo.domain == "github.com");
  const notResolvedRepos: RepoErrorInfo[] = minedRepos
    .filter((repo) => repo.domain != "github.com").map((repo) => {
      return {
        ...repo,
        error: {
          reason: "UNSUPPORTED_DOMAIN",
        },
      };
    });

  type gqlResponseType = {
    data: Record<
      string,
      {
        createdAt: string;
        stargazerCount: number;
        isArchived: boolean;
        issues: { totalCount: number };
        object: {
          lastCommit: { nodes: { committedDate: string }[] };
          activity: { totalCount: number };
        };
        nameWithOwner: string;
        primaryLanguage: { color?: string; name: string };
        description: string;
        repositoryTopics: {
          edges: {
            node: { topic: { name: string } };
          }[];
        };
      } | null
    >;
    errors?: (GraphQLError & { type?: string })[];
  };
  // String of last yer datetime
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  const lastYear = date.toISOString();

  const repoQuery = githubRepos.map((repo, i) => {
    return `
			repo${i}: repository(owner: "${repo.owner}", name: "${repo.name}") {
				createdAt
				stargazerCount
        isArchived
				issues {
					totalCount
				}
        nameWithOwner
        primaryLanguage {
          color
          name
        }
				object(expression: "HEAD") {
					... on Commit {
						lastCommit: history(first: 1) {
							nodes {
								committedDate
							}
						}
						activity: history(since: "${lastYear}") {
							totalCount
						}
					}
				}
        description
				repositoryTopics(first: 10) {
					edges {
						node {
							topic {
								name
							}
						}
					}
				}
			}
    `;
  });
  const repoThrottledQueries: string[][] = [];
  while (repoQuery.length > 0) {
    const query = repoQuery.splice(0, 30);
    repoThrottledQueries.push(query);
  }

  const endpoint = "https://api.github.com/graphql";
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN!}`,
    },
    errorPolicy: "all",
  });

  const repos: (RepoBasicInfo & RepoAdvancedInfo)[] = [];

  let count = 0;
  const tasks = repoThrottledQueries.map(async (repoThrottledQuery) => {
    const query = gql`
		    query {
          ${repoThrottledQuery.join("\n")}
		    }
	    `;
    const res: gqlResponseType = await graphQLClient.rawRequest(query);
    count += repoThrottledQuery.length;
    console.log(`Fetched ${count} repos`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    Object.entries(res.data).forEach(([key, value]) => {
      if (value === null) {
        const id = Number(key.replace("repo", ""));
        const error = res.errors?.find((error) => {
          return error.path?.includes(key);
        });
        const repo: RepoBasicInfo & RepoErrorInfo = {
          ...githubRepos[id],
          error: {
            reason: error?.type === "NOT_FOUND" ? "NOT_FOUND" : "UNKNOWN_ERROR",
            message: error?.message,
          },
        };
        notResolvedRepos.push(repo);
      } else {
        const id = Number(key.replace("repo", ""));

        const repo: RepoBasicInfo & RepoAdvancedInfo = {
          ...githubRepos[id],
          data: {
            createdAt: value.createdAt,
            star: value.stargazerCount,
            lastCommit: value.object.lastCommit.nodes[0].committedDate,
            commitCountLastYear: value.object.activity.totalCount,
            description: value.description,
            topics: value.repositoryTopics.edges.map((edge) =>
              edge.node.topic.name
            ),
            isArchived: value.isArchived,
            primaryLanguage: value.primaryLanguage,
            nameWithOwner: value.nameWithOwner,
          },
        };
        repos.push(repo);
      }
    });
  });

  await Promise.all(tasks);

  // Rename repos with same name
  repos.forEach((repo) => {
    if (repo.data.nameWithOwner != repo.owner + "/" + repo.name) {
      repo.owner = repo.data.nameWithOwner.split("/")[0];
      repo.name = repo.data.nameWithOwner.split("/")[1];
    }
  });

  return { repos, notResolvedRepos };
}
