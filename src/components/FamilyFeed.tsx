import React, { useState } from 'react';
import { Member, CheckIn, LocationData } from '../types';
import { ModeStyles, AppThemeConfig } from '../services/themeConfig';
import { InlineAudioPlayer } from './InlineAudioPlayer';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  Phone,
  ShieldCheck,
  Flower2,
  Cpu,
  Bookmark,
  MapPin,
  Radio,
  Mountain,
  Crown,
} from 'lucide-react';
import { triggerHaptic } from '../services/audioService';

interface FamilyFeedProps {
  members: Member[];
  checkins: CheckIn[];
  currentUserId: string;
  modeStyles: ModeStyles;
  themeConfig: AppThemeConfig;
  isPlusActive?: boolean;
  onOpenCarePlus?: () => void;
  onPing: (targetUid: string) => void;
  onRequestLocation?: (targetUid: string) => void;
  onViewLocation?: (member: Member, location?: LocationData) => void;
  onToggleSaveMemory: (checkinId: string) => void;
}

export const FamilyFeed: React.FC<FamilyFeedProps> = ({
  members,
  checkins,
  currentUserId,
  modeStyles,
  themeConfig,
  isPlusActive = false,
  onOpenCarePlus,
  onPing,
  onRequestLocation,
  onViewLocation,
  onToggleSaveMemory,
}) => {
  const [pingedUsers, setPingedUsers] = useState<Record<string, boolean>>({});
  const [requestedLocationUsers, setRequestedLocationUsers] = useState<Record<string, boolean>>({});

  const handlePingClick = (targetUid: string) => {
    onPing(targetUid);
    setPingedUsers((prev) => ({ ...prev, [targetUid]: true }));
    setTimeout(() => {
      setPingedUsers((prev) => ({ ...prev, [targetUid]: false }));
    }, 4000);
  };

  const handleRequestLocationClick = (targetUid: string) => {
    if (onRequestLocation) {
      triggerHaptic([30, 30]);
      onRequestLocation(targetUid);
      setRequestedLocationUsers((prev) => ({ ...prev, [targetUid]: true }));
      setTimeout(() => {
        setRequestedLocationUsers((prev) => ({ ...prev, [targetUid]: false }));
      }, 4000);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diffMin = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatExactTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Find the latest check-in for a given member
  const getLatestCheckIn = (uid: string): CheckIn | undefined => {
    return checkins.find((c) => c.authorUid === uid);
  };

  // Archetype Theme Icon
  const renderArchetypeIcon = () => {
    if (themeConfig.id === 'floral') return <Flower2 className="w-3.5 h-3.5 text-pink-500" />;
    if (themeConfig.id === 'mech') return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
    if (themeConfig.id === 'linen') return <Bookmark className="w-3.5 h-3.5 text-amber-600" />;
    return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
  };

  return (
    <div className="w-full space-y-3 pb-4">
      {/* Circle Header with Theme Archetype Tag */}
      <div className="flex items-center justify-between px-1">
        <h2 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${modeStyles.textSecondary}`}>
          {renderArchetypeIcon()}
          <span>Circle Members</span>
        </h2>
        <span className={`text-[10px] font-bold px-2 py-0.5 ${modeStyles.badgeShape} bg-slate-500/10 ${modeStyles.textSecondary}`}>
          {modeStyles.archetypeBadge}
        </span>
      </div>

      <div className="space-y-2.5">
        {members.map((member) => {
          const isCurrentUser = member.uid === currentUserId;
          const latestCheckin = getLatestCheckIn(member.uid);
          const hasVoiceNote =
            latestCheckin?.audioUrl ||
            (latestCheckin?.audioDurationSec && latestCheckin.audioDurationSec > 0);
          const isPingSent = pingedUsers[member.uid];
          const isLocationRequested = requestedLocationUsers[member.uid];
          const activeLocation = latestCheckin?.location || member.location;

          return (
            <div
              key={member.uid}
              className={`${modeStyles.cardShape} p-3.5 transition-all duration-150 border ${
                member.status === 'NOT_OKAY'
                  ? 'bg-red-950/20 border-red-500 shadow-md shadow-red-500/20'
                  : `${modeStyles.bgCard} ${modeStyles.borderCard} ${modeStyles.bgCardHover}`
              }`}
            >
              {/* Top Row: Avatar, Name & Status Badge */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Indicator Avatar with Display Pic */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 ${modeStyles.cardShape} overflow-hidden flex items-center justify-center font-black text-sm shadow-xs border ${
                        member.status === 'NOT_OKAY'
                          ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-500/40'
                          : member.status === 'CHECKED_IN'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-amber-500 text-white border-amber-300'
                      }`}
                    >
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{member.displayName.charAt(0)}</span>
                      )}
                    </div>
                    {/* Compact Role Badge */}
                    <span
                      className={`absolute -bottom-1 -right-1 p-0.5 px-1 ${modeStyles.badgeShape} text-[8px] font-black uppercase shadow-xs ${
                        member.role === 'LEADER'
                          ? 'bg-emerald-600 text-white'
                          : member.role === 'SENIOR'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                      title={member.customTitle || member.role}
                    >
                      {member.role === 'LEADER' ? 'LEAD' : member.role === 'SENIOR' ? 'SR' : 'MEM'}
                    </span>
                  </div>

                  {/* Name & Subtitle */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className={`font-black text-sm truncate ${modeStyles.textPrimary}`}>
                        {member.displayName}
                      </h3>
                      {isCurrentUser && (
                        <span className={`text-[9px] px-1.5 py-0.2 ${modeStyles.badgeShape} font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0`}>
                          You
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center gap-1.5 text-[11px] mt-0.5 truncate ${modeStyles.textSecondary}`}>
                      <span className="truncate max-w-[100px]">
                        {member.customTitle || member.relationship || (member.role === 'SENIOR' ? 'Senior' : 'Member')}
                      </span>
                      <span>•</span>
                      <span className="shrink-0">
                        {member.status === 'CHECKED_IN'
                          ? `${formatExactTime(member.lastCheckInAt)} (${formatTimeAgo(member.lastCheckInAt)})`
                          : member.status === 'NOT_OKAY'
                          ? 'Reported NOT OKAY'
                          : `Seen ${formatTimeAgo(member.lastCheckInAt)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Badge & Quick Ping */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {member.status === 'CHECKED_IN' && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 ${modeStyles.badgeShape} font-black text-xs border ${modeStyles.statusChecked} shadow-xs`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Checked In ✓</span>
                    </div>
                  )}

                  {member.status === 'PENDING' && (
                    <div className="flex items-center gap-1">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${modeStyles.badgeShape} text-xs font-bold border ${modeStyles.statusPending}`}>
                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Pending</span>
                      </div>

                      {!isCurrentUser && (
                        <button
                          onClick={() => handlePingClick(member.uid)}
                          disabled={isPingSent}
                          className={`flex items-center gap-1 px-2 py-0.5 ${modeStyles.badgeShape} font-black text-xs transition shadow-xs active:scale-95 border ${
                            isPingSent
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
                          }`}
                          title={`Send nudge ping to ${member.displayName}`}
                        >
                          <Bell className={`w-3 h-3 ${isPingSent ? '' : 'animate-bounce'}`} />
                          <span>{isPingSent ? 'Pinged!' : 'Ping'}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {member.status === 'NOT_OKAY' && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 ${modeStyles.badgeShape} bg-red-600 text-white font-black text-xs shadow-md shadow-red-600/40 animate-pulse`}>
                      <AlertTriangle className="w-3.5 h-3.5 fill-white text-red-600" />
                      <span>NOT OKAY ⚠️</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Row: Aligned Location Tags & Location Request Button */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-500/10">
                {activeLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPlusActive && onOpenCarePlus) {
                        onOpenCarePlus();
                      } else if (onViewLocation) {
                        onViewLocation(member, activeLocation);
                      }
                    }}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border transition ${modeStyles.bgItem} hover:bg-white/10 ${modeStyles.textSecondary}`}
                    title={isPlusActive ? 'Click to view coordinates & full map' : 'Aokay Plus: Click to view live GPS radar & maps'}
                  >
                    <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate max-w-[170px]">{activeLocation.label || 'GPS Location'}</span>
                    {activeLocation.altitude && (
                      <span className="text-[9px] opacity-75">
                        ({Math.round(activeLocation.altitude * 3.28084)}ft)
                      </span>
                    )}
                    {!isPlusActive && (
                      <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1 rounded ml-0.5">
                        Plus
                      </span>
                    )}
                  </button>
                )}

                {!isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPlusActive && onOpenCarePlus) {
                        triggerHaptic(30);
                        onOpenCarePlus();
                      } else {
                        handleRequestLocationClick(member.uid);
                      }
                    }}
                    disabled={isLocationRequested}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition ${
                      isLocationRequested
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : !isPlusActive
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 active:scale-95'
                        : 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 active:scale-95'
                    }`}
                    title={!isPlusActive ? 'Aokay Plus: Request real-time location from circle members' : `Request location update from ${member.displayName}`}
                  >
                    {!isPlusActive ? (
                      <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                    ) : (
                      <Radio className="w-3 h-3 shrink-0" />
                    )}
                    <span>
                      {isLocationRequested
                        ? 'Location Requested 📍'
                        : !isPlusActive
                        ? 'Request Loc (Plus)'
                        : 'Request Location'}
                    </span>
                  </button>
                )}
              </div>

              {/* Emergency Banner Alert if NOT OKAY */}
              {member.status === 'NOT_OKAY' && (
                <div className="mt-2.5 p-3 rounded-xl bg-red-600 text-white space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-white" />
                      <span>Immediate Attention Required</span>
                    </div>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1 text-xs bg-white text-red-700 font-black px-2.5 py-1 rounded-lg shadow hover:bg-red-50 transition"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call {member.phone}</span>
                      </a>
                    )}
                  </div>
                  {latestCheckin?.emergencyNote && (
                    <p className="text-xs text-white bg-black/20 p-2 rounded-lg italic">
                      "{latestCheckin.emergencyNote}"
                    </p>
                  )}
                </div>
              )}

              {/* Inline Audio Player if voice note exists */}
              {hasVoiceNote && latestCheckin && (
                <div className="mt-2">
                  <InlineAudioPlayer
                    audioUrl={latestCheckin.audioUrl}
                    durationSec={latestCheckin.audioDurationSec || 12}
                    isSaved={latestCheckin.isSaved}
                    onToggleSave={() => onToggleSaveMemory(latestCheckin.id)}
                    authorName={member.displayName}
                  />
                </div>
              )}

              {/* Optional Text note preview if available */}
              {latestCheckin?.emergencyNote && member.status !== 'NOT_OKAY' && (
                <p className={`mt-2 text-xs italic px-2.5 py-1.5 rounded-lg border border-slate-500/20 bg-slate-500/5 ${modeStyles.textSecondary}`}>
                  "{latestCheckin.emergencyNote}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
