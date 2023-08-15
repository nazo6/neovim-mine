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
import { Search } from "lucide-react";

export type ControlProps = {
  tagInfo: TagInfo;
  categoryInfo: CategoryInfo[];
};

const sortTypeMap = {
  star: "Star",
  createdAt: "Created",
  lastCommit: "Updated",
  repoName: "Name (repo)",
  ownerName: "Name (owner)",
};
const sortOrderMap = {
  normal: "Normal",
  reverse: "Reverse",
};

export function Control(props: ControlProps) {
  const [filterOpen, setFilterOpen] = useState(true);

  const [sortType, setSortType] = useSortTypeAtom();
  const [searchText, setSearchText] = useSearchTextAtom();
  const [sortOrder, setSortOrder] = useSortOrderAtom();

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Input
        className="w-full"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        placeholder="Search..."
        startContent={<Search />}
      />
      <div className="flex flex-row gap-2 border-t">
        <div className="flex-1 flex flex-col items-center">
          <span>Sort type</span>
          <Dropdown>
            <DropdownTrigger className="w-full">
              <Button>{sortTypeMap[sortType]}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort type"
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
        <div className="flex-1 flex flex-col items-center">
          <span>Sort order</span>
          <Dropdown>
            <DropdownTrigger className="w-full">
              <Button>{sortOrderMap[sortOrder]}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort order"
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
      <div className="border-t pt-2">
        <Button
          color="primary"
          variant="bordered"
          className="col-span-3 w-full"
          onClick={() => {
            setFilterOpen(!filterOpen);
          }}
        >
          {filterOpen ? "Close filter" : "Open filter"}
        </Button>
      </div>
      <div className="flex-grow">
        <div
          className={`flex flex-row flex-wrap gap-1 overflow-x-hidden overflow-y-auto ${
            filterOpen ? "h-[70vh] lg:h-full" : "hidden"
          }`}
        >
          <TagList {...props} />
        </div>
      </div>
    </div>
  );
}
