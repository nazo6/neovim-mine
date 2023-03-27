import { describe, expect, it } from "vitest";

import { mineRepos } from "../miner";

describe("mineRepos", () => {
  it("Make sure that repo has at least one category", async () => {
    const repos = await mineRepos([
      "https://github.com/yutkat/my-neovim-pluginlist",
    ]);
    repos.forEach((repo) => {
      expect(repo.category.length).toBeGreaterThanOrEqual(1);
    });
  });
});
