import * as path from "path";
import { promises as fs } from "fs";
import { glob } from "glob";
import { RepoInfo } from "@/../common/repo";
import { View } from "./View";
import { RepoInfoWithTag, Tag, TagInfo } from "@/types/repo";

const IGNORED_CATEGORY: string[] = [
  "awesome-neovim",
  "table-of-contents",
  "readme.md",
  "requires-neovim-0.5",
  "plugin",
];
const IGNORED_TOPICS: string[] = [
  "neovim",
  "nvim",
  "vim",
  "plugin",
  "neovim-plugin",
  "lua",
];

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
      const categoryNormalized = category.map((c, i) => {
        let name = c.name.trim();
        name = name.replace(/\[(?<title>.*)\]/, "$<title>");
        name = name.toLowerCase();
        name = name.replaceAll(", ", "-");
        name = name.replaceAll(" ", "-");

        return { ...c, name };
      });
      const tagTmp: string[] = [];
      categoryNormalized.forEach((crr, i) => {
        const ignored = IGNORED_CATEGORY.some((c) => {
          return crr.name.includes(c);
        });
        if (ignored) return;

        if (i == 0) {
          crr.name = crr.name.replace(".md", "");
        }

        if (crr.name == "neovim-lua-development") {
          console.log(tagTmp, i);
        }

        if (tagTmp[tagTmp.length - 1] == crr.name) {
          return;
        }

        tagTmp.push(crr.name);

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
