"use client";

import { Virtuoso } from "react-virtuoso";

import { RepoInfo } from "common/repo";
import { RepoCard } from "./RepoCard";
import { SortOrder, SortType } from "@/app/View";
import { useEffect, useState } from "react";

type RepoListProps = {
  repos: RepoInfo[];
  sortType: SortType;
  sortOrder: SortOrder;
};

export function RepoList(props: RepoListProps) {
  const [sortedRepos, setSortedRepos] = useState<RepoInfo[]>(props.repos);

  useEffect(() => {
    const newRepos = props.repos.sort((a, b) => {
      if (props.sortType === "star") {
        const aStar = "data" in a ? a.data.star : 0;
        const bStar = "data" in b ? b.data.star : 0;

        if (aStar == 0 && bStar == 0) {
          return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) *
            (props.sortOrder == "asc" ? 1 : -1);
        }

        return (
          (aStar < bStar ? -1 : 1) *
          (props.sortOrder == "asc" ? 1 : -1)
        );
      } else if (props.sortType === "repoName") {
        return (
          (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) *
          (props.sortOrder == "asc" ? 1 : -1)
        );
      } else {
        return (
          (a.owner.toLowerCase() < b.owner.toLowerCase() ? -1 : 1) *
          (props.sortOrder == "asc" ? 1 : -1)
        );
      }
    });
    setSortedRepos(newRepos);
  }, [props.sortType, props.sortOrder]);

  return (
    <>
      <Virtuoso
        useWindowScroll
        totalCount={sortedRepos.length}
        defaultItemHeight={50}
        itemContent={(index) => <RepoCard repo={sortedRepos[index]} />}
      />
    </>
  );
}
