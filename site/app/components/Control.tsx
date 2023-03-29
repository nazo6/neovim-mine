"use client";
import { ToggleGroup } from "@/components/ToggleGroup";
import { SortOrder, SortType, useSortOrder, useSortType } from "../page_store";

export function Control() {
  const [sortType, setSortType] = useSortType();
  const [sortOrder, setSortOrder] = useSortOrder();

  return (
    <div className="flex flex-row gap-1 flex-wrap">
      <div className="flex items-center ">
        <span className="text-white">Sort type</span>
        <ToggleGroup
          value={sortType}
          items={[
            ["Star", "star"],
            ["Created", "createdAt"],
            ["Last commit", "lastCommit"],
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
  );
}
