import * as path from "path";
import { promises as fs } from "fs";
import { glob } from "glob";
import { RepoInfo } from "@/../common/repo";
import { View } from "./View";
import { RepoInfoWithTag } from "@/types/repo";

const IGNORED_CATEGORY: string[] = [];
const IGNORED_TOPICS: string[] = [];

async function getRepos(): Promise<RepoInfoWithTag[]> {
  const files = await glob(
    path.join(process.cwd(), "../data/data", "*/*/*.json"),
  );
  const repos = (await Promise.all(files.flatMap(async (path) => {
    const fileStr = await fs.readFile(path, { encoding: "utf8" });
    const repoInfo = JSON.parse(fileStr) as RepoInfo;

    const tag: (string | string[])[] = [];

    repoInfo.category.forEach((category) => {
      const categoryTag: string[] = [];

      category.shift()!;
      category.forEach((subCategory) => {
        if (IGNORED_CATEGORY.includes(subCategory.name)) return;
        categoryTag.push(subCategory.name);
      });

      tag.push(categoryTag);
    });

    if ("data" in repoInfo) {
      repoInfo.data.topics.forEach((topic) => {
        if (IGNORED_TOPICS.includes(topic)) return;
        tag.push(topic);
      });
    }

    return {
      ...repoInfo,
      tag,
    };
  }))).filter((repo) => {
    if ("error" in repo) {
      return !(repo.error.reason == "NOT_FOUND");
    }
    return true;
  });
  return repos;
}

export async function DataFetcher() {
  const repos = await getRepos();
  return <View repos={repos} />;
}
