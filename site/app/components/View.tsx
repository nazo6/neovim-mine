"use client";
import { GoTopButton } from "@/components/GoTopButton";
import { RepoList } from "./RepoList";

import type { RepoInfoWithTag, TagInfo } from "@/types/repo";
import { reposAtom, tagInfoAtom } from "../page_store";
import { useAtom } from "jotai";

type ViewProps = {
  repos: RepoInfoWithTag[];
  tagInfo: TagInfo;
};
export function View(props: ViewProps) {
  const [, setRepos] = useAtom(reposAtom);
  const [, setTagInfo] = useAtom(tagInfoAtom);

  setRepos(props.repos);
  setTagInfo(props.tagInfo);

  return (
    <>
      <GoTopButton />
      <RepoList />
    </>
  );
}
