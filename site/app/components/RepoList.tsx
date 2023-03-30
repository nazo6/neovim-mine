"use client";

import { Virtuoso } from "react-virtuoso";

import { RepoCard } from "@/components/RepoCard";
import { useEffect, useState } from "react";
import type { RepoInfoWithTag } from "@/types/repo";
import {
  reposAtom,
  useSearchText,
  useSortOrder,
  useSortType,
  useTagFilter,
} from "../page_store";
import { useAtom } from "jotai";

export function RepoList() {
  const [repos] = useAtom(reposAtom);
  const [sortedRepos, setSortedRepos] = useState<RepoInfoWithTag[]>(repos);
  const [sortType] = useSortType();
  const [sortOrder] = useSortOrder();
  const [searchText] = useSearchText();
  const [tagFilter] = useTagFilter();

  useEffect(() => {
    const newRepos = repos!.sort((a, b) => {
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
    }).filter((repo) => {
      if (searchText == "") return true;
      const text = searchText.toLowerCase();
      const basic = repo.name.toLowerCase().includes(text) ||
        repo.owner.toLowerCase().includes(text);
      let advanced = false;
      if ("data" in repo && !basic) {
        advanced = repo.data.description?.toLowerCase().includes(text) ?? false;
      }
      return basic || advanced;
    }).filter((repo) => {
      if (tagFilter.length == 0) return true;
      return repo.tag.some((tag) => tagFilter.includes(tag));
    });
    setSortedRepos(newRepos);
  }, [sortType, sortOrder, repos, searchText, tagFilter]);

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
