import { RepoInfoWithTag } from "@/lib/repoType";
import { Virtuoso } from "react-virtuoso";
import { RepoCard } from "./RepoCard";

export function RepoList({ repo }: { repo: RepoInfoWithTag[] }) {
  return (
    <Virtuoso
      useWindowScroll
      totalCount={repo.length}
      itemContent={(index) => <RepoCard repo={repo[index]} />}
    />
  );
}
