import { DATA } from "@/data/resume";

export const HERO_TYPE_START_DELAY = 400; // ms before typing begins
export const HERO_TYPE_SPEED = 90; // ms per character while typing
export const HERO_BACKSPACE_SPEED = 45; // ms per character while deleting
export const HERO_PAUSE_BEFORE_BACKSPACE = 700; // ms pause after the greeting
export const HERO_PAUSE_BEFORE_RETYPE = 250; // ms pause once erased, before retyping
export const HERO_PAUSE_BEFORE_SUFFIX = 600; // ms pause after the corrected name, before adding the smiley
export const HERO_PAUSE_BEFORE_SUFFIX_BACKSPACE = 500; // ms pause showing the smiley before it's erased

const firstName = DATA.name.split(" ")[0];
export const HERO_TEXT = `Hi, I'm ${firstName}`;

// Greeting for the viewer's local time of day. HomePage is client-only, so
// this always reads the visitor's clock rather than the server's.
function computeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

// Typed first, then fully erased before "Hi, I'm ..." is typed in its place.
export const HERO_GREETING = computeGreeting();
export const HERO_GREETING_KEEP_LENGTH = 0;
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
    HERO_GREETING.length * HERO_TYPE_SPEED +
    HERO_PAUSE_BEFORE_BACKSPACE +
    (HERO_GREETING.length - HERO_GREETING_KEEP_LENGTH) * HERO_BACKSPACE_SPEED +
    HERO_PAUSE_BEFORE_RETYPE +
    (HERO_TEXT.length - HERO_GREETING_KEEP_LENGTH) * HERO_TYPE_SPEED +
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
