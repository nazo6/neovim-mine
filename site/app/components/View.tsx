"use client";
import { GoTopButton } from "@/components/GoTopButton";
import { RepoList } from "./RepoList";

import type { RepoInfoWithTag } from "@/types/repo";

type ViewProps = {
  repos: RepoInfoWithTag[];
};
export function View(props: ViewProps) {
  return (
    <>
      <GoTopButton />
      <RepoList repos={props.repos} />
    </>
  );
}
