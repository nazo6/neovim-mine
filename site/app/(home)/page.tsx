import { getRepos } from "@/lib/getRepos";
import { getTagInfo } from "@/lib/getTags";
import { PageClient } from "./pageClient";
import { CommonHeader } from "@/components/CommonHeader";

export default async function Home() {
  const repos = await getRepos();
  const tagInfo = await getTagInfo();
  return (
    <PageClient repos={repos} tagInfo={tagInfo} header={<CommonHeader />} />
  );
}
