import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function ProjectLinks({ name, live, repo, className = "" }: { name: string; live?: string; repo?: string; className?: string }) {
  const style =
    "focus-ring glass inline-flex h-11 items-center gap-2 rounded-full px-5 font-medium text-ink";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}`} className={style}>
          Open it
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
      {repo && (
        <a href={repo} target="_blank" rel="noopener noreferrer" aria-label={`${name} source code on GitHub`} className={style}>
          <FaGithub className="size-4" aria-hidden />
          Source
        </a>
      )}
    </div>
  );
}
