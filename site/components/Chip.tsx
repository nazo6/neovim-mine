type ChipProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Chip(props: ChipProps) {
  return (
    <div
      onClick={props.onClick}
      className={"rounded-md px-1 cursor-default " + props.className ?? ""}
    >
      {props.children}
    </div>
  );
}
