import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import { HERO_REVEAL_DELAY } from "@/lib/hero-timing";
import { ChevronDown } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;
const VISIBLE_COUNT = 4;

type Project = (typeof DATA.projects)[number];

function Card({ project }: { project: Project }) {
    return (
        <ProjectCard
            href={project.href}
            slug={project.slug}
            title={project.title}
            blurb={project.blurb}
            dates={project.dates}
            image={project.image}
            video={project.video}
            playable={project.playable}
            inProgress={project.inProgress}
            award={project.award}
            links={project.links}
        />
    );
}

export default function ProjectsSection() {
    const [expanded, setExpanded] = useState(false);
    const visibleProjects = DATA.projects.slice(0, VISIBLE_COUNT);
    const extraProjects = DATA.projects.slice(VISIBLE_COUNT);
    const hasMore = extraProjects.length > 0;

    return (
        <section id="projects">
            <div className="flex min-h-0 flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                    <h2 className="text-xl font-bold">{DATA.sections.projects.label}</h2>
                    <p className="text-muted-foreground text-balance">
                        {DATA.sections.projects.text}
                    </p>
                </div>

                {/* First few projects always visible, the rest smoothly expand below */}
                <div className="flex flex-col max-w-[800px] w-full mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {visibleProjects.map((project, id) => (
                            <BlurFade
                                key={project.title}
                                delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 12 + id * 0.05}
                                className="h-full"
                            >
                                <Card project={project} />
                            </BlurFade>
                        ))}
                    </div>
                    <AnimatePresence initial={false}>
                        {expanded && (
                            <motion.div
                                key="extra-projects"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                                    {extraProjects.map((project) => (
                                        <Card key={project.title} project={project} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {hasMore && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="mt-4 mx-auto flex items-center gap-1.5 text-sm font-medium border border-border rounded-xl px-4 py-1.5 hover:bg-muted/60 transition-colors cursor-pointer"
                        >
                            {expanded ? "Show less" : "Show more projects"}
                            <ChevronDown
                                className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                                aria-hidden
                            />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
