"use client";

import React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { IoCheckmark, IoChevronDown, IoChevronUp } from "react-icons/io5";

type SelectProps = {
  value: string;
  items: [string, string][];
  onChange: (value: string) => void;
};
export function Select(props: SelectProps) {
  return (
    <RadixSelect.Root value={props.value} onValueChange={props.onChange}>
      <RadixSelect.Trigger className="flex flex-row items-center justify-between py-1 px-2 w-full cursor-default rounded-md bg-white text-gray-900 shadow-sm">
        <RadixSelect.Value placeholder="" />
        <RadixSelect.Icon>
          <IoChevronUp />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal className="bg-white p-2 cursor-default rounded-sm mt-3">
        <RadixSelect.Content position="popper">
          <RadixSelect.ScrollUpButton>
            <IoChevronUp />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>
            {props.items.map(([label, value]) => (
              <RadixSelect.Item
                className="hover:bg-purple-300 hover:rounded-full flex flex-row items-center justify-between gap-2 m-1 py-1 px-3"
                key={value}
                value={value}
              >
                <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="SelectItemIndicator">
                  <IoCheckmark />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton>
            <IoChevronDown />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
