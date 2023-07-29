import { Menu, X } from "lucide-react";

export type BurgerButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  opened: boolean;
};
export function BurgerButton(props: BurgerButtonProps) {
  const { opened, ...p } = props;
  return (
    <button {...p}>
      {opened
        ? <X size="2em" className="fill-gray-400" />
        : <Menu size="2em" className="fill-gray-400" />}
    </button>
  );
}
