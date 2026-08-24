import React from "react";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import TypewriterText from "@/components/magicui/typewriter-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SECTION_CARD_CLASS } from "@/lib/section-card";
import { DATA } from "@/data/resume";
import Markdown from "react-markdown";
import BlogPreviewSection from "@/components/section/blog-preview-section";
import ContactSection from "@/components/section/contact-section";
import PhotosSection from "@/components/section/photos-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import {
  HERO_REVEAL_DELAY,
  HERO_PLAY_INTRO,
  HERO_TYPE_SPEED,
  HERO_TYPE_START_DELAY,
  HERO_BACKSPACE_SPEED,
  HERO_PAUSE_BEFORE_BACKSPACE,
  HERO_PAUSE_BEFORE_RETYPE,
  HERO_PAUSE_BEFORE_SUFFIX,
  HERO_PAUSE_BEFORE_SUFFIX_BACKSPACE,
  HERO_TEXT,
  HERO_MISTYPE,
  HERO_MISTYPE_KEEP_LENGTH,
  HERO_SUFFIX,
} from "@/lib/hero-timing";

const BLUR_FADE_DELAY = 0.04;

interface BlogPost {
  id: string;
  title: string;
  publishedAt: string;
}

function getSectionComponents(posts: BlogPost[]): Record<string, React.ReactNode> {
  return {
  about: (
    <section id="about" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 3}>
        <div className={cn("flex min-h-0 flex-col gap-y-4", SECTION_CARD_CLASS)}>
          <h2 className="text-xl font-bold">{DATA.sections.about.heading}</h2>
          <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
            <Markdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="font-semibold text-muted-foreground no-underline underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  />
                ),
              }}
            >
              {DATA.summary}
            </Markdown>
          </div>
        </div>
      </BlurFade>
    </section>
  ),
  work: (
    <section id="work" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 5}>
        <div className="flex min-h-0 flex-col gap-y-9">
          <h2 className="text-xl font-bold">{DATA.sections.work.heading}</h2>
          <WorkSection />
        </div>
      </BlurFade>
    </section>
  ),
  education: (
    <section id="education" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 7}>
        <div className={cn("flex min-h-0 flex-col gap-y-6", SECTION_CARD_CLASS)}>
          <h2 className="text-xl font-bold">{DATA.sections.education.heading}</h2>
          <div className="flex flex-col gap-8">
            {DATA.education.map((education, index) => (
              <BlurFade key={education.school} delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 8 + index * 0.05}>
                <div className="group flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 sm:justify-between">
                  <div className="flex items-center gap-x-3 min-w-0">
                    {education.logoUrl ? (
                      <img
                        src={education.logoUrl}
                        alt={education.school}
                        className="size-8 md:size-10 p-1 border rounded-none shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                      />
                    ) : (
                      <div className="size-8 md:size-10 p-1 border rounded-none shadow ring-2 ring-border bg-muted flex-none" />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="text-sm font-semibold leading-none text-muted-foreground transition-colors group-hover:text-foreground">
                        {education.school}
                      </div>
                      <div className="font-sans text-sm text-muted-foreground transition-colors group-hover:text-foreground">{education.degree}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-foreground sm:text-right flex-none pl-11 sm:pl-0">
                    <span>{education.start} - {education.end}</span>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </BlurFade>
    </section>
  ),
  skills: (
    <section id="skills" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 9}>
        <div className="flex min-h-0 flex-col gap-y-4">
          <h2 className="text-xl font-bold">{DATA.sections.skills.heading}</h2>
          <div className="flex flex-wrap gap-1.5">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge variant="outline" className="h-7 px-3 text-xs font-medium border-[1.5px] border-foreground/35 text-muted-foreground transition-colors hover:text-foreground">
                  {skill.name}
                </Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </BlurFade>
    </section>
  ),
  projects: (
    <section id="projects" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 11}>
        <div className={SECTION_CARD_CLASS}>
          <ProjectsSection />
        </div>
      </BlurFade>
    </section>
  ),
  life: (
    <section id="life" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 13}>
        <div className="flex min-h-0 flex-col gap-y-6">
          <h2 className="text-xl font-bold">{DATA.sections.life.heading}</h2>
          <PhotosSection />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Latest Posts</h3>
          <BlogPreviewSection posts={posts} />
        </div>
      </BlurFade>
    </section>
  ),
  contact: (
    <section id="contact" className="scroll-mt-8">
      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 17}>
        <div className={SECTION_CARD_CLASS}>
          <ContactSection />
        </div>
      </BlurFade>
    </section>
  ),
  };
}

