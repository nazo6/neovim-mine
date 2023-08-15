import { createStringArrayParamAtom, createStringParamAtom } from "./utils";

export type SortType =
  | "star"
  | "createdAt"
  | "lastCommit"
  | "repoName"
  | "ownerName";
export type SortOrder = "normal" | "reverse";

export const useSortTypeAtom = createStringParamAtom<SortType>(
  "sort",
  false,
  "star",
);
export const useSortOrderAtom = createStringParamAtom<SortOrder>(
  "order",
  false,
  "normal",
);
export const useSearchTextAtom = createStringParamAtom<string>(
  "q",
  true,
  "",
);
export const useSelectedTagAtom = createStringArrayParamAtom<string>(
  "tag",
  false,
  [],
);
export const useSelectedCategoryAtom = createStringArrayParamAtom<string>(
  "category",
  false,
  [],
);
