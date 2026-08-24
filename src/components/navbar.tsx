import { useEffect, useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { HERO_REVEAL_DELAY } from "@/lib/hero-timing";

const ICON_CLASS =
  "rounded-none cursor-pointer size-full p-0 text-muted-foreground hover:text-foreground transition-colors";

const TOOLTIP_CLASS =
  "rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]";

// Matches Tailwind's `lg` cutoff — below it the dock sits bottom-center and
// runs horizontally instead of down the left edge, so tooltips need to pop
// upward instead of to the side.
const DESKTOP_BREAKPOINT = "(min-width: 1024px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_BREAKPOINT).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export default function Navbar() {
  const isDesktop = useIsDesktop();
  const tooltipSide = isDesktop ? "right" : "top";

  return (
    <BlurFade
      delay={HERO_REVEAL_DELAY}
      className="pointer-events-none fixed z-30 bottom-4 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-4 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2"
    >
      <Dock className="z-50 pointer-events-auto relative flex flex-row lg:flex-col items-center justify-center gap-2 p-2 h-14 w-auto lg:h-auto lg:w-14 bg-background border border-border/60 lg:bg-transparent lg:border-none">
        {DATA.navbar.map((item) => {
          const isExternal = item.href.startsWith("http");
          const isHome = item.href === "/";
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (isHome && window.location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  <DockIcon className={ICON_CLASS}>
                    <item.icon className="size-full rounded-sm overflow-hidden object-contain" />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent side={tooltipSide} sideOffset={8} className={TOOLTIP_CLASS}>
                <p>{item.label}</p>
                <TooltipArrow className="fill-primary" />
              </TooltipContent>
            </Tooltip>
          );
        })}
        <Separator
          orientation="horizontal"
          className="h-2/3 w-px my-auto lg:h-px lg:w-2/3 lg:mx-auto lg:my-0 bg-black dark:bg-border"
        />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social], index) => {
            const isExternal = social.url.startsWith("http");
            const IconComponent = social.icon;
            return (
              <Tooltip key={`social-${name}-${index}`}>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <DockIcon className={ICON_CLASS}>
                      <IconComponent className="size-full rounded-sm overflow-hidden object-contain" />
                    </DockIcon>
                  </a>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide} sideOffset={8} className={TOOLTIP_CLASS}>
                  <p>{name === "email" ? "Email" : name}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })}
        <Separator
          orientation="horizontal"
          className="h-2/3 w-px my-auto lg:h-px lg:w-2/3 lg:mx-auto lg:my-0 bg-black dark:bg-border"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon className={ICON_CLASS}>
              <ModeToggle className="size-full cursor-pointer" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} sideOffset={8} className={TOOLTIP_CLASS}>
            <p>Night mode</p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </BlurFade>
  );
}
