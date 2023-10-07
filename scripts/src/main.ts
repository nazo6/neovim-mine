import * as fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import stringify from "json-stable-stringify";
import sanitize from "sanitize-filename";

import { githubGql } from "./github.js";
import { mineRepos } from "./miner.js";

dotenv.config();

const repos = await mineRepos([
  "https://github.com/yutkat/my-neovim-pluginlist",
  "https://github.com/rockerBOO/awesome-neovim",
]);
console.log("Repo count:" + repos.length);

const { repos: resolvedRepos, notResolvedRepos: notResolvedRepos } =
  await githubGql(repos);

const allRepos = [...notResolvedRepos, ...resolvedRepos];

const filteredRepos = allRepos.filter((repo) => {
  if ("error" in repo && repo.error.reason === "NOT_FOUND") return false;
  return true;
});
// Remove and merge duplicates
// This is needed because owner and repo name may be changed after resolving and as the result we may have duplicates
const mergedRepos = filteredRepos.filter(
  (repo, i) => {
    for (let j = i + 1; j < filteredRepos.length; j++) {
      if (
        repo.name === filteredRepos[j].name &&
        repo.owner === filteredRepos[j].owner &&
        repo.domain === filteredRepos[j].domain
      ) {
        filteredRepos[j].category.push(...repo.category);
        // console.log("Merged: " + repo.name);
        return false;
      }
    }
    return true;
  },
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "../../data/data");

await fs.rm(dataPath, { recursive: true, force: true });
await Promise.all(mergedRepos.map(async (repo) => {
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

console.log("Done. " + mergedRepos.length + "repos");
