import { getRepos } from "./getRepos";
import { CategoryInfo } from "./repoType";

export async function getCategories(): Promise<CategoryInfo[]> {
  const repos = await getRepos();

  const categoryInfo: CategoryInfo[] = [];

  for (const repo of repos) {
    for (const category of repo.category) {
      updateCategoryInfo(categoryInfo, category.data);
    }
  }

  return categoryInfo;
}

function updateCategoryInfo(
  categoryInfo: CategoryInfo[],
  category: { name: string; level: number }[],
): CategoryInfo[] {
  let categoryRef = categoryInfo;
  for (let i = 0; i < category.length; i++) {
    let ref = categoryRef.find((c) => c.name === category[i].name);
    if (!ref) {
      ref = {
        name: category[i].name,
        count: 0,
        child: [],
      };
      categoryRef.push(ref);
    } else {
      ref.count++;
    }
    categoryRef = ref.child;
  }
  return categoryRef;
}
