import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  Clock,
  Radio,
  Mountain,
  Check,
} from 'lucide-react';
import { Member, LocationData } from '../types';
import { ModeStyles } from '../services/themeConfig';
import { getGoogleMapsUrl, getAppleMapsUrl } from '../services/locationService';
import { triggerHaptic } from '../services/audioService';

interface LocationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  location?: LocationData;
  modeStyles: ModeStyles;
  onRequestLocation?: () => void;
  isCurrentUser?: boolean;
}

export const LocationViewModal: React.FC<LocationViewModalProps> = ({
  isOpen,
  onClose,
  member,
  location,
  modeStyles,
  onRequestLocation,
  isCurrentUser,
}) => {
  const [requestedToast, setRequestedToast] = useState(false);

  if (!isOpen) return null;

  const activeLoc = location || member.location;

  const handleRequest = () => {
    if (onRequestLocation) {
      onRequestLocation();
      triggerHaptic([40, 40]);
      setRequestedToast(true);
      setTimeout(() => setRequestedToast(false), 2800);
    }
  };

  const formattedTime = activeLoc?.updatedAt
    ? new Date(activeLoc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-md ${modeStyles.bgModal} ${modeStyles.cardShape} ${modeStyles.cardBorder} p-5 sm:p-6 shadow-2xl relative my-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center shrink-0">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-bold text-white">
                    {member.displayName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className={`font-black text-base truncate ${modeStyles.textPrimary}`}>
                  {member.displayName}
                </h3>
                <p className={`text-xs ${modeStyles.textMuted}`}>
                  {member.customTitle || member.role} • Location Status
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-white/10 ${modeStyles.textMuted} transition`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeLoc ? (
            <div className="space-y-4">
              {/* Visual Map / Elevation Landmark Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-5 text-center shadow-inner">
                {/* Visual grid / terrain overlay */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Pulsing Pin */}
                <div className="relative z-10 my-2 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-blue-500/20 animate-ping absolute inset-0" />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-white/40 flex items-center justify-center shadow-xl relative z-10">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <h4 className="mt-3 text-base font-black text-white px-2">
                    {activeLoc.label || 'GPS Coordinates'}
                  </h4>

                  <div className="mt-1 flex items-center gap-2 text-xs text-blue-200/80 font-mono">
                    <span>{activeLoc.latitude.toFixed(4)}° N</span>
                    <span>•</span>
                    <span>{Math.abs(activeLoc.longitude).toFixed(4)}° W</span>
                  </div>
                </div>

                {/* Elevation & Accuracy Stats Bar */}
                <div className="relative z-10 mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-left">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5">
                    <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-white/60 block uppercase font-bold">
                        Elevation
                      </span>
                      <span className="text-xs font-black text-white">
                        {activeLoc.altitude ? `${activeLoc.altitude}m / ${Math.round(activeLoc.altitude * 3.28084)}ft` : 'Ground Level'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-white/60 block uppercase font-bold">
                        Reported
                      </span>
                      <span className="text-xs font-black text-white">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={getGoogleMapsUrl(activeLoc.latitude, activeLoc.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href={getAppleMapsUrl(activeLoc.latitude, activeLoc.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-2.5 rounded-xl ${modeStyles.bgItem} hover:bg-white/15 border border-white/10 ${modeStyles.textPrimary} text-xs font-bold transition flex items-center justify-center gap-1.5`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Apple Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl ${modeStyles.bgItem} border border-white/10 text-center my-2`}>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className={`font-black text-sm ${modeStyles.textPrimary}`}>
                No Location Reported Yet
              </h4>
              <p className={`text-xs ${modeStyles.textMuted} mt-1 max-w-xs mx-auto`}>
                {member.displayName} hasn't shared their trail coordinates yet today. You can send a one-tap location request.
              </p>
            </div>
          )}

          {/* Request Location Action for other members */}
          {!isCurrentUser && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              {requestedToast ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Location requested from {member.displayName}!</span>
                </div>
              ) : (
                <span className={`text-xs ${modeStyles.textMuted}`}>
                  Need real-time coordinates?
                </span>
              )}

              <button
                type="button"
                onClick={handleRequest}
                disabled={requestedToast}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition ml-auto disabled:opacity-50"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Request Location</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
