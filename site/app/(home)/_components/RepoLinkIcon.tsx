import { ExternalLink, Github, Gitlab } from "lucide-react";

export function RepoLinkIcon({ domain }: { domain: string }) {
  let icon = null;
  switch (domain) {
    case "github.com":
      icon = <Github size={20} />;
      break;
    case "gitlab.com":
      icon = <Gitlab size={20} />;
      break;
    default:
      icon = <ExternalLink size={20} />;
      break;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      <span className="text-sm">{domain}</span>
      {icon}
    </div>
  );
}
