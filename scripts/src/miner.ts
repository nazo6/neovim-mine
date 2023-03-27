import { promisify } from "util";
import { exec as exec_orig } from "child_process";
import { basename, dirname, join } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs/promises";
import { Glob } from "glob";
import { Repo } from "./main";

const exec = promisify(exec_orig);

const ignored_files = ["**/CONTRIBUTING.md", "**/HOT_TO_MAKE.md"];

export async function mineRepos(url: string[]): Promise<Repo[]> {
  console.log(`Mining ${url.length} repos...`);
  const repos: Record<
    string,
    {
      domain: string;
      owner: string;
      name: string;
      category: {
        name: string;
        /// level 0 is filename
        level: number;
      }[][];
    }
  > = {};

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const repoDir = join(__dirname, "repo");

  for (const u of url) {
    console.log(`Cloning ${u}...`);
    await fs.rm(repoDir, { recursive: true, force: true });
    await exec(`git clone --depth 1 ${u} ${repoDir}`);

    const g = new Glob(join(repoDir, "/**/*.md"), { ignore: ignored_files });
    for await (const file of g) {
      const fileString = await fs.readFile(file, { encoding: "utf8" });
      const filename = basename(file);
      const headlines: (string | null)[] = [filename];
      fileString.split("\n").forEach((line) => {
        const headline = line.match(/^ *(?<level>#+) +(?<title>.+)/);
        if (headline?.groups?.level && headline?.groups?.title) {
          const level = headline.groups.level.length;
          headlines[level] = headline.groups.title;
          headlines.splice(level + 1);
        } else {
          const match = line.match(
            /(?<url>https?:\/\/(?<domain>([\w.-]+))\/(?<owner>[\w.~-]+)\/(?<name>[\w.~-]+))\/?(\)|\])/,
          );
          const groups = match?.groups;
          if (groups?.url && groups?.owner && groups?.name && groups?.domain) {
            const url = groups.url;
            const category: { name: string; level: number }[] = [];
            headlines.forEach((headline, i) => {
              if (headline) {
                category.push({ name: headline, level: i });
              }
            });
            if (!repos[url]) {
              repos[url] = {
                domain: groups.domain,
                owner: groups.owner,
                name: groups.name,
                category: [category],
              };
            } else {
              repos[url].category.push(category);
            }
          }
        }
      });
    }
  }

  const repoArr = Object.entries(repos).map(([url, repo]) => {
    return {
      ...repo,
      url,
    };
  });
  return repoArr;
}
