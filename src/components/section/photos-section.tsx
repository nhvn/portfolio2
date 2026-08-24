import { useEffect, useRef, useState, type ComponentProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DATA } from "@/data/resume";

// Capped at 3 rows either way — 2 columns on mobile, 3 on larger screens —
// so a page's worth of photos never grows the section tall on a narrow
// screen; it just paginates a bit more instead.
const MOBILE_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;
const MOBILE_BREAKPOINT = "(max-width: 639px)"; // matches Tailwind's `sm` cutoff
const SLIDE_TRANSITION = { duration: 0.55, ease: [0.32, 0.72, 0, 1] as const };
const SNAP_TRANSITION = { duration: 0 };
// Blocks rapid re-clicks from queueing up multiple page changes; a bit
// longer than the slide duration so the next click only lands once the
// animation has fully settled, not right as it's finishing.
const CLICK_COOLDOWN_MS = 750;

// Each page gets its own fully isolated component instance (and therefore
// its own ref/effect/ResizeObserver) rather than sharing one ref object
// across the exiting and entering panels. Two AnimatePresence siblings
// briefly mount at once during a transition, and a shared ref gets
// reassigned/nulled by whichever one (un)mounts last — after enough
// clicks that race catches up and the height collapses to 0.
function MeasuredPanel({
  onHeightChange,
  children,
  ...motionProps
}: { onHeightChange: (h: number) => void; children: React.ReactNode } & ComponentProps<typeof motion.div>) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) onHeightChange(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [onHeightChange]);

  return (
    <motion.div ref={ref} {...motionProps}>
      {children}
    </motion.div>
  );
}

export default function PhotosSection() {
  const photos = DATA.photos;
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_BREAKPOINT).matches
      ? MOBILE_PAGE_SIZE
      : DESKTOP_PAGE_SIZE
  );
  const totalPages = Math.max(1, Math.ceil(photos.length / pageSize));
  const [page, setPage] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  // Height changes while the user hasn't clicked yet (images loading in,
  // initial measurement, etc.) should snap instantly, never animate — only
  // a height change caused by an actual page click should slide smoothly.
  const hasInteractedRef = useRef(false);
  const onCooldownRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const applyPageSize = (isMobile: boolean) => {
      setPageSize(isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
      // A page size change shifts how photos are grouped, so the current
      // page index no longer means the same thing — snap back to the
      // start instead of animating to whatever now sits at that index.
      hasInteractedRef.current = false;
      setPage(0);
    };
    const onChange = (e: MediaQueryListEvent) => applyPageSize(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const start = page * pageSize;
  const pagePhotos = photos.slice(start, start + pageSize);

  // The stutter on click wasn't the transition itself — it was the browser
  // decoding a handful of brand-new <img> elements for the first time at
  // the exact moment the slide animation started. Warming the next page's
  // images in the background as soon as the current one settles means
  // they're already decoded and cached by the time a click actually swaps
  // pages in.
  useEffect(() => {
    if (totalPages <= 1) return;
    const nextPage = (page + 1) % totalPages;
    const nextStart = nextPage * pageSize;
    const nextPhotos = photos.slice(nextStart, nextStart + pageSize);
    nextPhotos.forEach((photo) => {
      const img = new Image();
      img.src = photo.src;
    });
  }, [page, pageSize, totalPages, photos]);

  const goNext = () => {
    if (onCooldownRef.current) return;
    onCooldownRef.current = true;
    setTimeout(() => {
      onCooldownRef.current = false;
    }, CLICK_COOLDOWN_MS);

    hasInteractedRef.current = true;
    setPage((p) => (p + 1) % totalPages);
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      animate={{ height: height ?? "auto" }}
      transition={hasInteractedRef.current ? SLIDE_TRANSITION : SNAP_TRANSITION}
    >
      <AnimatePresence initial={false}>
        <MeasuredPanel
          key={page}
          onHeightChange={setHeight}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={SLIDE_TRANSITION}
          onClick={totalPages > 1 ? goNext : undefined}
          className={`absolute inset-x-0 top-0 columns-2 sm:columns-3 gap-2 ${totalPages > 1 ? "cursor-pointer" : ""}`}
        >
          {pagePhotos.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto rounded-[12px] mb-2 break-inside-avoid"
            />
          ))}
        </MeasuredPanel>
      </AnimatePresence>
    </motion.div>
  );
}
