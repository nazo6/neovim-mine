import { ThemeButton } from "./ThemeButton";

export function CommonHeader() {
  return (
    <div className="flex flex-row w-full">
      <h1 className="text-center w-full">
        <span className="font-bold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Neovim Mine
        </span>
      </h1>
      <div className="pr-1">
        <ThemeButton />
      </div>
    </div>
  );
}
