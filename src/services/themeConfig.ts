import { AppTheme, AppFont, TextScale } from '../types';

export interface ModeStyles {
  bgCanvas: string;
  bgSurface: string;
  bgCard: string;
  bgCardHover: string;
  border: string;
  borderCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentPill: string;
  accentSubtle: string;
  headerBg: string;
  footerBg: string;
  inputBg: string;
  statusChecked: string;
  statusPending: string;
  statusEmergency: string;
  heroButtonBlue: string;
  heroButtonRed: string;
  cardShape: string; // e.g. 'rounded-3xl' for floral, 'rounded-md' for mech
  badgeShape: string;
  archetypeBadge: string;
}

export interface AppThemeConfig {
  id: AppTheme;
  name: string;
  archetype: string;
  tagline: string;
  palettePreview: { light: string[]; dark: string[] };
  light: ModeStyles;
  dark: ModeStyles;
}

export const THEME_CONFIGS: Record<AppTheme, AppThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    archetype: 'Minimalist Security',
    tagline: 'Sleek executive safety with clear, modern high-contrast clarity',
    palettePreview: {
      light: ['#f1f5f9', '#ffffff', '#2563eb', '#10b981'],
      dark: ['#090d16', '#111827', '#3b82f6', '#10b981'],
    },
    light: {
      bgCanvas: 'bg-slate-100',
      bgSurface: 'bg-white',
      bgCard: 'bg-slate-50 border border-slate-200 shadow-xs',
      bgCardHover: 'hover:bg-slate-100/80',
      border: 'border-slate-200',
      borderCard: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      accent: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      accentHover: 'hover:bg-blue-700',
      accentPill: 'bg-blue-50 border-blue-200 text-blue-700 font-bold',
      accentSubtle: 'bg-blue-50 text-blue-700 border-blue-200',
      headerBg: 'bg-white/95 border-slate-200 shadow-xs',
      footerBg: 'from-slate-100 via-white/95 to-white/90 border-slate-200',
      inputBg: 'bg-white border-slate-300 text-slate-900',
      statusChecked: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      statusPending: 'bg-amber-50 border-amber-200 text-amber-900',
      statusEmergency: 'bg-red-50 border-red-300 text-red-900',
      heroButtonBlue: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 border-blue-400 shadow-blue-500/30',
      heroButtonRed: 'bg-gradient-to-br from-red-600 via-red-700 to-red-900 border-red-400 shadow-red-500/30',
      cardShape: 'rounded-2xl',
      badgeShape: 'rounded-full',
      archetypeBadge: 'Shield Guard',
    },
    dark: {
      bgCanvas: 'bg-slate-950',
      bgSurface: 'bg-slate-900',
      bgCard: 'bg-slate-800/80 border border-slate-700/80 shadow-md',
      bgCardHover: 'hover:bg-slate-800',
      border: 'border-slate-800',
      borderCard: 'border-slate-700/80',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      accent: 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm',
      accentHover: 'hover:bg-blue-500',
      accentPill: 'bg-blue-950/80 border-blue-800 text-blue-300 font-bold',
      accentSubtle: 'bg-blue-950/50 text-blue-300 border-blue-800/60',
      headerBg: 'bg-slate-900/95 border-slate-800',
      footerBg: 'from-slate-950 via-slate-900/95 to-slate-900/90 border-slate-800',
      inputBg: 'bg-slate-950/80 border-slate-700 text-slate-100',
      statusChecked: 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300',
      statusPending: 'bg-amber-950/60 border-amber-600/50 text-amber-300',
      statusEmergency: 'bg-red-950/80 border-red-600 text-red-200',
      heroButtonBlue: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border-blue-400 shadow-blue-900/80',
      heroButtonRed: 'bg-gradient-to-br from-red-600 via-rose-700 to-red-950 border-red-400 shadow-red-950/90',
      cardShape: 'rounded-2xl',
      badgeShape: 'rounded-full',
      archetypeBadge: 'Shield Guard',
    },
  },

  floral: {
    id: 'floral',
    name: 'Floral Haven',
    archetype: 'Botanical Harmony',
    tagline: 'Gentle organic petal contours, warm lavender-rose comfort, and tender family care',
    palettePreview: {
      light: ['#fff5f7', '#ffffff', '#db2777', '#10b981'],
      dark: ['#1c0c16', '#291321', '#f472b6', '#34d399'],
    },
    light: {
      bgCanvas: 'bg-[#fff4f6]',
      bgSurface: 'bg-[#fffbfc]',
      bgCard: 'bg-white border-2 border-rose-100/90 shadow-sm shadow-rose-100',
      bgCardHover: 'hover:bg-rose-50/50',
      border: 'border-rose-200/70',
      borderCard: 'border-rose-200/80',
      textPrimary: 'text-[#47122a]',
      textSecondary: 'text-[#7d3b58]',
      textMuted: 'text-[#ab758c]',
      accent: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-rose-200 shadow-md',
      accentHover: 'hover:opacity-95',
      accentPill: 'bg-rose-50 border-2 border-rose-200 text-rose-700 font-bold',
      accentSubtle: 'bg-rose-50/80 text-rose-700 border-rose-200',
      headerBg: 'bg-[#fffbfc]/95 border-rose-200/70 shadow-xs',
      footerBg: 'from-[#fff4f6] via-[#fffbfc]/95 to-[#fffbfc]/90 border-rose-200/70',
      inputBg: 'bg-white border-rose-200 text-[#47122a]',
      statusChecked: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-800',
      statusPending: 'bg-amber-50 border-2 border-amber-200 text-amber-900',
      statusEmergency: 'bg-rose-100 border-2 border-rose-400 text-rose-950',
      heroButtonBlue: 'bg-gradient-to-br from-pink-500 via-rose-600 to-purple-700 border-rose-200 shadow-rose-400/40',
      heroButtonRed: 'bg-gradient-to-br from-red-500 via-rose-600 to-red-800 border-rose-200 shadow-red-400/40',
      cardShape: 'rounded-3xl',
      badgeShape: 'rounded-2xl',
      archetypeBadge: '🌸 Botanical Care',
    },
    dark: {
      bgCanvas: 'bg-[#150a11]',
      bgSurface: 'bg-[#22101b]',
      bgCard: 'bg-[#2c1524] border border-rose-900/60 shadow-lg shadow-black/40',
      bgCardHover: 'hover:bg-[#381c30]',
      border: 'border-rose-900/50',
      borderCard: 'border-rose-800/60',
      textPrimary: 'text-rose-50',
      textSecondary: 'text-rose-200/80',
      textMuted: 'text-rose-400/60',
      accent: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-500 hover:to-rose-500 shadow-md',
      accentHover: 'hover:opacity-95',
      accentPill: 'bg-rose-950/80 border border-rose-700 text-rose-200 font-bold',
      accentSubtle: 'bg-rose-950/60 text-rose-200 border-rose-800/80',
      headerBg: 'bg-[#22101b]/95 border-rose-900/60',
      footerBg: 'from-[#150a11] via-[#22101b]/95 to-[#22101b]/90 border-rose-900/60',
      inputBg: 'bg-[#180b13] border-rose-800 text-rose-100',
      statusChecked: 'bg-emerald-950/60 border border-emerald-500/60 text-emerald-200',
      statusPending: 'bg-amber-950/60 border border-amber-500/60 text-amber-200',
      statusEmergency: 'bg-red-950/80 border border-red-500 text-red-200',
      heroButtonBlue: 'bg-gradient-to-br from-pink-600 via-rose-700 to-purple-900 border-pink-400 shadow-pink-900/60',
      heroButtonRed: 'bg-gradient-to-br from-red-600 via-rose-800 to-red-950 border-rose-400 shadow-red-950/90',
      cardShape: 'rounded-3xl',
      badgeShape: 'rounded-2xl',
      archetypeBadge: '🌸 Botanical Care',
    },
  },

  mech: {
    id: 'mech',
    name: 'Mech Guardian',
    archetype: 'Cyber Tactical Mecha',
    tagline: 'Precision engineered UI, chamfered tactical edges, and telemetry-grade status telemetry',
    palettePreview: {
      light: ['#e2e8f0', '#ffffff', '#0284c7', '#0d9488'],
      dark: ['#070b0e', '#0e171e', '#00f0ff', '#22c55e'],
    },
    light: {
      bgCanvas: 'bg-[#e2e8f0]',
      bgSurface: 'bg-[#edf2f7]',
      bgCard: 'bg-white border-2 border-slate-300 shadow-xs shadow-slate-300',
      bgCardHover: 'hover:bg-slate-50',
      border: 'border-slate-300',
      borderCard: 'border-slate-300',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      accent: 'bg-cyan-700 text-white hover:bg-cyan-600 font-mono tracking-wide shadow-xs',
      accentHover: 'hover:bg-cyan-600',
      accentPill: 'bg-cyan-50 border-2 border-cyan-400 text-cyan-900 font-mono font-bold',
      accentSubtle: 'bg-cyan-50 text-cyan-800 border-cyan-300 font-mono',
      headerBg: 'bg-[#edf2f7]/95 border-b-2 border-slate-300 shadow-xs',
      footerBg: 'from-[#e2e8f0] via-[#edf2f7]/95 to-[#edf2f7]/90 border-t-2 border-slate-300',
      inputBg: 'bg-white border-2 border-slate-300 text-slate-900 font-mono',
      statusChecked: 'bg-teal-50 border-2 border-teal-500 text-teal-950 font-mono',
      statusPending: 'bg-amber-50 border-2 border-amber-500 text-amber-950 font-mono',
      statusEmergency: 'bg-red-50 border-2 border-red-500 text-red-950 font-mono',
      heroButtonBlue: 'bg-gradient-to-br from-cyan-600 via-sky-700 to-slate-900 border-2 border-cyan-300 shadow-cyan-500/40',
      heroButtonRed: 'bg-gradient-to-br from-orange-600 via-red-600 to-black border-2 border-orange-400 shadow-orange-500/40',
      cardShape: 'rounded-md',
      badgeShape: 'rounded-xs font-mono uppercase',
      archetypeBadge: '⚡ TACTICAL MECH',
    },
    dark: {
      bgCanvas: 'bg-[#06090d]',
      bgSurface: 'bg-[#0b1219]',
      bgCard: 'bg-[#101b24] border border-cyan-900/60 shadow-lg shadow-black/70',
      bgCardHover: 'hover:bg-[#14232f] hover:border-cyan-500/50',
      border: 'border-cyan-950',
      borderCard: 'border-cyan-900/60',
      textPrimary: 'text-cyan-50',
      textSecondary: 'text-cyan-200/70',
      textMuted: 'text-cyan-500/50',
      accent: 'bg-cyan-500 text-slate-950 font-mono font-black hover:bg-cyan-400 shadow-cyan-500/30 shadow-lg',
      accentHover: 'hover:bg-cyan-400',
      accentPill: 'bg-cyan-950/90 border border-cyan-400/80 text-cyan-300 font-mono font-bold',
      accentSubtle: 'bg-cyan-950/50 text-cyan-300 border-cyan-800/80 font-mono',
      headerBg: 'bg-[#0b1219]/95 border-b border-cyan-900/60',
      footerBg: 'from-[#06090d] via-[#0b1219]/95 to-[#0b1219]/90 border-t border-cyan-900/60',
      inputBg: 'bg-[#080d12] border border-cyan-800 text-cyan-100 font-mono',
      statusChecked: 'bg-teal-950/80 border border-teal-400/80 text-teal-300 font-mono',
      statusPending: 'bg-amber-950/80 border border-amber-400/80 text-amber-300 font-mono',
      statusEmergency: 'bg-red-950/90 border-2 border-red-500 text-red-200 font-mono animate-pulse',
      heroButtonBlue: 'bg-gradient-to-br from-cyan-600 via-teal-700 to-slate-950 border-2 border-cyan-300 shadow-cyan-400/30 ring-2 ring-cyan-500/30',
      heroButtonRed: 'bg-gradient-to-br from-orange-600 via-red-700 to-black border-2 border-orange-400 shadow-orange-500/40 ring-2 ring-red-500/30',
      cardShape: 'rounded-md',
      badgeShape: 'rounded-xs font-mono uppercase tracking-wider',
      archetypeBadge: '⚡ TACTICAL MECH',
    },
  },

  linen: {
    id: 'linen',
    name: 'Warm Linen',
    archetype: 'Heritage Hearth',
    tagline: 'Gentle woven paper tones, handcrafted warmth, and comforting home fireplace serenity',
    palettePreview: {
      light: ['#ede4d4', '#fbf8f1', '#b85929', '#3e6b4d'],
      dark: ['#16120e', '#211b15', '#e07a38', '#529465'],
    },
    light: {
      bgCanvas: 'bg-[#ede4d4]',
      bgSurface: 'bg-[#faf6ed]',
      bgCard: 'bg-[#fffdfa] border-2 border-[#dfd3c0] shadow-sm shadow-[#dfd3c0]/40',
      bgCardHover: 'hover:bg-[#fff9ef]',
      border: 'border-[#dfd3c0]',
      borderCard: 'border-[#dfd3c0]',
      textPrimary: 'text-[#2a1d12]',
      textSecondary: 'text-[#68523c]',
      textMuted: 'text-[#967d64]',
      accent: 'bg-[#b85929] text-white hover:bg-[#a24b1f] shadow-sm',
      accentHover: 'hover:bg-[#a24b1f]',
      accentPill: 'bg-[#f7ece2] border-2 border-[#e7ccb9] text-[#933d15] font-bold',
      accentSubtle: 'bg-[#f8eee5] text-[#9e4319] border-[#e7ccb9]',
      headerBg: 'bg-[#faf6ed]/95 border-b-2 border-[#dfd3c0] shadow-xs',
      footerBg: 'from-[#ede4d4] via-[#faf6ed]/95 to-[#faf6ed]/90 border-t-2 border-[#dfd3c0]',
      inputBg: 'bg-[#fffdfa] border-2 border-[#dfd3c0] text-[#2a1d12]',
      statusChecked: 'bg-[#ebf5ed] border-2 border-[#b5d8bd] text-[#1c612f]',
      statusPending: 'bg-[#fbf2e3] border-2 border-[#f2d09c] text-[#845010]',
      statusEmergency: 'bg-[#faecea] border-2 border-[#f0ada6] text-[#952219]',
      heroButtonBlue: 'bg-gradient-to-br from-[#b85929] via-[#9e4319] to-[#59260d] border-2 border-[#f0c29d] shadow-[#b85929]/30',
      heroButtonRed: 'bg-gradient-to-br from-[#c93326] via-[#a32216] to-[#4f0c06] border-2 border-[#f5b3ad] shadow-red-700/30',
      cardShape: 'rounded-xl',
      badgeShape: 'rounded-lg',
      archetypeBadge: '🪵 Hearth & Home',
    },
    dark: {
      bgCanvas: 'bg-[#140e0a]',
      bgSurface: 'bg-[#1f1712]',
      bgCard: 'bg-[#291f19] border border-[#4a3a2e] shadow-lg shadow-black/50',
      bgCardHover: 'hover:bg-[#342720]',
      border: 'border-[#3f3127]',
      borderCard: 'border-[#4a3a2e]',
      textPrimary: 'text-[#faece0]',
      textSecondary: 'text-[#d4ba9f]',
      textMuted: 'text-[#9c8470]',
      accent: 'bg-[#d96c2e] text-white hover:bg-[#c2591e] shadow-md',
      accentHover: 'hover:bg-[#c2591e]',
      accentPill: 'bg-[#3b2416] border border-[#7d4829] text-[#f2ab7e] font-bold',
      accentSubtle: 'bg-[#362114] text-[#f2ab7e] border-[#6b3b1f]',
      headerBg: 'bg-[#1f1712]/95 border-b border-[#3f3127]',
      footerBg: 'from-[#140e0a] via-[#1f1712]/95 to-[#1f1712]/90 border-t border-[#3f3127]',
      inputBg: 'bg-[#18110c] border border-[#4d3a2d] text-[#faece0]',
      statusChecked: 'bg-[#122617] border border-[#2b5936] text-[#86e29c]',
      statusPending: 'bg-[#2b210e] border border-[#6b4e19] text-[#fed07a]',
      statusEmergency: 'bg-[#2b100d] border border-[#7a2822] text-[#fca59d]',
      heroButtonBlue: 'bg-gradient-to-br from-[#d96c2e] via-[#b85018] to-[#4a1c05] border-2 border-[#f2a874] shadow-[#d96c2e]/40',
      heroButtonRed: 'bg-gradient-to-br from-[#c93326] via-[#941b11] to-[#3b0804] border-2 border-[#f28e85] shadow-red-700/50',
      cardShape: 'rounded-xl',
      badgeShape: 'rounded-lg',
      archetypeBadge: '🪵 Hearth & Home',
    },
  },
};

