import * as path from "path";
import { promises as fs } from "fs";
import { execSync } from "child_process";
import { glob } from "glob";
import type { RepoInfo } from "common/repo";
import type { RepoInfoWithTag, TagInfo } from "@/lib/repoType";

/// Category specified by this will not shown.
const IGNORED_CATEGORY: string[] = [
  "awesome-neovim",
  "table-of-contents",
  "readme.md",
  "requires-neovim-0.5",
  "plugin",
  "archived",
];

/// Tags specified by this will not shown.
const IGNORED_TAG: string[] = [
  "neovim",
  "nvim",
  "vim",
  "plugin",
  "neovim-plugin",
  "nvim-plugin",
  "neovim-lua",
  "neovim-lua-plugin",
  "nvim-lua",
  "lua",
];

/// Item that contains this category will not shown.
const EXCLUDED_CATEGORY: string[] = [
  "Preconfigured Configuration",
  "Vim Distribution",
  "Neovim Distribution",
];

/// Item that contains this tag will not shown.
const EXCLUDED_TAG: string[] = [
  "preconfigured-configuration",
  "vim-distribution",
];

export async function readRepoData(): Promise<RepoInfo[]> {
  let files = await glob(
    path.join(process.cwd(), "../data/data", "*/*/*.json"),
  );
  if (files.length == 0) {
    execSync(
      "git clone --depth 1 https://github.com/nazo6/neovim-mine-data data",
      {
        cwd: path.join(process.cwd(), "../"),
      },
    );

    files = await glob(path.join(process.cwd(), "../data/data", "*/*/*.json"));
  }

  return Promise.all(files.map(async (path) => {
    const fileStr = await fs.readFile(path, { encoding: "utf8" });
    return JSON.parse(fileStr) as RepoInfo;
  }));
}

export async function getRepos(): Promise<RepoInfoWithTag[]> {
  const repos = (await readRepoData()).flatMap((repo) => {
    const repoTags: string[] = [];
    if ("data" in repo) {
      for (const topic of repo.data.topics) {
        if (EXCLUDED_TAG.includes(topic)) return [];
        if (!IGNORED_TAG.includes(topic)) {
          repoTags.push(topic);
        }
      }
    }

    for (const category of repo.category) {
      for (const c of category.data) {
        if (EXCLUDED_CATEGORY.includes(c.name)) return [];
      }
    }

    const categories = repo.category.map((category) => {
      return {
        ...category,
        data: category.data.filter((c) => {
          if (IGNORED_CATEGORY.includes(c.name)) return false;
          return true;
        }),
      };
    });

    return {
      ...repo,
      category: categories,
      tag: repoTags,
    };
  });

  return repos;
}
