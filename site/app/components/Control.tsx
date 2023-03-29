"use client";
import { ToggleGroup } from "@/components/ToggleGroup";
import {
  SortOrder,
  SortType,
  useSearchText,
  useSortOrder,
  useSortType,
} from "../page_store";
import { Select } from "@/components/Select";
import { useState } from "react";

export function Control() {
  const [sortType, setSortType] = useSortType();
  const [sortOrder, setSortOrder] = useSortOrder();
  const [searchText, setSearchText] = useSearchText();

  const [inputText, setInputText] = useState(searchText);

  return (
    <div className="flex flex-col gap-1 flex-wrap w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-center ">
          <span className="text-white">Sort type</span>
          <Select
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
      <div>
        <span className="text-white">Search</span>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.currentTarget.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.nativeEvent.isComposing || e.key !== "Enter") return;
            setSearchText(e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
}
