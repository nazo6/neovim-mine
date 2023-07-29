import { ExternalLink, Github, Gitlab } from "lucide-react";

export function RepoLinkIcon({ domain }: { domain: string }) {
  let icon = null;
  switch (domain) {
    case "github.com":
      icon = <Github />;
      break;
    case "gitlab.com":
      icon = <Gitlab />;
      break;
    default:
      icon = <ExternalLink />;
      break;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      {icon}
    </div>
  );
}
