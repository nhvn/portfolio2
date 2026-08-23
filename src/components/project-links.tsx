import { Badge } from "@/components/ui/badge";

interface ProjectLinksProps {
  links: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
}

export function ProjectLinks({ links }: ProjectLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, idx) => (
        <a href={link.href} key={idx} target="_blank" rel="noopener noreferrer">
          <Badge
            className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
            variant="default"
          >
            {link.icon}
            {link.type}
          </Badge>
        </a>
      ))}
    </div>
  );
}
