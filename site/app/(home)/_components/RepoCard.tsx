import { RelativeDate } from "@/components/RelativeDate";
import { RepoInfoWithTag } from "@/lib/repoType";
import { Star } from "lucide-react";
import { RepoLinkIcon } from "./RepoLinkIcon";
import { TagChip } from "@/components/TagChip";
import { useSelectedCategoryAtom, useSelectedTagAtom } from "../_store";

export function RepoCard({ repo }: { repo: RepoInfoWithTag }) {
  const [selectedTag, , addTag, removeTag] = useSelectedTagAtom();
  const [selectedCategory, , addCategory, removeCategory] =
    useSelectedCategoryAtom();
  return (
    <div className="m-1">
      <div className="w-full rounded-md bg-gray-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 p-0.5 group">
        <div className="h-full rounded-md w-full bg-gray-200 dark:bg-gray-800 px-2 py-1">
          <div className="flex flex-auto flex-row justify-between items-center gap-1 flex-wrap">
            <div className="mr-auto flex flex-row gap-1">
              <a
                href={repo.url}
                target="_blank"
                className="hover:underline flex flex-row items-center gap-1 text-lg font-bold"
              >
                <div>
                  <span className="text-blue-400 dark:text-blue-400">
                    {repo.owner}/
                  </span>
                  <span className="text-blue-600 dark:text-blue-200">
                    {repo.name}
                  </span>
                </div>

                <RepoLinkIcon domain={repo.domain} />
              </a>

              {"data" in repo
                ? (
                  <div className="flex flex-row items-center">
                    <Star color="yellow" size={20} />
                    {repo.data.star}
                  </div>
                )
                : null}
            </div>
            {"data" in repo && repo.data.isArchived
              ? (
                <div className="text-sm bg-yellow-100 text-black font-bold rounded-full px-2">
                  Archived
                </div>
              )
              : null}

            {"data" in repo
              ? (
                <div className="text-sm flex flex-row gap-2">
                  <div>
                    Create: <RelativeDate date={repo.data.createdAt} />
                  </div>
                  <div>
                    Update:{" "}
                    <RelativeDate date={repo.data.lastCommit} prefix="~" />
                  </div>
                </div>
              )
              : null}
          </div>

          <div className="border-t-2 border-t-gray-600 group-hover:border-t-orange-400 font-normal dark:text-gray-300 flex flex-col">
            {"data" in repo ? <p>{repo.data.description}</p> : null}
            <div className="flex flex-row flex-wrap gap-1 mt-0.5">
              {[
                ...new Set(
                  repo.category.map((c) => c.data.map((d) => d.name).join("/")),
                ),
              ].map((category) => {
                return (
                  <TagChip
                    checked={selectedCategory.includes(category)}
                    onChange={(c) => {
                      c ? addCategory(category) : removeCategory(category);
                    }}
                    key={category}
                  >
                    {category}
                  </TagChip>
                );
              })}
            </div>
            <div className="flex flex-row flex-wrap gap-1 mt-0.5">
              {repo.tag.map((tag) => (
                <TagChip
                  checked={selectedTag.includes(tag)}
                  onChange={(c) => {
                    c ? addTag(tag) : removeTag(tag);
                  }}
                  key={tag}
                >
                  {tag}
                </TagChip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
