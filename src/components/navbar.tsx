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

export default function Navbar() {
  return (
    // The full dock has nowhere to sit on mobile without covering page
    // content (bottom-center blocked link taps, and there's no room on the
    // side), so it's desktop-only. Mobile just follows the system color
    // scheme with no manual override.
    <BlurFade
      delay={HERO_REVEAL_DELAY}
      className="hidden lg:block pointer-events-none fixed z-30 left-4 top-1/2 -translate-y-1/2"
    >
      <Dock className="z-50 pointer-events-auto relative flex flex-col items-center justify-center gap-2 p-2 h-auto w-14">
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
              <TooltipContent side="right" sideOffset={8} className={TOOLTIP_CLASS}>
                <p>{item.label}</p>
                <TooltipArrow className="fill-primary" />
              </TooltipContent>
            </Tooltip>
          );
        })}
        <Separator orientation="horizontal" className="h-px w-2/3 mx-auto bg-black dark:bg-border" />
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
                <TooltipContent side="right" sideOffset={8} className={TOOLTIP_CLASS}>
                  <p>{name === "email" ? "Email" : name}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })}
        <Separator orientation="horizontal" className="h-px w-2/3 mx-auto bg-black dark:bg-border" />
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon className={ICON_CLASS}>
              <ModeToggle className="size-full cursor-pointer" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className={TOOLTIP_CLASS}>
            <p>Night mode</p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </BlurFade>
  );
}
