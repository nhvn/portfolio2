export function AwardRibbon({ label }: { label: string }) {
  return (
    // Sized in container query units (cqw) rather than fixed px — the same
    // ribbon needs to look right both tiny on a project card and much
    // bigger on the detail page's hero image, and fixed pixels only ever
    // matched one of those. The parent needs the `@container` class for
    // this to have something to scale against.
    <div
      className="absolute left-[-13.8cqw] top-[4cqw] z-10 w-[47.3cqw] -rotate-45 bg-[#f5b33e] py-[1.7cqw] text-center text-[4.6cqw] font-extrabold uppercase tracking-tight text-[#684d1d] shadow-md"
      style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
      aria-label={label}
    >
      {label}
    </div>
  );
}
