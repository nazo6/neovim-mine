import { TagChip } from "@/components/TagChip";
import { TagInfo } from "@/lib/repoType";
import { Virtuoso } from "react-virtuoso";
import { useSelectedTagAtom } from "../../_store";

export function TagList(props: { tagInfo: TagInfo }) {
  const [selectedTag, , addTag, removeTag] = useSelectedTagAtom();
  return (
    <Virtuoso
      style={{ "width": "100%", "height": "100%" }}
      totalCount={props.tagInfo.length}
      itemContent={(index) => (
        <div className="flex flex-row gap-1 flex-wrap my-1">
          <TagChip
            checked={selectedTag.includes(props.tagInfo[index].name)}
            onChange={(c) => {
              c
                ? addTag(props.tagInfo[index].name)
                : removeTag(props.tagInfo[index].name);
            }}
          >
            {props.tagInfo[index].name} ({props.tagInfo[index].count})
          </TagChip>
        </div>
      )}
    />
  );
}
