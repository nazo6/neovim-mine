import { useEffect, useState } from "react";

export const useSearchParam = (key: string) => {
  const [value, setValue] = useState(
    new URLSearchParams(window.location.search).getAll(key),
  );
  const cb = () => {
    console.log({ key, value });
    setValue(new URLSearchParams(window.location.search).getAll(key));
  };
  useEffect(() => {
    window.addEventListener("popstate", () => setTimeout(cb, 0));
    return () => {
      window.removeEventListener("popstate", cb);
    };
  });

  return value;
};

export const updateQueryString = (
  name: string,
  value: string[],
) => {
  let params;
  const searchParams = new URLSearchParams(window.location.search);
  const orig = Array.from(searchParams.entries()).filter((e) => e[0] !== name);
  params = new URLSearchParams([
    ...orig,
    ...value.map((v) => [name, v]),
  ]);

  return params.toString();
};
