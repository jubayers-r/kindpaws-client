export const CARD = "rounded-2xl shadow-md border-border/60 bg-card";

export const PAGE = "max-w-7xl mx-auto space-y-6 px-4 sm:px-8 py-8";

export const SECTION = "space-y-6";

export const PAGE_SECTION_ERROR =
  "rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm font-medium text-destructive";

export const TABLE_HEAD =
  "h-11 px-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export const TABLE_CELL = "px-3 py-3 align-middle";

export const ACTION_DESTRUCTIVE =
  "text-destructive hover:bg-destructive/10 hover:text-destructive";

export const SORT_HEAD =
  "group inline-flex items-center gap-1 hover:text-primary transition-colors";

export const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});
