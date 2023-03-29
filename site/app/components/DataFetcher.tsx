import * as path from "path";
import { promises as fs } from "fs";
import { glob } from "glob";
import { RepoInfo } from "@/../common/repo";
import { View } from "./View";
import { RepoInfoWithTag, Tag, TagInfo } from "@/types/repo";

const IGNORED_CATEGORY: string[] = [
  "awesome neovim",
  "table of contents",
  "readme.md",
];
const IGNORED_TOPICS: string[] = ["neovim", "nvim"];

async function getRepos(): Promise<
  { repos: RepoInfoWithTag[]; tagInfo: TagInfo }
> {
  const files = await glob(
    path.join(process.cwd(), "../data/data", "*/*/*.json"),
  );
  const tagCount: Record<string, number> = {};
  const repos = (await Promise.all(files.flatMap(async (path) => {
    const fileStr = await fs.readFile(path, { encoding: "utf8" });
    const repoInfo = JSON.parse(fileStr) as RepoInfo;

    const repoTags: Tag[] = [];

    repoInfo.category.forEach((category) => {
      const tagTmp: string[] = [];
      category.forEach((crr, i) => {
        let name = crr.name.trim();
        name = name.toLowerCase();

        const ignored = IGNORED_CATEGORY.some((c) => {
          return name.includes(c);
        });
        if (ignored) return;

        if (i == 0) {
          name = crr.name.replace(".md", "");
        }

        tagTmp.push(name);

        const tagStr = JSON.stringify(tagTmp);
        tagCount[tagStr] = (tagCount[tagStr] ?? 0) + 1;
        if (!repoTags.includes(tagStr)) {
          repoTags.push(tagStr);
        }
      });
    });

    if ("data" in repoInfo) {
      repoInfo.data.topics.forEach((topic) => {
        let name = topic.trim();
        name = name.toLowerCase();

        if (IGNORED_TOPICS.includes(name)) return;

        const topicStr = JSON.stringify([name]);
        tagCount[topicStr] = (tagCount[topicStr] || 0) + 1;
        if (!repoTags.includes(topicStr)) {
          repoTags.push(topicStr);
        }
      });
    }

    return {
      ...repoInfo,
      tag: repoTags,
    };
  }))).filter((repo) => {
    if ("error" in repo) {
      return !(repo.error.reason == "NOT_FOUND");
    }
    return true;
  });

  const tagInfo: TagInfo = Object.entries(tagCount).map(([tag, count]) => ({
    tag,
    count,
  }));

  console.log(tagInfo.length);

  return { repos, tagInfo };
}

export async function DataFetcher() {
  const { repos, tagInfo } = await getRepos();
  return <View repos={repos} tagInfo={tagInfo} />;
}
