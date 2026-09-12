import React, { useState } from 'react';
import {
  FamilyGroup,
  Member,
  AppTheme,
  AppFont,
  TextScale,
  SubscriptionPlan,
} from '../types';
import {
  THEME_CONFIGS,
  FONTS,
  TEXT_SCALES,
  ModeStyles,
  AppThemeConfig,
} from '../services/themeConfig';
import {
  X,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  Users,
  UserPlus,
  Palette,
  Type,
  Maximize2,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
  Crown,
  Sparkles,
  ShieldCheck,
  Flower2,
  Cpu,
  Bookmark,
  Code2,
  Mic,
  BellRing,
  PhoneCall,
  HeartHandshake,
} from 'lucide-react';
import { triggerHaptic } from '../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: FamilyGroup;
  activeMember: Member | null;
  theme: AppTheme;
  onSelectTheme: (t: AppTheme) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  font: AppFont;
  onSelectFont: (f: AppFont) => void;
  textScale: TextScale;
  onSelectTextScale: (s: TextScale) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  subscription: SubscriptionPlan;
  onOpenCarePlus: () => void;
  onOpenProfile?: () => void;
  onSwitchUser: (uid: string) => void;
  onOpenFlutterCode: () => void;
  onOpenOnboarding: () => void;
  onOpenStartup: () => void;
  onSignOut: () => void;
  onResetDemo: () => void;
  modeStyles: ModeStyles;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  group,
  activeMember,
  theme,
  onSelectTheme,
  darkMode,
  onToggleDarkMode,
  font,
  onSelectFont,
  textScale,
  onSelectTextScale,
  soundEnabled,
  onToggleSound,
  subscription,
  onOpenCarePlus,
  onOpenProfile,
  onSwitchUser,
  onOpenFlutterCode,
  onOpenOnboarding,
  onOpenStartup,
  onSignOut,
  onResetDemo,
  modeStyles,
}) => {
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'careplus' | 'circle'>('appearance');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, isPin: boolean) => {
    navigator.clipboard.writeText(text);
    triggerHaptic(20);
    if (isPin) {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const membersList = Object.values(group.members) as Member[];

  const getArchetypeIcon = (themeId: AppTheme) => {
    switch (themeId) {
      case 'floral':
        return <Flower2 className="w-4 h-4 text-pink-500" />;
      case 'mech':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'linen':
        return <Bookmark className="w-4 h-4 text-amber-600" />;
      case 'midnight':
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`w-full max-w-md ${modeStyles.bgSurface} ${modeStyles.border} border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-black ${modeStyles.textPrimary}`}>
              Settings & Themes
            </h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modeStyles.accentPill}`}>
              {THEME_CONFIGS[theme]?.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${modeStyles.textMuted} hover:${modeStyles.textPrimary} transition`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Refined Navigation Tabs */}
        <div className={`grid grid-cols-3 gap-1 p-1 my-3 rounded-2xl border ${modeStyles.borderCard} ${modeStyles.bgCard} text-xs font-bold text-center`}>
          <button
            onClick={() => {
              setActiveTab('appearance');
              triggerHaptic(20);
            }}
            className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'appearance'
                ? `${modeStyles.accent} font-black shadow-xs`
                : `${modeStyles.textSecondary} hover:${modeStyles.textPrimary}`
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('careplus');
              triggerHaptic(20);
            }}
            className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'careplus'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : `${modeStyles.textSecondary} hover:${modeStyles.textPrimary}`
            }`}
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>Aokay Plus</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('circle');
              triggerHaptic(20);
            }}
            className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'circle'
                ? `${modeStyles.accent} font-black shadow-xs`
                : `${modeStyles.textSecondary} hover:${modeStyles.textPrimary}`
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Circle</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-4 py-1 pr-1 text-xs">
          {/* TAB 1: APPEARANCE & THEMES */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* Light / Dark Mode Toggle Card */}
              <div className={`p-3.5 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-500/10">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-black text-xs ${modeStyles.textPrimary}`}>
                      {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                    </h3>
                    <p className={`text-[10px] ${modeStyles.textSecondary}`}>
                      Tailored color palette for {THEME_CONFIGS[theme]?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic(20);
                    onToggleDarkMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition border ${
                    darkMode
                      ? 'bg-slate-800 text-amber-300 border-slate-700'
                      : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                  }`}
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
                </button>
              </div>

              {/* Theme Redesign Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${modeStyles.textSecondary}`}>
                    Visual Theme Archetypes
                  </span>
                  <span className={`text-[10px] ${modeStyles.textMuted}`}>
                    Complete UI Redesign
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {(Object.keys(THEME_CONFIGS) as AppTheme[]).map((themeKey) => {
                    const cfg = THEME_CONFIGS[themeKey];
                    const isSelected = theme === themeKey;
                    const previewColors = darkMode
                      ? cfg.palettePreview.dark
                      : cfg.palettePreview.light;

                    return (
                      <button
                        key={themeKey}
                        onClick={() => {
                          triggerHaptic(25);
                          onSelectTheme(themeKey);
                        }}
                        className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center justify-between gap-3 ${
                          isSelected
                            ? `${modeStyles.accentSubtle} ring-2 ring-blue-500/40 font-black shadow-sm`
                            : `${modeStyles.bgCard} ${modeStyles.borderCard} hover:border-slate-400`
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-slate-500/10 shrink-0">
                            {getArchetypeIcon(themeKey)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black text-xs truncate ${modeStyles.textPrimary}`}>
                                {cfg.name}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase opacity-75 ${cfg.id === 'mech' ? 'bg-cyan-500/20 text-cyan-600' : 'bg-slate-500/10'}`}>
                                {cfg.archetype}
                              </span>
                            </div>
                            <p className={`text-[10px] truncate ${modeStyles.textSecondary} mt-0.5`}>
                              {cfg.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Palette dots */}
                        <div className="flex items-center gap-1 shrink-0">
                          {previewColors.map((color, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-500 ml-1.5 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Selector */}
              <div className="space-y-2">
                <span className={`text-[11px] font-black uppercase tracking-wider block ${modeStyles.textSecondary}`}>
                  Typography & Fonts
                </span>

                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(FONTS) as AppFont[]).map((fontKey) => {
                    const f = FONTS[fontKey];
                    const isSelected = font === fontKey;
                    return (
                      <button
                        key={fontKey}
                        onClick={() => {
                          triggerHaptic(20);
                          onSelectFont(fontKey);
                        }}
                        className={`w-full p-3 rounded-2xl text-left transition border flex items-center justify-between ${f.className} ${
                          isSelected
                            ? `${modeStyles.accentSubtle} ring-2 ring-blue-500/30 font-black`
                            : `${modeStyles.bgCard} ${modeStyles.borderCard}`
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5 opacity-60" />
                            <span className={`text-xs font-bold ${modeStyles.textPrimary}`}>
                              {f.name}
                            </span>
                            {fontKey === 'lexend' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 font-bold">
                                Senior Legibility Pick
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] ${modeStyles.textSecondary} mt-0.5`}>
                            {f.description}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Sizing & Full UI Scale */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${modeStyles.textSecondary}`}>
                    UI & Text Scale
                  </span>
                  <span className={`text-[10px] font-bold ${modeStyles.textMuted}`}>
                    Scales entire app & touch targets
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TEXT_SCALES) as TextScale[]).map((scaleKey) => {
                    const s = TEXT_SCALES[scaleKey];
                    const isSelected = textScale === scaleKey;
                    return (
                      <button
                        key={scaleKey}
                        onClick={() => {
                          triggerHaptic(20);
                          onSelectTextScale(scaleKey);
                        }}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                          isSelected
                            ? `${modeStyles.accentSubtle} font-black border-blue-500 ring-2 ring-blue-500/20`
                            : `${modeStyles.bgSurface} ${modeStyles.borderCard} hover:border-slate-400/40`
                        }`}
                      >
                        <span
                          className={`block font-black mb-1 ${modeStyles.textPrimary} ${
                            scaleKey === 'normal'
                              ? 'text-sm'
                              : scaleKey === 'large'
                              ? 'text-base'
                              : 'text-lg'
                          }`}
                        >
                          Aa
                        </span>
                        <span className={`text-xs block font-bold ${modeStyles.textPrimary}`}>
                          {s.label.split(' ')[0]}
                        </span>
                        <span className={`text-[9px] block opacity-70 mt-0.5 ${modeStyles.textSecondary}`}>
                          {scaleKey === 'normal' ? '100%' : scaleKey === 'large' ? '115%' : '130%'}
                        </span>
                        {isSelected && (
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audio Chime Toggle */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className={`font-bold text-xs block ${modeStyles.textPrimary}`}>
                      Sound & Audio Chimes
                    </span>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>
                      Play friendly confirmations on check-in
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    onToggleSound();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    soundEnabled
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}
                >
                  {soundEnabled ? 'Enabled ✓' : 'Muted'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AOKAY PLUS BENEFITS */}
          {activeTab === 'careplus' && (
            <div className="space-y-3.5">
              {/* Plus Status Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                      <Crown className="w-5 h-5 fill-slate-950" />
                    </div>
                    <div>
                      <h3 className={`font-black text-sm ${modeStyles.textPrimary}`}>
                        Aokay Plus
                      </h3>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                        {subscription.isActive ? 'Active Subscription' : 'Free Tier Active'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenCarePlus();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition active:scale-95"
                  >
                    {subscription.isActive ? 'Manage Plan' : 'Start Trial'}
                  </button>
                </div>

                <p className={`text-xs ${modeStyles.textSecondary} leading-relaxed`}>
                  Core check-ins are always 100% free. Upgrading to Aokay Plus unlocks continuous safety automation and multi-member coordination for your entire circle.
                </p>
              </div>

              {/* Highlighted Subscriber Benefits */}
              <div className="space-y-2">
                <span className={`text-[11px] font-black uppercase tracking-wider block ${modeStyles.textSecondary}`}>
                  Subscriber Benefits Included in Aokay Plus
                </span>

                <div className="grid grid-cols-1 gap-2">
                  {/* Benefit 1 */}
                  <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start gap-3`}>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-xs ${modeStyles.textPrimary}`}>
                          Unlimited Family Circle Members
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          Included
                        </span>
                      </div>
                      <p className={`text-[11px] ${modeStyles.textSecondary} mt-0.5`}>
                        Invite all siblings, adult children, grandchildren, and visiting nurses without member caps.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start gap-3`}>
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <BellRing className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-xs ${modeStyles.textPrimary}`}>
                          10:00 AM Automated Escalation
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
                          Automated
                        </span>
                      </div>
                      <p className={`text-[11px] ${modeStyles.textSecondary} mt-0.5`}>
                        If senior hasn't checked in by 10 AM, automatic push alerts and phone call reminders dispatch to family.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start gap-3`}>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-xs ${modeStyles.textPrimary}`}>
                          Forever Voice Memory Vault
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400">
                          Unlimited
                        </span>
                      </div>
                      <p className={`text-[11px] ${modeStyles.textSecondary} mt-0.5`}>
                        Every morning voice check-in is permanently archived for family replays, preserving precious memories.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 4 */}
                  <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start gap-3`}>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-xs ${modeStyles.textPrimary}`}>
                          Cellular SMS & Telephony Fallback
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          High Priority
                        </span>
                      </div>
                      <p className={`text-[11px] ${modeStyles.textSecondary} mt-0.5`}>
                        Emergency alerts route over direct SMS carrier networks if senior's home Wi-Fi or mobile data is down.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Trial Guarantee & CTA */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium opacity-80 text-center">
                  <HeartHandshake className="w-4 h-4 text-emerald-500" />
                  <span>14-day free family trial • Cancel anytime with one tap</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenCarePlus();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>{subscription.isActive ? 'View Care+ Subscription Hub' : 'Start 14-Day Free Family Trial ($3.33/mo)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CIRCLE & SYSTEM */}
          {activeTab === 'circle' && (
            <div className="space-y-4">
              {/* Family Circle Info */}
              <div className={`p-3.5 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} space-y-2.5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${modeStyles.textMuted}`}>
                      Circle Name
                    </span>
                    <h4 className={`font-black text-sm ${modeStyles.textPrimary}`}>
                      {group.groupName}
                    </h4>
                  </div>
                  <button
                    onClick={onOpenOnboarding}
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Invite</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-inherit">
                  <div>
                    <span className={`text-[10px] block ${modeStyles.textMuted}`}>
                      Circle PIN Code
                    </span>
                    <button
                      onClick={() => copyToClipboard(group.pinCode, true)}
                      className={`mt-1 flex items-center gap-1.5 font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-slate-500/10 border ${modeStyles.borderCard} ${modeStyles.textPrimary}`}
                    >
                      <span>{group.pinCode}</span>
                      {copiedPin ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </button>
                  </div>

                  <div>
                    <span className={`text-[10px] block ${modeStyles.textMuted}`}>
                      Group ID
                    </span>
                    <button
                      onClick={() => copyToClipboard(group.groupId, false)}
                      className={`mt-1 flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-xl bg-slate-500/10 border ${modeStyles.borderCard} ${modeStyles.textPrimary}`}
                    >
                      <span>{group.groupId}</span>
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-1.5">
                <span className={`text-[11px] font-black uppercase tracking-wider block ${modeStyles.textSecondary}`}>
                  Circle Members ({membersList.length})
                </span>

                <div className="space-y-1.5">
                  {membersList.map((m) => (
                    <div
                      key={m.uid}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${modeStyles.bgCard} ${modeStyles.borderCard}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-white/20 shrink-0 flex items-center justify-center">
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} alt={m.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-black text-xs">{m.displayName.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className={`font-bold text-xs block truncate ${modeStyles.textPrimary}`}>
                            {m.displayName}
                          </span>
                          <span className={`text-[10px] truncate block ${modeStyles.textSecondary}`}>
                            {m.customTitle || (m.role === 'SENIOR' ? 'Senior Member' : m.role === 'LEADER' ? 'Circle Leader' : 'Circle Member')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {m.uid === activeMember?.uid && onOpenProfile && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenProfile();
                            }}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 transition"
                          >
                            Edit Pic
                          </button>
                        )}

                        {m.uid !== activeMember?.uid ? (
                          <button
                            onClick={() => {
                              onSwitchUser(m.uid);
                              triggerHaptic(20);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-500/10 hover:bg-slate-500/20 transition"
                          >
                            Switch
                          </button>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Replay Startup Screen */}
              <button
                onClick={() => {
                  onClose();
                  onOpenStartup();
                }}
                className={`w-full p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-center justify-between hover:bg-slate-500/10 transition`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className={modeStyles.textPrimary}>Replay Startup Intro</span>
                </div>
                <span className={`text-[10px] ${modeStyles.textMuted}`}>View Splash</span>
              </button>

              {/* Flutter Code Modal */}
              <button
                onClick={() => {
                  onClose();
                  onOpenFlutterCode();
                }}
                className={`w-full p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-center justify-between hover:bg-slate-500/10 transition`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <span className={modeStyles.textPrimary}>View Flutter & Dart Source</span>
                </div>
                <span className={`text-[10px] ${modeStyles.textMuted}`}>Clean Code</span>
              </button>

              {/* Sign Out / Persona Switch */}
              <button
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="w-full p-3 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Login Account</span>
              </button>

              {/* Reset Demo Data */}
              <button
                onClick={() => {
                  if (confirm('Reset to initial sample family circle with Eleanor & Sarah?')) {
                    onResetDemo();
                    onClose();
                  }
                }}
                className={`w-full p-2.5 text-center text-xs opacity-60 hover:opacity-100 transition text-red-500 font-medium`}
              >
                Reset Demo Data to Default
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
