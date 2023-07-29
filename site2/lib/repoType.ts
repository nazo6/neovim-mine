import type { RepoInfo } from "@/../common/repo";

export type TagInfo = {
  name: string;
  count: number;
}[];

export type RepoInfoWithTag = RepoInfo & {
  tag: string[];
};

export type CategoryInfo = {
  name: string;
  count: number;
  child: CategoryInfo[];
};
