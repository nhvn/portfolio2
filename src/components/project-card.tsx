/* eslint-disable @next/next/no-img-element */

import { AwardRibbon } from "@/components/award-ribbon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Gamepad2 } from "lucide-react";
import { useState } from "react";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="w-full h-full bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  slug?: string;
  blurb?: string;
  dates: string;
  image?: string;
  video?: string;
  playable?: boolean;
  award?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  slug,
  blurb,
  dates,
  image,
  video,
  playable,
  award,
  links,
  className,
}: Props) {
  const detailHref = slug ? `/projects/${slug}` : href || "#";
  const isInternal = Boolean(slug);

  return (
    <div
      className={cn(
        "group relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-border @container",
        className
      )}
    >
      {award && <AwardRibbon label={award} />}
      <a
        href={detailHref}
        {...(!isInternal && { target: "_blank", rel: "noopener noreferrer" })}
        className="absolute inset-0 block"
        aria-label={title}
      >
        {image ? <ProjectImage src={image} alt={title} /> : !video && <div className="w-full h-full bg-muted" />}
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className={cn(
              "w-full h-full object-cover",
              image && "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            )}
          />
        )}

        <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-white leading-tight">
            {playable && <Gamepad2 className="size-3.5 shrink-0" aria-label="Playable" />}
            {title}
          </h3>
          <time className="text-[11px] text-white/70">{dates}</time>
          {blurb && (
            <p className="text-xs text-white/85 leading-snug mt-1">{blurb}</p>
          )}
        </div>
      </a>

      {links && links.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-wrap gap-2 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
          {links.map((link, idx) => (
            <a
              href={link.href}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
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
      )}
    </div>
  );
}
