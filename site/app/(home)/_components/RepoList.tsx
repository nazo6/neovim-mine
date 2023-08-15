import { RepoInfoWithTag } from "@/lib/repoType";
import { Virtuoso } from "react-virtuoso";
import { RepoCard } from "./RepoCard";
import { sortRepo } from "../_lib/sortRepo";
import { filterRepo } from "../_lib/filterRepo";
import {
  useSearchTextAtom,
  useSelectedCategoryAtom,
  useSelectedTagAtom,
  useSortOrderAtom,
  useSortTypeAtom,
} from "../_store";

type RepoListProps = {
  repo: RepoInfoWithTag[];
};
export function RepoList(props: RepoListProps) {
  const [sortType] = useSortTypeAtom();
  const [sortOrder] = useSortOrderAtom();
  const [searchText] = useSearchTextAtom();
  const [selectedTag] = useSelectedTagAtom();
  const [selectedCategory] = useSelectedCategoryAtom();

  const repo = filterRepo(
    sortRepo(props.repo, sortType, sortOrder),
    searchText,
    selectedTag,
    selectedCategory,
  );

  return (
    <Virtuoso
      useWindowScroll
      totalCount={repo.length}
      itemContent={(index) => <RepoCard repo={repo[index]} />}
    />
  );
}
