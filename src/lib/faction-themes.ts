export interface FactionTheme {
  bg: string;
  bgSecondary: string;
  accent: string;
  accentHover: string;
  text: string;
  textMuted: string;
  border: string;
  glow: string;
}

export const DEFAULT_THEME: FactionTheme = {
  bg: "bg-gray-950",
  bgSecondary: "bg-gray-900",
  accent: "text-emerald-400",
  accentHover: "hover:text-emerald-300",
  text: "text-gray-100",
  textMuted: "text-gray-500",
  border: "border-gray-800",
  glow: "shadow-emerald-500/20",
};

export const FACTION_THEMES: Record<string, FactionTheme> = {
  council: {
    bg: "bg-slate-950",
    bgSecondary: "bg-slate-900",
    accent: "text-blue-400",
    accentHover: "hover:text-blue-300",
    text: "text-slate-100",
    textMuted: "text-slate-500",
    border: "border-slate-700",
    glow: "shadow-blue-500/20",
  },
  red_hand: {
    bg: "bg-neutral-950",
    bgSecondary: "bg-neutral-900",
    accent: "text-red-400",
    accentHover: "hover:text-red-300",
    text: "text-neutral-100",
    textMuted: "text-neutral-500",
    border: "border-red-900",
    glow: "shadow-red-500/20",
  },
  rebels: {
    bg: "bg-stone-950",
    bgSecondary: "bg-stone-900",
    accent: "text-amber-400",
    accentHover: "hover:text-amber-300",
    text: "text-stone-100",
    textMuted: "text-stone-500",
    border: "border-amber-900",
    glow: "shadow-amber-500/20",
  },
  civilians: {
    bg: "bg-zinc-950",
    bgSecondary: "bg-zinc-900",
    accent: "text-teal-400",
    accentHover: "hover:text-teal-300",
    text: "text-zinc-100",
    textMuted: "text-zinc-500",
    border: "border-zinc-700",
    glow: "shadow-teal-500/20",
  },
  infected: {
    bg: "bg-gray-950",
    bgSecondary: "bg-gray-900",
    accent: "text-purple-400",
    accentHover: "hover:text-purple-300",
    text: "text-gray-100",
    textMuted: "text-gray-600",
    border: "border-purple-900",
    glow: "shadow-purple-500/20",
  },
  observer: {
    bg: "bg-gray-950",
    bgSecondary: "bg-gray-900",
    accent: "text-emerald-400",
    accentHover: "hover:text-emerald-300",
    text: "text-gray-100",
    textMuted: "text-gray-500",
    border: "border-gray-800",
    glow: "shadow-emerald-500/20",
  },
};

export function getThemeForFaction(factionSlug: string | null): FactionTheme {
  if (!factionSlug) return DEFAULT_THEME;
  return FACTION_THEMES[factionSlug] ?? DEFAULT_THEME;
}

const FACTION_NAME_TO_SLUG: Record<string, keyof typeof FACTION_THEMES> = {
  "Совет": "council",
  "Красная Рука": "red_hand",
  "Повстанцы": "rebels",
  "Мирные жители": "civilians",
  "Заражённые": "infected",
};

export function getThemeForFactionName(name: string | null): FactionTheme {
  if (!name) return DEFAULT_THEME;
  const slug = FACTION_NAME_TO_SLUG[name];
  return slug ? FACTION_THEMES[slug] : DEFAULT_THEME;
}

export const FACTION_ACCENT_HEX: Record<string, string> = {
  observer: "#34d399",
  council: "#60a5fa",
  red_hand: "#f87171",
  rebels: "#fbbf24",
  civilians: "#2dd4bf",
  infected: "#c084fc",
};

export function getAccentHexForFactionName(name: string | null): string {
  if (!name) return FACTION_ACCENT_HEX.observer;
  const slug = FACTION_NAME_TO_SLUG[name];
  return slug ? FACTION_ACCENT_HEX[slug] : FACTION_ACCENT_HEX.observer;
}
