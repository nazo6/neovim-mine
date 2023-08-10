import { getRepos } from "@/lib/getRepos";
import { getTagInfo } from "@/lib/getTags";
import { LayoutClient } from "./layoutClient";
import { CommonHeader } from "@/components/CommonHeader";
import { getCategories } from "@/lib/getCategories";

export default async function Home() {
  const repos = await getRepos();
  const tagInfo = await getTagInfo();
  const categoryInfo = await getCategories();
  return (
    <LayoutClient
      repos={repos}
      tagInfo={tagInfo}
      header={<CommonHeader />}
      categoryInfo={categoryInfo}
    />
  );
}
