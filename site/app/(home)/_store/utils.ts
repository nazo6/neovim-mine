import { atom, useAtom } from "jotai";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  name: string,
  value: string | string[],
) => {
  let params;
  if (typeof value === "string") {
    params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set(name, value);
  } else {
    const orig = Array.from(searchParams.entries()).filter((e) =>
      e[0] !== name
    );
    params = new URLSearchParams([
      ...orig,
      ...value.map((v) => [name, v]),
    ]);
  }

  return params.toString();
};

export function createStringParamAtom<T extends string>(
  key: string,
  replace: boolean,
  defaultValue: T,
) {
  const params = new URLSearchParams(
    typeof window === "object" ? document.location.search : [],
  );
  const paramAtom = atom(params.get(key) as T | null);

  return () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;
    const [value, setValue] = useAtom(paramAtom);

    return [
      value ?? defaultValue,
      (newValue: T) => {
        const newQueryString = createQueryString(
          searchParams,
          key,
          newValue,
        );
        const newUrl = `${pathname}?${newQueryString}`;
        setValue(newValue);
        if (replace) {
          router.replace(newUrl);
        } else {
          router.push(newUrl);
        }
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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;
    const [value, setValue] = useAtom(paramAtom);

    const set = (newValue: T[]) => {
      const newQueryString = createQueryString(
        searchParams,
        key,
        newValue,
      );
      const newUrl = `${pathname}?${newQueryString}`;
      setValue(newValue);
      if (replace) {
        router.replace(newUrl);
      } else {
        router.push(newUrl);
      }
    };

    return [
      value ?? defaultValue,
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
