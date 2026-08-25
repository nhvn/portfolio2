import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { cn, formatDate } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

interface Post {
  id: string;
  title: string;
  publishedAt: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface BlogListProps {
  posts: Post[];
  allPostsCount: number;
  pagination: Pagination;
}

function BackToHome() {
  // Touch devices have no real :hover, so press-and-hold stands in for it.
  const [isPressed, setIsPressed] = useState(false);

  return (
    <a
      href="/"
      className={cn(
        "text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1 inline-flex items-center gap-1 mb-6 group",
        isPressed && "text-foreground"
      )}
      aria-label="Back to Home"
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      <ChevronLeft
        className={cn(
          "size-3 group-hover:-translate-x-px transition-transform",
          isPressed && "-translate-x-px"
        )}
      />
      Back to Home
    </a>
  );
}

function BlogPostRow({ post, delay }: { post: Post; delay: number }) {
  // Touch devices have no real :hover, so press-and-hold stands in for it.
  const [isPressed, setIsPressed] = useState(false);

  return (
    <BlurFade delay={delay}>
      <a
        className="flex items-start gap-x-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href={`/blog/${post.id}`}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
      >
        <div className="flex flex-col gap-y-2 flex-1">
          <p className="tracking-tight text-lg font-medium">
            <span
              className={cn(
                "group-hover:text-foreground group-hover:underline underline-offset-4 transition-colors",
                isPressed && "text-foreground underline"
              )}
            >
              {post.title}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </a>
    </BlurFade>
  );
}

export default function BlogList({ posts, allPostsCount, pagination }: BlogListProps) {
  return (
    <section id="blog">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex justify-start gap-4 items-center">
          <BackToHome />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">
          Blog{" "}
          <span className="ml-1 bg-card border border-border rounded-md px-2 py-1 text-muted-foreground text-sm">
            {allPostsCount} posts
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          My personal reflections about web development, life, and more.
        </p>
      </BlurFade>

      {posts.length > 0 ? (
        <>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="flex flex-col gap-5">
              {posts.map((post, id) => (
                <BlogPostRow key={post.id} post={post} delay={BLUR_FADE_DELAY * 3 + id * 0.05} />
              ))}
            </div>
          </BlurFade>

          {pagination.totalPages > 1 && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex gap-3 flex-row items-center justify-between mt-8">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2 sm:justify-end">
                  {pagination.hasPreviousPage ? (
                    <a
                      href={`/blog?page=${pagination.page - 1}`}
                      className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Previous
                    </a>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Previous
                    </span>
                  )}
                  {pagination.hasNextPage ? (
                    <a
                      href={`/blog?page=${pagination.page + 1}`}
                      className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Next
                    </a>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Next
                    </span>
                  )}
                </div>
              </div>
            </BlurFade>
          )}
        </>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
            <p className="text-muted-foreground text-center">
              No blog posts yet. Check back soon!
            </p>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
