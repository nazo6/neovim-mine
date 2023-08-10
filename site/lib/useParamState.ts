import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function useParamState(
  key: string,
  replace?: boolean,
): [string | null, (newValue: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const [value, setValue] = useState<string | null>(searchParams.get(key));

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set(name, value);

    return params.toString();
  };

  return [
    value,
    (newValue: string) => {
      const newQueryString = createQueryString(key, newValue);
      const newUrl = `${pathname}?${newQueryString}`;
      setValue(newValue);
      if (replace) {
        router.replace(newUrl);
      } else {
        router.push(newUrl);
      }
    },
  ];
}
