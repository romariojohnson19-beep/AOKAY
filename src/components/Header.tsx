import React, { useState } from 'react';
import { FamilyGroup, Member, SubscriptionPlan } from '../types';
import { ModeStyles, AppThemeConfig } from '../services/themeConfig';
import {
  Settings,
  Sparkles,
  Copy,
  Check,
  Users,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Crown,
} from 'lucide-react';
import { triggerHaptic } from '../services/audioService';

interface HeaderProps {
  group: FamilyGroup;
  activeMember: Member | null;
  modeStyles: ModeStyles;
  themeConfig: AppThemeConfig;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  subscription: SubscriptionPlan;
  onOpenCarePlus: () => void;
  onOpenSettings: () => void;
  onOpenMemories: () => void;
  onOpenProfile?: () => void;
  onSwitchUser: (uid: string) => void;
  onSignOut: () => void;
  onSelectCirclePreset?: (presetId: 'family' | 'hiking' | 'trip') => void;
  savedMemoriesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  group,
  activeMember,
  modeStyles,
  themeConfig,
  darkMode,
  onToggleDarkMode,
  subscription,
  onOpenCarePlus,
  onOpenSettings,
  onOpenMemories,
  onOpenProfile,
  onSwitchUser,
  onSignOut,
  onSelectCirclePreset,
  savedMemoriesCount,
}) => {
  const [copiedPin, setCopiedPin] = useState(false);
  const [showCircleDropdown, setShowCircleDropdown] = useState(false);

  const copyPin = () => {
    navigator.clipboard.writeText(group.pinCode);
    setCopiedPin(true);
    triggerHaptic(20);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const membersList = Object.values(group.members) as Member[];
  const hasEmergency = membersList.some((m) => m.status === 'NOT_OKAY');

  const circleBadge =
    group.groupType === 'hiking'
      ? { icon: '🏔️', label: 'Hiking' }
      : group.groupType === 'trip'
      ? { icon: '✈️', label: 'Trip' }
      : { icon: '🏡', label: 'Family' };

  return (
    <header
      className={`w-full sticky top-0 z-30 px-4 py-2.5 backdrop-blur-md transition-colors duration-200 border-b ${modeStyles.headerBg} ${modeStyles.border}`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left: Active Circle Selector Dropdown & Compact PIN badge */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Active Circle Selector Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                triggerHaptic(15);
                setShowCircleDropdown(!showCircleDropdown);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition border shadow-xs ${modeStyles.bgCard} ${modeStyles.borderCard} hover:bg-slate-500/10 active:scale-95`}
              title="Active Circle Selector"
            >
              <span className="text-sm shrink-0">{circleBadge.icon}</span>
              <span className={`truncate max-w-[125px] sm:max-w-[160px] font-black text-xs ${modeStyles.textPrimary}`}>
                {group.groupName}
              </span>
              {hasEmergency && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 opacity-70 transition-transform duration-150 ${
                  showCircleDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Circle & Member Selector Dropdown Menu */}
            {showCircleDropdown && (
              <div
                className={`absolute left-0 mt-2 w-72 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 border ${modeStyles.bgCard} ${modeStyles.borderCard}`}
              >
                {/* Active user header with quick profile edit */}
                <div className={`px-3 py-2 border-b flex items-center justify-between ${modeStyles.borderCard}`}>
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-slate-800 shrink-0 flex items-center justify-center">
                      {activeMember?.avatarUrl ? (
                        <img
                          src={activeMember.avatarUrl}
                          alt={activeMember.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {activeMember?.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-black truncate ${modeStyles.textPrimary}`}>
                        {activeMember?.displayName}
                      </div>
                      <div className={`text-[10px] ${modeStyles.textMuted}`}>
                        {activeMember?.customTitle || activeMember?.role}
                      </div>
                    </div>
                  </div>

                  {onOpenProfile && (
                    <button
                      onClick={() => {
                        setShowCircleDropdown(false);
                        onOpenProfile();
                      }}
                      className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[10px] font-bold border border-blue-500/30 transition shrink-0"
                    >
                      Edit Pic
                    </button>
                  )}
                </div>

                {/* Preset Circle Switcher */}
                {onSelectCirclePreset && (
                  <div className={`px-3 py-2 border-b ${modeStyles.borderCard}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${modeStyles.textMuted}`}>
                      Switch Circle
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => {
                          setShowCircleDropdown(false);
                          onSelectCirclePreset('family');
                        }}
                        className={`px-1.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                          group.groupType === 'family'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <span>🏡</span>
                        <span>Family</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowCircleDropdown(false);
                          onSelectCirclePreset('hiking');
                        }}
                        className={`px-1.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                          group.groupType === 'hiking'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <span>🏔️</span>
                        <span>Hiking</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowCircleDropdown(false);
                          onSelectCirclePreset('trip');
                        }}
                        className={`px-1.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                          group.groupType === 'trip'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <span>✈️</span>
                        <span>Trip</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Switch Circle Member */}
                <div
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${modeStyles.textSecondary}`}
                >
                  <span>Circle Members</span>
                  <Users className="w-3.5 h-3.5 opacity-60" />
                </div>

                <div className="py-1 max-h-40 overflow-y-auto">
                  {membersList.map((member) => (
                    <button
                      key={member.uid}
                      onClick={() => {
                        onSwitchUser(member.uid);
                        setShowCircleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition hover:bg-slate-500/10 ${
                        member.uid === activeMember?.uid
                          ? 'font-black text-blue-500'
                          : modeStyles.textPrimary
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0 bg-slate-800">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-white flex items-center justify-center h-full">
                              {member.displayName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="truncate">{member.displayName}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          member.status === 'CHECKED_IN'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : member.status === 'NOT_OKAY'
                            ? 'bg-red-500/15 text-red-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {member.status === 'CHECKED_IN' ? 'OK' : member.status === 'NOT_OKAY' ? 'Alert' : 'Pending'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Saved Memories & Appearance Quick Toggles */}
                <div className={`px-2 pt-2 border-t space-y-1 ${modeStyles.borderCard}`}>
                  <button
                    onClick={() => {
                      setShowCircleDropdown(false);
                      onOpenMemories();
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between hover:bg-slate-500/10 ${modeStyles.textPrimary}`}
                  >
                    <div className="flex items-center gap-2 text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Saved Voice Memories</span>
                    </div>
                    {savedMemoriesCount > 0 && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {savedMemoriesCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic(20);
                      onToggleDarkMode();
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between hover:bg-slate-500/10 ${modeStyles.textPrimary}`}
                  >
                    <div className="flex items-center gap-2">
                      {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                    </div>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>Toggle</span>
                  </button>
                </div>

                {/* Sign Out / Switch Circle */}
                <div className={`pt-1 mt-1 border-t ${modeStyles.borderCard}`}>
                  <button
                    onClick={() => {
                      setShowCircleDropdown(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Circle / Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Compact PIN Badge */}
          <button
            onClick={copyPin}
            title="Click to copy circle PIN"
            className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-1 rounded-full transition border bg-slate-500/10 hover:bg-slate-500/20 ${modeStyles.borderCard} ${modeStyles.textPrimary} shrink-0`}
          >
            <span>PIN: {group.pinCode}</span>
            {copiedPin ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 opacity-60" />
            )}
          </button>
        </div>

        {/* Right: Settings Gear Icon */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              triggerHaptic(20);
              onOpenSettings();
            }}
            className={`p-2 rounded-full transition border bg-slate-500/10 hover:bg-slate-500/20 ${modeStyles.borderCard} ${modeStyles.textPrimary}`}
            title="Themes, Aokay Plus & Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
