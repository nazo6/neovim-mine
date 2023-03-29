import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

extend(relativeTime);

type RelativeDateChipProps = {
  date: string;
  className?: string;
};
export function RelativeDateChip(props: RelativeDateChipProps) {
  const relDate = dayjs(props.date).fromNow();
  return (
    <div className={props.className}>
      {relDate}
    </div>
  );
}