export const FONTS: Record<AppFont, { id: AppFont; name: string; description: string; className: string }> = {
  lexend: {
    id: 'lexend',
    name: 'Lexend',
    description: 'Designed specifically by researchers to maximize legibility for seniors',
    className: 'font-lexend',
  },
  outfit: {
    id: 'outfit',
    name: 'Outfit',
    description: 'Friendly, balanced geometric sans with clear open letters',
    className: 'font-outfit',
  },
  jakarta: {
    id: 'jakarta',
    name: 'Plus Jakarta',
    description: 'Crisp modern digital sans with excellent character distinction',
    className: 'font-jakarta',
  },
};

export const TEXT_SCALES: Record<TextScale, { id: TextScale; label: string; scaleClass: string; desc: string }> = {
  normal: {
    id: 'normal',
    label: 'Standard',
    scaleClass: 'text-base',
    desc: 'Regular comfortable sizing',
  },
  large: {
    id: 'large',
    label: 'Senior Large (115%)',
    scaleClass: 'text-lg',
    desc: 'Recommended for elder readers',
  },
  'extra-large': {
    id: 'extra-large',
    label: 'Senior Extra-Large (130%)',
    scaleClass: 'text-xl',
    desc: 'Maximum visibility & touch targets',
  },
};

export function getActiveThemeStyles(theme: AppTheme, darkMode: boolean): ModeStyles {
  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.midnight;
  return darkMode ? config.dark : config.light;
}
