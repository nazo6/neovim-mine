import { Check } from "lucide-react";

export function TagChip(
  props: {
    children: React.ReactNode;
    checked?: boolean;
    onChange?: (checked: boolean) => any;
  },
) {
  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={props.checked}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e.target.checked);
          }
        }}
      />
      <span
        className={`rounded-full px-2 inline-flex flex-row items-center gap-1 text-gray-200 ${
          props.checked ? "bg-sky-800" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {props.children}
        {props.checked ? <Check /> : null}
      </span>
    </label>
  );
}
