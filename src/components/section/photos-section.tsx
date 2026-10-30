import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DATA } from "@/data/resume";

type Photo = { src: string; alt: string; width: number; height: number };

// Pages are measured in full justified rows rather than a fixed photo
// count — that's what keeps every page but the last one looking equally
// "full" regardless of how many photos happen to fit per row at a given
// width. The last page just gets whatever's left over.
const ROWS_PER_PAGE = 2;

const GAP_PX = 8;
const MIN_ROW_HEIGHT = 110;
const MAX_ROW_HEIGHT = 190;
// A row can grow at most this much past the target height (used for a
// leftover last row that doesn't have enough photos to justify normally) —
// keeps one or two stray photos from stretching into a giant tile.
const MAX_ROW_STRETCH = 1.35;

const SLIDE_TRANSITION = { duration: 0.55, ease: [0.32, 0.72, 0, 1] as const };
const SNAP_TRANSITION = { duration: 0 };
// Both pages ride the same underdamped spring, so the incoming one slides a
// touch past its resting spot and recoils back instead of stopping dead.
// The outgoing page must use the identical spring — on a different curve
// the two pages drift apart mid-slide and the old one unmounts while the
// new one is still recoiling, which reads as a hiccup at the end. Its own
// overshoot happens off-screen, so it's invisible.
const RECOIL_TRANSITION = { type: "spring", duration: 0.75, bounce: 0.3 } as const;

// Blocks rapid re-clicks from queueing up multiple page changes; long
// enough for the recoil to mostly settle so the next click only lands once the
// animation has fully settled, not right as it's finishing.
const CLICK_COOLDOWN_MS = 900;

// The gallery only ever shows photos ~200px tall, so it loads downscaled
// copies from /photos/thumbs (max 640px) instead of the multi-MB originals.
// Decoding a 3000px+ JPEG mid-slide was what made page changes stutter.
// Regenerate with: cd public/photos && sips -Z 640 <file> --out thumbs/<file>
function thumbSrc(src: string) {
  return src.replace("/photos/", "/photos/thumbs/");
}

type Row = { items: { photo: Photo; width: number }[]; height: number };

// Classic "justified gallery" packing: photos keep their real aspect ratio
// (no cropping to a fixed box), get laid out left-to-right at a shared row
// height, and once a row has enough photos to fill the container width,
// that row's height is solved for so it lands exactly edge-to-edge — no
// gap on the right. This is what makes it look like it's packed by shape
// instead of snapped into a uniform grid.
function layoutJustifiedRows(photos: Photo[], containerWidth: number, targetHeight: number): Row[] {
  if (containerWidth <= 0) return [];
  const rows: Row[] = [];
  let current: { photo: Photo; aspect: number }[] = [];
  let aspectSum = 0;

  const finalizeRow = (items: typeof current, height: number) => {
    rows.push({
      items: items.map(({ photo, aspect }) => ({ photo, width: height * aspect })),
      height,
    });
  };

  for (const photo of photos) {
    const aspect = photo.width / photo.height;
    current.push({ photo, aspect });
    aspectSum += aspect;
    const gapWidth = GAP_PX * (current.length - 1);
    const widthAtTarget = aspectSum * targetHeight + gapWidth;
    if (widthAtTarget >= containerWidth) {
      const rowHeight = Math.min(MAX_ROW_HEIGHT, (containerWidth - gapWidth) / aspectSum);
      finalizeRow(current, rowHeight);
      current = [];
      aspectSum = 0;
    }
  }
  if (current.length > 0) {
    const gapWidth = GAP_PX * (current.length - 1);
    const naturalWidth = aspectSum * targetHeight + gapWidth;
    // A leftover last row: justify it only if that doesn't stretch it too
    // far past the target height (a single leftover photo shouldn't balloon).
    const stretchedHeight = (containerWidth - gapWidth) / aspectSum;
    const rowHeight =
      naturalWidth < containerWidth && stretchedHeight <= targetHeight * MAX_ROW_STRETCH
        ? stretchedHeight
        : targetHeight;
    finalizeRow(current, rowHeight);
  }
  return rows;
}

function chunkRows(rows: Row[], size: number): Row[][] {
  const groups: Row[][] = [];
  for (let i = 0; i < rows.length; i += size) groups.push(rows.slice(i, i + size));
  return groups;
}

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page, setPage] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  // Height changes while the user hasn't clicked yet (images loading in,
  // initial measurement, etc.) should snap instantly, never animate — only
  // a height change caused by an actual page click should slide smoothly.
  const hasInteractedRef = useRef(false);
  const onCooldownRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const targetHeight = Math.min(MAX_ROW_HEIGHT, Math.max(MIN_ROW_HEIGHT, containerWidth / 4));
  // Rows are computed once across the whole photo set, then sliced into
  // pages — not the other way around — so a page boundary never falls
  // mid-row and every non-final page ends up equally full.
  const allRows = useMemo(
    () => layoutJustifiedRows(photos, containerWidth, targetHeight),
    [photos, containerWidth, targetHeight]
  );
  const pageGroups = useMemo(() => chunkRows(allRows, ROWS_PER_PAGE), [allRows]);
  const totalPages = Math.max(1, pageGroups.length);

  // A width change (resize, or the row math simply settling in on mount)
  // can shift how many rows/pages there are — if the current page index
  // no longer exists, snap back to the start instead of animating there.
  useEffect(() => {
    if (page >= totalPages) {
      hasInteractedRef.current = false;
      setPage(0);
    }
  }, [totalPages, page]);

  const rows = pageGroups[page] ?? [];

  // Thumbnails are small, so warm (fetch + decode) every page's images up
  // front — by the time a click swaps pages in, nothing new has to be
  // decoded while the slide animation is running.
  useEffect(() => {
    photos.forEach((photo) => {
      const img = new Image();
      img.src = thumbSrc(photo.src);
      img.decode?.().catch(() => {});
    });
  }, [photos]);

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
      ref={containerRef}
      className="relative overflow-hidden"
      animate={{ height: height ?? "auto" }}
      transition={hasInteractedRef.current ? SLIDE_TRANSITION : SNAP_TRANSITION}
    >
      <AnimatePresence initial={false}>
        <MeasuredPanel
          key={page}
          onHeightChange={setHeight}
          initial={{ x: "100%" }}
          animate={{ x: "0%", transition: RECOIL_TRANSITION }}
          exit={{ x: "-100%", transition: RECOIL_TRANSITION }}
          onClick={totalPages > 1 ? goNext : undefined}
          className={`absolute inset-x-0 top-0 flex flex-col select-none ${totalPages > 1 ? "cursor-pointer" : ""}`}
          style={{ gap: GAP_PX, willChange: "transform" }}
        >
          {rows.map((row, i) => (
            <div key={i} className="flex" style={{ gap: GAP_PX, height: row.height }}>
              {row.items.map(({ photo, width }) => (
                <img
                  key={photo.src}
                  src={thumbSrc(photo.src)}
                  alt={photo.alt}
                  decoding="async"
                  draggable={false}
                  className="rounded-[12px] object-cover"
                  style={{ width, height: row.height }}
                />
              ))}
            </div>
          ))}
        </MeasuredPanel>
      </AnimatePresence>
    </motion.div>
  );
}
