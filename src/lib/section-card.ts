// Shared with anything that needs to visually blend into a "colored" section
// (e.g. the Work timeline's icon-masking background), so they never drift apart.
export const SECTION_CARD_COLOR_CLASS = "bg-[oklch(0.945_0_0)] dark:bg-[oklch(0.2_0_0)]";

// Negative margin exactly cancels the padding, so a card's text still lines
// up with plain (non-card) section text at the same left edge, while the
// card's own border/background sit slightly wider than the text column
// instead of flush with it. Not full-bleed — just a bit wider, centered.
export const SECTION_CARD_CLASS = `border rounded-xl -mx-5 sm:-mx-6 p-5 sm:p-6 ${SECTION_CARD_COLOR_CLASS}`;
