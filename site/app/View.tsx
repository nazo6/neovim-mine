"use client";
import { RepoInfo } from "@/../common/repo";
import { RepoList } from "@/components/RepoList";
import { ToggleGroup } from "@/components/ToggleGroup";
import { useState } from "react";

export type SortType = "star" | "repoName" | "ownerName";
export type SortOrder = "asc" | "desc";

type ViewProps = {
  repos: RepoInfo[];
};
export function View(props: ViewProps) {
  const [sortType, setSortType] = useState<SortType>("star");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  return (
    <>
      <div className="flex flex-row gap-1 flex-wrap">
        <div className="flex items-center ">
          <span className="text-white">Sort type</span>
          <ToggleGroup
            value={sortType}
            items={[
              ["Star", "star"],
              ["Name(repo)", "repoName"],
              ["Name(owner)", "ownerName"],
            ]}
            onChange={(value) => {
              if (value) {
                setSortType(value as SortType);
              }
            }}
          />
        </div>
        <div className="flex items-center ">
          <span className="text-white">Sort order</span>
          <ToggleGroup
            value={sortOrder}
            items={[
              ["Desc", "desc"],
              ["Asc", "asc"],
            ]}
            onChange={(value) => {
              if (value) {
                setSortOrder(value as SortOrder);
              }
            }}
          />
        </div>
      </div>
      <RepoList repos={props.repos} sortType={sortType} sortOrder={sortOrder} />
    </>
  );
}
