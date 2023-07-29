import { getRepos } from "./getRepos";
import { TagInfo } from "./repoType";

export async function getTagInfo(): Promise<TagInfo> {
  const repos = await getRepos();
  const tagsMap: Record<string, number> = {};
  repos.forEach((repo) => {
    repo.tag.forEach((tag) => {
      tagsMap[tag] = (tagsMap[tag] ?? 0) + 1;
    });
  });

  const tagInfo = Object.entries(tagsMap).map(([name, count]) => {
    return {
      name,
      count,
    };
  });
  tagInfo.sort((a, b) => b.count - a.count);

  return tagInfo;
}
