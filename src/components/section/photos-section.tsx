import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { HERO_REVEAL_DELAY } from "@/lib/hero-timing";

const BLUR_FADE_DELAY = 0.04;

export default function PhotosSection() {
  const photos = DATA.photos;

  return (
    <section id="photos">
      <div className="flex min-h-0 flex-col gap-y-4">
        <h2 className="text-xl font-bold">{DATA.sections.photos.heading}</h2>
        <div className="columns-2 sm:columns-3 gap-2">
          {photos.map((photo, idx) => (
            <BlurFade
              key={photo.src}
              delay={HERO_REVEAL_DELAY + BLUR_FADE_DELAY * 14 + idx * 0.05}
              className="mb-2 break-inside-avoid"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full rounded-xl object-cover"
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
