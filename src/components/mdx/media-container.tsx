/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";

interface MediaContainerProps {
  src: string;
  alt?: string;
  type?: "image" | "video";
  hoverVideoSrc?: string;
  className?: string;
}

export function MediaContainer({
  src,
  alt = "",
  type = "image",
  hoverVideoSrc,
  className = "",
}: MediaContainerProps) {
  return (
    <div className={cn("w-full rounded-lg overflow-hidden mb-3 relative group", className)}>
      {type === "image" ? (
        <img src={src} alt={alt} className="w-full h-auto block" style={{ margin: 0 }} />
      ) : (
        <video src={src} className="w-full h-auto block" style={{ margin: 0 }} controls />
      )}
      {type === "image" && hoverVideoSrc && (
        <video
          src={hoverVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </div>
  );
}

