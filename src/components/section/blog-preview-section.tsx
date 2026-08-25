import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { ChevronRight } from "lucide-react";
import { cn, formatDate, formatDateShort } from "@/lib/utils";
import { HERO_REVEAL_DELAY } from "@/lib/hero-timing";

const BLUR_FADE_DELAY = 0.04;

interface Post {
  id: string;
  title: string;
  publishedAt: string;
}

function BlogRow({ post, delay }: { post: Post; delay: number }) {
  // Touch devices have no real :hover, so press-and-hold stands in for it.
  const [isPressed, setIsPressed] = useState(false);

  return (
    <BlurFade delay={delay}>
      <a
        href={`/blog/${post.id}`}
        className="flex items-center justify-between gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
      >
        <span className="flex items-center gap-1 min-w-0">
          <span
            className={cn(
              "text-muted-foreground transition-colors group-hover:text-foreground group-hover:underline underline-offset-4 truncate",
              isPressed && "text-foreground underline"
            )}
          >
            {post.title}
          </span>
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0",
              isPressed && "opacity-100 translate-x-0"
            )}
            aria-hidden
          />
        </span>
        <time className="text-xs text-muted-foreground flex-none">
          <span className="hidden sm:inline">{formatDate(post.publishedAt)}</span>
          <span className="sm:hidden">{formatDateShort(post.publishedAt)}</span>
        </time>
      </a>
    </BlurFade>
  );
}

export default function BlogPreviewSection({ posts }: { posts: Post[] }) {
  return (
    <div className="flex min-h-0 flex-col gap-y-4">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post, id) => (
            <BlogRow key={post.id} post={post} delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 10 + id * 0.05} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No blog posts yet. Check back soon!</p>
      )}

      <BlurFade delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 11}>
        <a
          href="/blog"
          className="text-sm font-medium inline-flex items-center gap-1 hover:underline underline-offset-4 w-fit"
        >
          View all posts
          <ChevronRight className="size-3.5" aria-hidden />
        </a>
      </BlurFade>
    </div>
  );
}
