/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DATA } from "@/data/resume";
import { Briefcase, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="size-8 p-1 border rounded-none shadow ring-2 ring-border bg-muted flex-none" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="size-8 p-1 border rounded-none shadow ring-2 ring-border overflow-hidden object-contain flex-none"
      onError={() => setImageError(true)}
    />
  );
}

type Work = (typeof DATA.work)[number];

function WorkCard({ work }: { work: Work }) {
  return (
    <AccordionItem value={work.company} className="border-b-0">
      <AccordionTrigger className="hover:no-underline p-0 cursor-pointer transition-colors rounded-none group [&>svg]:hidden">
        <span className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 sm:justify-between w-full text-left">
          <span className="flex items-center gap-x-2 min-w-0">
            <LogoImage src={work.logoUrl} alt={work.company} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="font-semibold leading-none flex items-center gap-2 text-muted-foreground transition-colors group-hover:text-foreground">
                {work.company}
                <span className="relative inline-flex items-center w-3.5 h-3.5">
                  <ChevronRight
                    className={cn(
                      "absolute h-3.5 w-3.5 shrink-0 text-muted-foreground stroke-2 transition-all duration-300 ease-out",
                      "translate-x-0 opacity-0",
                      "group-hover:translate-x-1 group-hover:opacity-100",
                      "group-data-[state=open]:opacity-0 group-data-[state=open]:translate-x-0"
                    )}
                  />
                  <ChevronDown
                    className={cn(
                      "absolute h-3.5 w-3.5 shrink-0 text-muted-foreground stroke-2 transition-all duration-200",
                      "opacity-0 rotate-0",
                      "group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180"
                    )}
                  />
                </span>
              </span>
              <span className="font-sans text-xs text-muted-foreground block">{work.title}</span>
            </span>
          </span>
          <span className="text-xs tabular-nums text-muted-foreground sm:text-right flex-none pl-9 sm:pl-0">
            {work.start} - {work.end ?? DATA.sections.work.presentLabel}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="p-0 pt-2 text-xs text-muted-foreground">
        {work.description}
      </AccordionContent>
    </AccordionItem>
  );
}

const CAP_DOT_CLASS =
  "absolute left-3 -translate-x-1/2 size-2 rounded-full bg-black dark:bg-foreground z-10";

export default function WorkSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <div className="relative">
        <div
          className="absolute left-3 -top-4 -bottom-4 w-px bg-black dark:bg-border"
          aria-hidden
        />
        <div className={cn(CAP_DOT_CLASS, "-top-4 -translate-y-1/2")} aria-hidden />
        <div className={cn(CAP_DOT_CLASS, "-bottom-4 translate-y-1/2")} aria-hidden />
        <div className="flex flex-col gap-6">
          {DATA.work.map((work) => (
            <div key={work.company} className="relative pl-9">
              <div className="absolute left-3 top-0.5 -translate-x-1/2 z-10 size-5 flex items-center justify-center bg-background">
                <Briefcase className="size-4 text-black dark:text-foreground" strokeWidth={2} />
              </div>
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </div>
    </Accordion>
  );
}
