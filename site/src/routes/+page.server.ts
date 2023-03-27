import type { PageServerLoad } from "./$types";

import * as path from "path";
import * as url from "url";
import * as fs from "fs/promises";
import { glob } from "glob";

export type Repo = {
  url: string;
  domain: string;
  owner: string;
  name: string;
  category: {
    name: string;
    level: number;
  }[][];
};

export type GithubRepo = Repo & {
  data: {
    createdAt: string;
    star: number;
    lastCommit: string;
    commitCountLastYear: number;
    description: string;
    topics: string[];
  };
};

export type RepoType = Repo | GithubRepo;

export const load: PageServerLoad = async () => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const dataDir = path.join(__dirname, "../../../data/data");
  const repoData = await glob(path.join(dataDir, "*/*/*.json"));
  const repos = await Promise.all(repoData.map(async (file) => {
    return JSON.parse(
      await fs.readFile(file, { encoding: "utf8" }),
    ) as RepoType;
  }));

  return {
    repos,
  };
};
