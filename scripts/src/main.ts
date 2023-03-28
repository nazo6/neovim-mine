import * as fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import stringify from "json-stable-stringify";
import { throttleAll } from "promise-throttle-all";
import sanitize from "sanitize-filename";

import { githubGql } from "./github";
import { mineRepos } from "./miner";

dotenv.config();

main();

async function main() {
  const repos = await mineRepos([
    "https://github.com/yutkat/my-neovim-pluginlist",
    "https://github.com/rockerBOO/awesome-neovim",
  ]);
  console.log("Repo count:" + repos.length);

  const { repos: resolvedRepos, notResolvedRepos: notResolvedRepos } =
    await githubGql(repos);

  const allRepos = [...resolvedRepos, ...notResolvedRepos];

  // await fs.writeFile("./a.json", stringify(allRepos, { space: 2 }));

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dataPath = join(__dirname, "../../data/data");

  await fs.rm(dataPath, { recursive: true, force: true });
  const tasks = allRepos.map((repo) => {
    return async () => {
      const group = repo.owner.match(/[^0-9A-Za-z]*(?<c>.)/)?.groups?.c?.charAt(
        0,
      ).toLowerCase();
      if (!group) throw Error;
      const filePath = join(
        dataPath,
        sanitize(repo.domain),
        group,
        sanitize(`${repo.owner}_${repo.name}.json`),
      );
      try {
        await fs.writeFile(filePath, stringify(repo, { space: 2 }));
      } catch (e: any) {
        if ("code" in e && e.code === "ENOENT") {
          await fs.mkdir(dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, stringify(repo, { space: 2 }));
        } else {
          throw e;
        }
      }
    };
  });
  await throttleAll(10, tasks);
}
