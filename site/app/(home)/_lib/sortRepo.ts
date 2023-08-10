import { RepoInfoWithTag } from "@/lib/repoType";
import { SortOrder, SortType } from "../_store";

export function sortRepo(
  repo: RepoInfoWithTag[],
  sortType: SortType,
  sortOrder: SortOrder,
): RepoInfoWithTag[] {
  switch (sortType) {
    case "star":
      repo.sort((a, b) => {
        if ("data" in a && "data" in b) {
          return a.data.star - b.data.star;
        } else if ("data" in a) {
          return 1;
        } else if ("data" in b) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "createdAt":
      repo.sort((a, b) => {
        if ("data" in a && "data" in b) {
          return (
            new Date(a.data.createdAt).getTime() -
            new Date(b.data.createdAt).getTime()
          );
        } else if ("data" in a) {
          return 1;
        } else if ("data" in b) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "lastCommit":
      repo.sort((a, b) => {
        if ("data" in a && "data" in b) {
          return (
            new Date(a.data.lastCommit).getTime() -
            new Date(b.data.lastCommit).getTime()
          );
        } else if ("data" in a) {
          return 1;
        } else if ("data" in b) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "repoName":
      repo.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      break;
    case "ownerName":
      repo.sort((a, b) => {
        return a.owner.localeCompare(b.owner);
      });
      break;
  }

  if (sortOrder === "desc") {
    repo.reverse();
  }

  return repo;
}
