import type { RepoInfo } from "@/../common/repo";

export type RepoInfoWithTag = RepoInfo & {
  tag: (string | string[])[];
};
