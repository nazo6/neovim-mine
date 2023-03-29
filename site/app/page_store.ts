import { RepoInfoWithTag, TagInfo } from "@/types/repo";
import { atom, useAtom } from "jotai";
import { useSearchParams } from "next/navigation";

export function atomWithQueryParams<T extends string>(
  paramName: string,
  defaultParamValue: T,
) {
  const a = atom<T | null>(null);
  return function (): [T, (param: T) => void] {
    const [atomValue, setAtomValue] = useAtom(a);

    const searchParams = useSearchParams();

    const atomValueWithDefault = atomValue ??
      (searchParams.get(paramName) ?? defaultParamValue) as T;

    const setSortTypeWithRouter = (sortType: T) => {
      setAtomValue(sortType);

      const url = new URL(window.location.toString());
      url.searchParams.set(paramName, sortType);
      window.history.pushState({}, "", url);
    };

    return [atomValueWithDefault, setSortTypeWithRouter];
  };
}

export function atomWithArrayQueryParams<T extends string[]>(
  paramName: string,
  defaultParamValue: T,
) {
  const a = atom<T | null>(null);
  return function (): [T, (param: T) => void] {
    const [atomValue, setAtomValue] = useAtom(a);

    const searchParams = useSearchParams();

    const atomValueWithDefault = atomValue ??
      (searchParams.get(paramName)?.split(",") ?? defaultParamValue) as T;

    const setSortTypeWithRouter = (sortType: T) => {
      setAtomValue(sortType);

      const url = new URL(window.location.toString());
      url.searchParams.set(paramName, sortType.join(","));
      window.history.pushState({}, "", url);
    };

    return [atomValueWithDefault, setSortTypeWithRouter];
  };
}

export type SortType =
  | "star"
  | "repoName"
  | "ownerName"
  | "createdAt"
  | "lastCommit";
export const useSortType = atomWithQueryParams<SortType>("sort", "star");

export type SortOrder = "asc" | "desc";
export const useSortOrder = atomWithQueryParams<SortOrder>("order", "desc");

export const useSearchText = atomWithQueryParams<string>("q", "");

export const useTagFilter = atomWithArrayQueryParams<string[]>("q", []);

export const reposAtom = atom<RepoInfoWithTag[] | null>(null);
export const tagInfoAtom = atom<TagInfo | null>(null);
