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
import { TagInfo } from "@/lib/repoType";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";

export function Control({ tagInfo }: { tagInfo: TagInfo }) {
  const [filterOpen, setFilterOpen] = useState(true);
  return (
    <div className="flex flex-col gap-1 p-2 h-full">
      <div className="grid grid-cols-4 place-items-center gap-1">
        <span className="col-span-1">Search</span>
        <Input className="col-span-3" />

        <span className="col-span-1">Sort type</span>
        <div className="col-span-3">
          <Select defaultValue="star">
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
          <Select defaultValue="asc">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <Virtuoso
            style={{ "width": "100%" }}
            totalCount={tagInfo.length}
            itemContent={(index) => (
              <div className="flex flex-row gap-1 flex-wrap my-1">
                {/* <TagChip tag={tag.tag} text={`${tag.tag} (${tag.count})`} />*/}
                {tagInfo[index].name} ({tagInfo[index].count})
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
