import { IoLogoGithub, IoLogoGitlab } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GoStar } from "react-icons/go";
import { RepoInfoWithTag } from "@/types/repo";

type RepoCardProps = {
  repo: RepoInfoWithTag;
};
export function RepoCard(props: RepoCardProps) {
  return (
    <div className="m-1">
      <div className="w-full rounded-md bg-gray-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 p-0.5 group">
        <div className="h-full rounded-md w-full bg-gray-800 text-white px-2 py-1">
          <div className="flex flex-auto flex-row justify-between items-center gap-1 flex-wrap">
            <h5 className="text-lg font-bold basis-4/6 md:basis-10/12">
              <a
                href={props.repo.url}
                className="hover:underline"
              >
                <span className="text-blue-400">{props.repo.owner}/</span>
                <span className="text-blue-200">{props.repo.name}</span>
              </a>
            </h5>
            {"data" in props.repo
              ? (
                <div className="basis-1/6 md:basis-1/12 flex items-center">
                  <GoStar className="mr-1" />
                  {props.repo.data.star}
                </div>
              )
              : <></>}
            <a href={props.repo.url} className="hover:underline">
              <RepoDomainIcon domain={props.repo.domain} />
            </a>
          </div>

          {"data" in props.repo
            ? (
              <div className="border-t-2 group-hover:border-t-orange-400 font-normal text-gray-300 flex flex-col">
                <div className="text-sm">
                  created at: {props.repo.data.createdAt}, last commit:{" "}
                  {props.repo.data.lastCommit}
                </div>
                <p>{props.repo.data.description}</p>
              </div>
            )
            : <></>}
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
