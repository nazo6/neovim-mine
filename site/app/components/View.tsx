"use client";
import { GoTopButton } from "@/components/GoTopButton";
import { RepoList } from "./RepoList";

import type { RepoInfoWithTag, TagInfo } from "@/types/repo";
import { reposAtom, tagInfoAtom } from "../page_store";
import { useHydrateAtoms } from "jotai/utils";

type ViewProps = {
  repos: RepoInfoWithTag[];
  tagInfo: TagInfo;
};
export function View(props: ViewProps) {
  // @ts-ignore
  useHydrateAtoms([
    [reposAtom, props.repos],
    [tagInfoAtom, props.tagInfo],
  ]);

  return (
    <>
      <GoTopButton />
      <RepoList />
    </>
  );
}
