import { createStringArrayParamAtom, createStringParamAtom } from "./utils";

export type SortType =
  | "star"
  | "createdAt"
  | "lastCommit"
  | "repoName"
  | "ownerName";
export type SortOrder = "asc" | "desc";

export const useSortTypeAtom = createStringParamAtom<SortType>(
  "sort",
  false,
  "star",
);
export const useSortOrderAtom = createStringParamAtom<SortOrder>(
  "order",
  false,
  "desc",
);
export const useSearchTextAtom = createStringParamAtom<string>(
  "q",
  true,
  "",
);
export const useSelectedTagAtom = createStringArrayParamAtom<string>(
  "tag",
  true,
  [],
);
