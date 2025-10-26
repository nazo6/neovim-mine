import { gql, GraphQLClient } from "graphql-request";
import { GraphQLError } from "graphql";
import * as z from "zod";

import { RepoAdvancedInfo, RepoBasicInfo, RepoErrorInfo } from "common/repo.js";
import pLimit from "p-limit";

export type Repositories = Record<
  string,
  {
    owner: string;
    name: string;
  }
>;

const gqlSchema = z.object({
  data: z.record(
    z.string(),
    z.object({
      createdAt: z.string(),
      stargazerCount: z.number(),
      isArchived: z.boolean(),
      issues: z.object({ totalCount: z.number() }),
      object: z.object({
        lastCommit: z.object({
          nodes: z.array(z.object({ committedDate: z.string() })),
        }),
        activity: z.object({ totalCount: z.number() }),
      }).nullable(),
      nameWithOwner: z.string(),
      primaryLanguage: z.object({
        color: z.string().optional(),
        name: z.string(),
      }).nullable(),
      description: z.string().nullable(),
      repositoryTopics: z.object({
        edges: z.array(
          z.object({
            node: z.object({ topic: z.object({ name: z.string() }) }),
          }),
        ),
      }),
    }).nullable(),
  ),
  errors: z.any(),
});

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
  const limit = pLimit(20);
  const tasks = repoThrottledQueries.map(async (repoThrottledQuery) => {
    const func = async () => {
      const query = gql`
		    query {
          ${repoThrottledQuery.join("\n")}
		    }
	    `;
      const parsed = z.safeParse(
        gqlSchema,
        await graphQLClient.rawRequest(query),
      );

      if (!parsed.success) {
        throw new Error(
          `Failed to parse GitHub GraphQL response: ${parsed.error}`,
        );
      }
      const res = parsed.data;
      const errors = res.errors as
        | (GraphQLError & { type?: string })[]
        | undefined;

      count += repoThrottledQuery.length;
      console.log(`Fetched ${count} repos`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      Object.entries(res.data).forEach(([key, value]) => {
        if (value === null) {
          const id = Number(key.replace("repo", ""));
          const error = errors?.find((error) => {
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
        } else if (value.object === null) {
          const id = Number(key.replace("repo", ""));
          const repo: RepoBasicInfo & RepoErrorInfo = {
            ...githubRepos[id],
            error: {
              reason: "UNKNOWN_ERROR",
              message: "Repository object is null",
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
              description: value.description ?? undefined,
              topics: value.repositoryTopics.edges.map((edge) =>
                edge.node.topic.name
              ),
              isArchived: value.isArchived,
              primaryLanguage: value.primaryLanguage ?? undefined,
              nameWithOwner: value.nameWithOwner,
            },
          };
          repos.push(repo);
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 20000));
    };

    return limit(() => func());
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
