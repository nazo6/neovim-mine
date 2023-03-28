import * as path from "path";
import * as fs from "fs/promises";
import { glob } from "glob";

import { RepoInfo } from "common/repo";
import { View } from "./View";

async function getRepos() {
  const files = await glob(
    path.join(process.cwd(), "../data/data", "*/*/*.json"),
  );
  const repos = await Promise.all(files.map(async (path) => {
    const fileStr = await fs.readFile(path, { encoding: "utf8" });
    return JSON.parse(fileStr) as RepoInfo;
  }));
  return repos;
}

export default async function Home() {
  const repos = await getRepos();

  return (
    <div className="flex flex-col h-full">
      <div className="self-center">
        <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 w-fit">
          Neovim Mine
        </h1>
      </div>
      <View repos={repos} />
    </div>
  );
}
