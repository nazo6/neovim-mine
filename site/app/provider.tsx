"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./theme-provider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  );
}
