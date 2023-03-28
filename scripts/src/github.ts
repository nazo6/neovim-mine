import { gql, GraphQLClient } from "graphql-request";
import { GraphQLError } from "graphql";
import { throttleAll } from "promise-throttle-all";

import { RepoAdvancedInfo, RepoBasicInfo, RepoErrorInfo } from "common/repo";

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
    repos: (RepoBasicInfo & RepoAdvancedInfo)[];
    notResolvedRepos: (RepoBasicInfo & RepoErrorInfo)[];
  }
> {
  const githubRepos = minedRepos.filter((repo) => repo.domain == "github.com");
  const notResolvedRepos: (RepoBasicInfo & RepoErrorInfo)[] = minedRepos
    .filter((repo) => repo.domain != "github.com").map((repo) => {
      return {
        ...repo,
        error: {
          reason: "UNSUPPORTED_DOMAIN",
        },
      };
    });

  type gqlResponseType = {
    data:
      & Record<
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
          primaryLanguage: { color?: string; name: string };
          description: string;
          repositoryTopics: {
            edges: {
              node: { topic: { name: string } };
            }[];
          };
        } | null
      >
      & {
        rateLimit: { cost: number };
      };
    errors?: (GraphQLError & { type?: string })[];
  };
  // String of last yer datetime
  let date = new Date();
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
  const repoThrottledQueries: string[] = [];
  while (repoQuery.length > 0) {
    const query = repoQuery.splice(0, 50).join("\n");
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

  const tasks = repoThrottledQueries.map((repoThrottledQuery) => {
    return async () => {
      const query = gql`
		    query {
          ${repoThrottledQuery}
		    	rateLimit {
		    		cost
		    	}
		    }
	    `;
      const res: gqlResponseType = await graphQLClient.rawRequest(query);
      let cost = 0;
      Object.entries(res.data).forEach(([key, value]) => {
        if (value === null) {
          const id = Number(key.replace("repo", ""));
          const error = res.errors?.find((error) => {
            return error.path?.includes(key);
          });
          const repo: RepoBasicInfo & RepoErrorInfo = {
            ...githubRepos[id],
            error: {
              reason: error?.type === "NOT_FOUND"
                ? "NOT_FOUND"
                : "UNKNOWN_ERROR",
              message: error?.message,
            },
          };
          notResolvedRepos.push(repo);
        } else {
          if ("cost" in value) {
            cost = value.cost;
            return;
          }
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
            },
          };
          repos.push(repo);
        }
      });
      console.log(`Send request (cost: ${cost})`);
    };
  });

  await throttleAll(10, tasks);

  return { repos, notResolvedRepos };
}
