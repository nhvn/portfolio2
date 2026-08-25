/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { useState } from "react";

interface MediaContainerProps {
  src: string;
  alt?: string;
  type?: "image" | "video";
  hoverVideoSrc?: string;
  className?: string;
  children?: React.ReactNode;
}

export function MediaContainer({
  src,
  alt = "",
  type = "image",
  hoverVideoSrc,
  className = "",
  children,
}: MediaContainerProps) {
  const [isPressed, setIsPressed] = useState(false);
  // Touch devices have no real :hover, so press-and-hold stands in for it —
  // forced via inline style (always wins over the group-hover classes)
  // rather than toggling the classes themselves, so mouse hover on desktop
  // is completely untouched.
  const touchProps = hoverVideoSrc
    ? {
        onTouchStart: () => setIsPressed(true),
        onTouchEnd: () => setIsPressed(false),
        onTouchCancel: () => setIsPressed(false),
      }
    : {};

  return (
    <div
      className={cn(
        "w-full rounded-lg overflow-hidden mb-3 relative group @container",
        hoverVideoSrc && "select-none",
        className
      )}
      style={hoverVideoSrc ? { WebkitTouchCallout: "none" } : undefined}
      {...touchProps}
    >
      {children}
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
          style={isPressed ? { opacity: 1 } : undefined}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </div>
  );
}

