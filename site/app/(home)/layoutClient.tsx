"use client";

import { useState } from "react";
import { BurgerButton } from "./_components/BurgerButton";
import { CategoryInfo, RepoInfoWithTag, TagInfo } from "@/lib/repoType";
import { RepoList } from "./_components/RepoList";
import { Control } from "./_components/Control";

export function LayoutClient(
  props: {
    tagInfo: TagInfo;
    categoryInfo: CategoryInfo[];
    repos: RepoInfoWithTag[];
    header: React.ReactNode;
  },
) {
  const [burgerOpen, setBurgerOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row align-center fixed h-10 w-full z-20 backdrop-blur">
        <BurgerButton
          onClick={() => {
            setBurgerOpen(!burgerOpen);
          }}
          className="lg:hidden"
          opened={burgerOpen}
        />
        {props.header}
      </div>
      <div
        className={`pt-10 fixed w-full lg:w-96 z-10 bg-background h-full ${
          burgerOpen ? "" : "max-lg:hidden"
        }`}
      >
        <Control
          tagInfo={props.tagInfo}
          categoryInfo={props.categoryInfo}
        />
      </div>
      <div className={`pt-10 lg:ml-96`}>
        <RepoList
          repo={props.repos}
        />
      </div>
    </div>
  );
}
