import { DATA } from "@/data/resume";

export const HERO_TYPE_START_DELAY = 400; // ms before typing begins
export const HERO_TYPE_SPEED = 90; // ms per character while typing
export const HERO_BACKSPACE_SPEED = 45; // ms per character while deleting
export const HERO_PAUSE_BEFORE_BACKSPACE = 500; // ms pause after the "typo"
export const HERO_PAUSE_BEFORE_RETYPE = 250; // ms pause once erased, before retyping
export const HERO_PAUSE_BEFORE_SUFFIX = 600; // ms pause after the corrected name, before adding the smiley
export const HERO_PAUSE_BEFORE_SUFFIX_BACKSPACE = 500; // ms pause showing the smiley before it's erased

const firstName = DATA.name.split(" ")[0];
export const HERO_TEXT = `Hi, I'm ${firstName}`;
export const HERO_MISTYPE = `Hey, im ${firstName.slice(0, 2).toLowerCase()}`;
// Backspacing stops after removing everything but the leading "H", which is
// then continued into the correct "Hi, I'm ..." instead of being erased too.
export const HERO_MISTYPE_KEEP_LENGTH = 1;
export const HERO_SUFFIX = "";

const SETTLE_BUFFER = 450; // ms after typing finishes before the rest of the page reveals
const SKIP_SETTLE_BUFFER = 80; // ms buffer used when the intro is skipped

function computeShouldPlayIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const [navEntry] = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const isReload = navEntry?.type === "reload";
    const alreadyPlayed = sessionStorage.getItem("heroIntroPlayed") === "1";
    sessionStorage.setItem("heroIntroPlayed", "1");
    return isReload || !alreadyPlayed;
  } catch {
    return true;
  }
}

// Computed once per page load: true on a hard refresh or the first visit
// this session, false when navigating back to "/" from elsewhere on the site.
export const HERO_PLAY_INTRO = computeShouldPlayIntro();

const HERO_TYPE_DURATION_MS = HERO_PLAY_INTRO
  ? HERO_TYPE_START_DELAY +
    HERO_MISTYPE.length * HERO_TYPE_SPEED +
    HERO_PAUSE_BEFORE_BACKSPACE +
    (HERO_MISTYPE.length - HERO_MISTYPE_KEEP_LENGTH) * HERO_BACKSPACE_SPEED +
    HERO_PAUSE_BEFORE_RETYPE +
    (HERO_TEXT.length - HERO_MISTYPE_KEEP_LENGTH) * HERO_TYPE_SPEED +
    (HERO_SUFFIX
      ? HERO_PAUSE_BEFORE_SUFFIX +
        HERO_SUFFIX.length * HERO_TYPE_SPEED +
        HERO_PAUSE_BEFORE_SUFFIX_BACKSPACE +
        HERO_SUFFIX.length * HERO_BACKSPACE_SPEED
      : 0)
  : 0;

// Seconds after which the rest of the page (avatar included) should begin
// its reveal, timed to start just after the hero name finishes typing out.
export const HERO_REVEAL_DELAY =
  (HERO_TYPE_DURATION_MS + (HERO_PLAY_INTRO ? SETTLE_BUFFER : SKIP_SETTLE_BUFFER)) / 1000;
