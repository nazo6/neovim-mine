"use client";

import React from "react";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";

type ToggleGroupProps = {
  value: string;
  items: [string, string][];
  onChange: (value: string) => void;
};
export function ToggleGroup(props: ToggleGroupProps) {
  return (
    <RadixToggleGroup.Root
      className="flex flex-row h-10 bg-gray-600 w-fit rounded-full gap-1 px-1"
      type="single"
      value={props.value}
      onValueChange={props.onChange}
    >
      {props.items.map((item) => (
        <RadixToggleGroup.Item
          key={item[1]}
          className="radix-state-on:bg-gray-100 radix-state-on:rounded-full radix-state-on:text-black my-1 px-3 text-gray-100"
          value={item[1]}
        >
          {item[0]}
        </RadixToggleGroup.Item>
      ))}
    </RadixToggleGroup.Root>
  );
}
