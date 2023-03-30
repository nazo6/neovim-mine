import type { RepoInfo } from "@/../common/repo";

/// String array serialized to json
export type Tag = string;
export type TagInfo = {
  tag: Tag;
  count: number;
}[];

export type RepoInfoWithTag = RepoInfo & {
  tag: Tag[];
};
