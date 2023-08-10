"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryInfo, TagInfo } from "@/lib/repoType";
import { useState } from "react";
import {
  SortOrder,
  SortType,
  useSearchTextAtom,
  useSortOrderAtom,
  useSortTypeAtom,
} from "../_store";
import { TagList } from "./Control/TagList";

export type ControlProps = {
  tagInfo: TagInfo;
  categoryInfo: CategoryInfo[];
};
export function Control(props: ControlProps) {
  const [filterOpen, setFilterOpen] = useState(true);

  const [sortType, setSortType] = useSortTypeAtom();
  const [searchText, setSearchText] = useSearchTextAtom();
  const [sortOrder, setSortOrder] = useSortOrderAtom();

  return (
    <div className="flex flex-col gap-1 p-2 h-full">
      <div className="grid grid-cols-4 place-items-center gap-1">
        <span className="col-span-1">Search</span>
        <Input
          className="col-span-3"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />

        <span className="col-span-1">Sort type</span>
        <div className="col-span-3">
          <Select
            defaultValue={sortType}
            onValueChange={(e) => {
              setSortType(e as SortType);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="star">Star</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="lastCommit">Updated</SelectItem>
              <SelectItem value="repoName">Name (repo)</SelectItem>
              <SelectItem value="ownerName">Name (owner)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="col-span-1">Sort order</span>
        <div className="col-span-3">
          <Select
            defaultValue={sortOrder}
            onValueChange={(e) => {
              setSortOrder(e as SortOrder);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-4 place-items-center p-1 border-t">
        <span className="col-span-1">Filter</span>
        <Button
          className="col-span-3"
          onClick={() => {
            setFilterOpen(!filterOpen);
          }}
        >
          Toggle
        </Button>
      </div>
      <div className="flex-grow">
        <div
          className={`flex flex-row flex-wrap gap-1 h-full overflow-x-hidden overflow-y-auto ${
            filterOpen ? "" : "hidden"
          }`}
        >
          <TagList {...props} />
        </div>
      </div>
    </div>
  );
}
