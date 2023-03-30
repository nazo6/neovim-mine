"use client";
import { ToggleGroup } from "@/components/ToggleGroup";
import {
  SortOrder,
  SortType,
  tagInfoAtom,
  useSearchText,
  useSortOrder,
  useSortType,
  useTagFilter,
} from "../page_store";
import { Select } from "@/components/Select";
import { useState } from "react";
import { useAtom } from "jotai";
import { Chip } from "@/components/Chip";

export function Control() {
  const [sortType, setSortType] = useSortType();
  const [sortOrder, setSortOrder] = useSortOrder();
  const [searchText, setSearchText] = useSearchText();
  const [, setTagFilter] = useTagFilter();
  const [tagInfo] = useAtom(tagInfoAtom);

  const [inputText, setInputText] = useState(searchText);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
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
      <div>
        <span className="text-white">Filter</span>
        <button className="bg-white" onClick={() => setFilterOpen(!filterOpen)}>
          Toggle
        </button>
        <div
          className={`flex flex-row flex-wrap gap-1 h-[70vh] overflow-auto ${
            filterOpen ? "" : "hidden"
          }`}
        >
          {tagInfo.filter((tag) => tag.count >= 2).sort((a, b) =>
            b.count - a.count
          ).map((tag) => (
            <Chip
              key={tag.tag}
              className="bg-orange-800 hover:bg-orange-600"
              onClick={() => {
                setTagFilter([tag.tag]);
              }}
            >
              {JSON.parse(tag.tag).join("/")}({tag.count})
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
