import { atom, useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { updateQueryString, useSearchParam } from "../_lib/useSearchParam";

export function createStringParamAtom<T extends string>(
  key: string,
  replace: boolean,
  defaultValue: T,
) {
  const useStringArrayParamAtom = createStringArrayParamAtom<T>(
    key,
    replace,
    [defaultValue],
  );

  return () => {
    const [value, setValue] = useStringArrayParamAtom();
    return [
      value[0],
      (newValue: T) => {
        setValue([newValue]);
      },
    ] as const;
  };
}

export function createStringArrayParamAtom<T extends string>(
  key: string,
  replace: boolean,
  defaultValue: T[],
) {
  const params = new URLSearchParams(
    typeof window === "object" ? document.location.search : [],
  );
  const paramAtom = atom(params.getAll(key) as T[]);

  return () => {
    const pathname = usePathname();
    const [value, setValue] = useAtom(paramAtom);

    const cb = () => {
      const newValue = new URLSearchParams(window.location.search).getAll(
        key,
      ) as T[];
      if (
        value.length != newValue.length ||
        value.some((v, i) => v !== newValue[i])
      ) {
        setValue(newValue);
      }
    };
    useEffect(() => {
      window.addEventListener("popstate", () => setTimeout(cb, 0));
      return () => {
        window.removeEventListener("popstate", cb);
      };
    });

    const set = (newValue: T[]) => {
      const newQueryString = updateQueryString(
        key,
        newValue,
      );
      const newUrl = `${pathname}?${newQueryString}`;
      setValue(newValue);
      if (replace) {
        window.history.replaceState(null, "", newUrl);
      } else {
        window.history.pushState(null, "", newUrl);
      }
    };

    return [
      value.length === 0 ? defaultValue : value,
      set,
      /// function to add value if not exist
      (newValue: T) => {
        if (!value.includes(newValue)) {
          set([...value, newValue]);
        }
      },
      /// function to remove value if exist
      (newValue: T) => {
        if (value.includes(newValue)) {
          set(value.filter((v) => v !== newValue));
        }
      },
    ] as const;
  };
}
