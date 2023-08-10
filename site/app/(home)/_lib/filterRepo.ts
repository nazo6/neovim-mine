import { RepoInfoWithTag } from "@/lib/repoType";

export function filterRepo(
  repo: RepoInfoWithTag[],
  searchText: string,
  selectedTag: string[],
) {
  const r = repo.filter(
    (r) => {
      if (searchText === "") {
        return true;
      }
      if (r.name.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
      if ("data" in r) {
        if (
          r.data.description?.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
  ).filter((r) => {
    if (selectedTag.length === 0) {
      return true;
    }
    if (selectedTag.some((t) => r.tag.includes(t))) {
      return true;
    }
    return false;
  });

  return r;
}
