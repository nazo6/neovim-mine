import { IoLogoGithub, IoLogoGitlab } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GoStar } from "react-icons/go";
import { RepoInfoWithTag } from "@/types/repo";
import { RelativeDateChip } from "./RelativeDateChip";
import { Chip } from "./Chip";
import { useTagFilter } from "@/app/page_store";

type RepoCardProps = {
  repo: RepoInfoWithTag;
};
export function RepoCard(props: RepoCardProps) {
  const [, setTagFilter] = useTagFilter();
  return (
    <div className="m-1">
      <div className="w-full rounded-md bg-gray-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 p-0.5 group">
        <div className="h-full rounded-md w-full bg-gray-800 text-white px-2 py-1">
          <div className="flex flex-auto flex-row justify-between items-center gap-1 flex-wrap">
            <div className="text-lg font-bold mr-auto">
              <a
                href={props.repo.url}
                target="_blank"
                className="hover:underline flex flex-row items-center gap-1"
              >
                <div>
                  <span className="text-blue-400">{props.repo.owner}/</span>
                  <span className="text-blue-200">{props.repo.name}</span>
                </div>

                <RepoDomainIcon domain={props.repo.domain} />
              </a>
            </div>
            {"data" in props.repo
              ? (
                <>
                  <div className="text-sm flex flex-row">
                    created:{" "}
                    <RelativeDateChip date={props.repo.data.createdAt} />,
                    update:{" "}
                    <RelativeDateChip date={props.repo.data.lastCommit} />,
                  </div>
                  <div className="basis-1/6 md:basis-1/12 flex items-center">
                    <GoStar className="mr-1" color="yellow" />
                    {props.repo.data.star}
                  </div>
                </>
              )
              : <></>}
          </div>

          <div className="border-t-2 group-hover:border-t-orange-400 font-normal text-gray-300 flex flex-col gap-1">
            {"data" in props.repo
              ? <p>{props.repo.data.description}</p>
              : <></>}
            <div className="flex flex-row flex-wrap gap-1">
              {props.repo.tag.map((tag) => (
                <Chip
                  key={tag}
                  className="bg-orange-800 hover:bg-orange-600"
                  onClick={() => {
                    setTagFilter([tag]);
                  }}
                >
                  {JSON.parse(tag).join("/")}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepoDomainIcon({ domain }: { domain: string }) {
  const iconMap = {
    "github.com": <IoLogoGithub />,
    "gitlab.com": <IoLogoGitlab />,
  } as Record<string, JSX.Element>;
  return (
    <div className="flex items-center gap-1">
      {iconMap[domain] ?? domain}
      <FaExternalLinkAlt />
    </div>
  );
}
