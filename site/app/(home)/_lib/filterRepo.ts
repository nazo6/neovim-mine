import { RepoInfoWithTag } from "@/lib/repoType";

export function filterRepo(
  repo: RepoInfoWithTag[],
  searchText: string,
  selectedTag: string[],
  selectedCategory: string[],
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
  })
    .filter((r) => {
      if (selectedCategory.length === 0) {
        return true;
      }
      const repoCategories = r.category.map((c) =>
        c.data.map((d) => d.name).join("/")
      );
      if (selectedCategory.some((c) => repoCategories.includes(c))) {
        return true;
      }
      return false;
    });

  return r;
}