export default function HomePage({ posts }: { posts: BlogPost[] }) {
  const sectionComponents = getSectionComponents(posts);
  const orderedSections = Object.entries(DATA.sections)
    .filter(([, s]) => s.enabled)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key]) => key);

  // This page renders client-only, so a link like /#projects clicked from
  // another page (e.g. /blog) lands here before the target section exists
  // in the DOM. Left alone, the browser's native hash-scroll either fires
  // too early and drops you at the top, or jumps instantly the moment the
  // element appears — no visible scroll. Strip the hash immediately so
  // nothing native can jump the page, let the just-loaded home page paint
  // for a beat, then scroll there ourselves so it's an actual, visible
  // scroll down from the top.
  React.useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFade delay={BLUR_FADE_DELAY} yOffset={8}>
                <TypewriterText
                  className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                  text={HERO_TEXT}
                  mistype={HERO_MISTYPE}
                  mistypeKeepLength={HERO_MISTYPE_KEEP_LENGTH}
                  suffix={HERO_SUFFIX}
                  speed={HERO_TYPE_SPEED}
                  backspaceSpeed={HERO_BACKSPACE_SPEED}
                  startDelay={HERO_TYPE_START_DELAY}
                  pauseBeforeBackspace={HERO_PAUSE_BEFORE_BACKSPACE}
                  pauseBeforeRetype={HERO_PAUSE_BEFORE_RETYPE}
                  pauseBeforeSuffix={HERO_PAUSE_BEFORE_SUFFIX}
                  pauseBeforeSuffixBackspace={HERO_PAUSE_BEFORE_SUFFIX_BACKSPACE}
                  animate={HERO_PLAY_INTRO}
                />
              </BlurFade>
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={HERO_REVEAL_DELAY}
                text={
                  <>
                    <strong className="font-semibold text-[#6a9b8f]">Full-stack software engineer</strong> with a
                    passion for problem-solving, building across web, data, and{" "}
                    <strong className="font-semibold text-[#6a9b8f]">AI-driven</strong> products.
                  </>
                }
              />
            </div>
            <BlurFade delay={HERO_REVEAL_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 rounded-none shadow-[10px_16px_0_0_#000]">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      {orderedSections.map((key) => (
        <React.Fragment key={key}>
          {sectionComponents[key]}
        </React.Fragment>
      ))}
    </main>
    <footer className="w-full py-10 flex justify-center">
      <nav className="flex items-center gap-3 text-sm font-medium">
        <a
          href="/blog"
          className="text-foreground hover:underline underline-offset-4 transition-colors"
        >
          Blog
        </a>
        <span className="text-muted-foreground" aria-hidden>
          /
        </span>
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social], index, arr) => {
            const isExternal = social.url.startsWith("http");
            const label = name === "email" ? "Email" : name;
            return (
              <span key={`footer-social-${name}`} className="flex items-center gap-3">
                <a
                  href={social.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-foreground hover:underline underline-offset-4 transition-colors"
                >
                  {label}
                </a>
                {index < arr.length - 1 && (
                  <span className="text-muted-foreground" aria-hidden>
                    /
                  </span>
                )}
              </span>
            );
          })}
      </nav>
    </footer>
    </>
  );
}
