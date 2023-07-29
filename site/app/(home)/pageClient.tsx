"use client";

import { useState } from "react";
import { BurgerButton } from "./components/BurgerButton";
import { RepoInfoWithTag, TagInfo } from "@/lib/repoType";
import { RepoList } from "./components/RepoList";
import { Control } from "./components/Control";

export function PageClient(
  props: {
    tagInfo: TagInfo;
    repos: RepoInfoWithTag[];
    header: React.ReactNode;
  },
) {
  const [burgerOpen, setBurgerOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row align-center fixed h-10 w-full z-10 bg-background">
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
        className={`pt-10 fixed w-full lg:w-96 z-20 bg-background h-full ${
          burgerOpen ? "" : "max-lg:hidden"
        }`}
      >
        <Control tagInfo={props.tagInfo} />
      </div>
      <div className={`pt-10 lg:ml-96`}>
        <RepoList repo={props.repos} />
      </div>
    </div>
  );
}
