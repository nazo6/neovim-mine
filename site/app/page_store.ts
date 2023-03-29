import { atom, useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function atomWithQueryParams<T extends string>(
  paramName: string,
  defaultParamValue: T,
) {
  const a = atom<T | null>(null);
  return function (): [T, (param: T) => void] {
    const [atomValue, setAtomValue] = useAtom(a);

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

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

export type SortType =
  | "star"
  | "repoName"
  | "ownerName"
  | "createdAt"
  | "lastCommit";
export const useSortType = atomWithQueryParams<SortType>("sort", "star");

export type SortOrder = "asc" | "desc";
export const useSortOrder = atomWithQueryParams<SortOrder>("order", "desc");
