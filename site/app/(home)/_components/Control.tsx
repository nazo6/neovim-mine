"use client";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
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
          <Dropdown>
            <DropdownTrigger className="w-full">
              <Button>{sortType}</Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => setSortType(key as SortType)}
              defaultSelectedKeys={[sortType]}
              selectionMode="single"
            >
              <DropdownItem key="star">Star</DropdownItem>
              <DropdownItem key="createdAt">Created</DropdownItem>
              <DropdownItem key="lastCommit">Updated</DropdownItem>
              <DropdownItem key="repoName">Name (repo)</DropdownItem>
              <DropdownItem key="ownerName">Name (owner)</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <span className="col-span-1">Sort order</span>
        <div className="col-span-3">
          <Dropdown>
            <DropdownTrigger className="w-full">
              <Button>{sortOrder}</Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => setSortOrder(key as SortOrder)}
              defaultSelectedKeys={[sortOrder]}
              selectionMode="single"
            >
              <DropdownItem key="normal">Normal</DropdownItem>
              <DropdownItem key="reverse">Reverse</DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
