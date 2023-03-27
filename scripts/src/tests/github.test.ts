import { describe, expect, it } from "vitest";
import { githubGql } from "../github";

describe("githubGql", () => {
  it("Normal repo", async () => {
    const res = await githubGql([{
      url: "https://github.com/folke/lazy.nvim",
      domain: "github.com",
      owner: "folke",
      name: "lazy.nvim",
      category: [],
    }]);
    console.dir(res, { depth: null });
    expect(res.repos).toHaveLength(1);
    expect(res.notResolvedRepos).toHaveLength(0);
  });

  it("Repo that don't exist", async () => {
    const res = await githubGql([{
      url: "https://github.com/nazo6/vscode-is-the-best-editor.nvim",
      domain: "github.com",
      owner: "nazo6",
      name: "vscode-is-the-best-editor.nvim",
      category: [],
    }]);
    console.dir(res, { depth: null });
    expect(res.repos).toHaveLength(0);
    expect(res.notResolvedRepos).toHaveLength(1);
    expect(res.notResolvedRepos[0].error.reason).toBe("NOT_FOUND");
  });

  it("Repo other than github", async () => {
    const res = await githubGql([{
      url: "https://git.sr.ht/~whynothugo/lsp_lines.nvim",
      domain: "git.sr.ht",
      owner: "~whynothugo",
      name: "lsp_lines.nvim",
      category: [],
    }]);
    console.dir(res, { depth: null });
    expect(res.repos).toHaveLength(0);
    expect(res.notResolvedRepos).toHaveLength(1);
    expect(res.notResolvedRepos[0].error.reason).toBe("UNSUPPORTED_DOMAIN");
  });
});
