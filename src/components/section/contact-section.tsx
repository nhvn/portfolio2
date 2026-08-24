import { DATA } from "@/data/resume";
import Markdown from "react-markdown";

export default function ContactSection() {
  return (
    <div className="flex flex-col gap-y-3">
      <h2 className="text-xl font-bold">
        {DATA.sections.contact.label}
      </h2>
      <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
        <Markdown
          components={{
            a: ({ node, href, ...props }) => (
              <a
                {...props}
                href={href}
                {...(href?.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                className="font-semibold text-muted-foreground no-underline underline-offset-4 transition-colors hover:text-foreground hover:underline"
              />
            ),
          }}
        >
          {DATA.sections.contact.text}
        </Markdown>
      </div>
    </div>
  );
}

