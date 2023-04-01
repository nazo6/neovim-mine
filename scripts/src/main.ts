import * as fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import stringify from "json-stable-stringify";
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

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dataPath = join(__dirname, "../../data/data");

  await fs.rm(dataPath, { recursive: true, force: true });
  const tasks = Promise.all(allRepos.map(async (repo) => {
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
    } catch (e: unknown) {
      if (typeof e == "object" && e && "code" in e && e.code === "ENOENT") {
        await fs.mkdir(dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, stringify(repo, { space: 2 }));
      } else {
        console.log(e);
        throw e;
      }
    }
  }));

  try {
    await tasks;
  } catch (e) {
    console.error(e);
  }

  console.log("Done. " + resolvedRepos.length + "repos");
}
