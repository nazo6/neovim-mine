"use client";

import { Virtuoso } from "react-virtuoso";

import { RepoCard } from "@/components/RepoCard";
import { useEffect, useState } from "react";
import type { RepoInfoWithTag } from "@/types/repo";
import { useSortOrder, useSortType } from "../page_store";

type RepoListProps = {
  repos: RepoInfoWithTag[];
};

export function RepoList(props: RepoListProps) {
  const [sortedRepos, setSortedRepos] = useState<RepoInfoWithTag[]>(
    props.repos,
  );
  const [sortType] = useSortType();
  const [sortOrder] = useSortOrder();

  useEffect(() => {
    const newRepos = props.repos.sort((a, b) => {
      const order = sortOrder == "asc" ? 1 : -1;

      let fallingback = false;
      if (sortType == "star") {
        const aStar = "data" in a ? a.data.star : 0;
        const bStar = "data" in b ? b.data.star : 0;
        if (aStar != bStar) {
          return (aStar < bStar ? -1 : 1) * order;
        }
        fallingback = true;
      }
      if (sortType == "createdAt") {
        const aDate = "data" in a ? Date.parse(a.data.createdAt) : 0;
        const bDate = "data" in b ? Date.parse(b.data.createdAt) : 0;
        if (aDate != bDate) {
          return (aDate < bDate ? -1 : 1) * order;
        }
        fallingback = true;
      }
      if (sortType == "lastCommit") {
        const aCommit = "data" in a ? Date.parse(a.data.lastCommit) : 0;
        const bCommit = "data" in b ? Date.parse(b.data.lastCommit) : 0;
        if (aCommit != bCommit) {
          return (aCommit < bCommit ? -1 : 1) * order;
        }
        fallingback = true;
      }
      if (sortType == "ownerName") {
        if (a.owner != b.owner) {
          return (a.owner.toLowerCase() < b.owner.toLowerCase() ? -1 : 1) *
            order;
        }
        fallingback = true;
      }
      if (sortType == "repoName" || fallingback) {
        return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * order;
      }

      throw Error("Unknown sort type");
    });
    setSortedRepos(newRepos);
  }, [sortType, sortOrder, props.repos]);

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
