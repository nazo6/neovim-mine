"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@nextui-org/react";

export function GoTopButton() {
  return (
    <Button
      aria-label="Go to top"
      isIconOnly
      className="drop-shadow-md"
      onClick={() => {
        window.scroll({ top: 0, behavior: "smooth" });
      }}
    >
      <ArrowUp className="" />
    </Button>
  );
}
