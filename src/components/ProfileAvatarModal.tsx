import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Camera,
  Check,
  MapPin,
  Compass,
  User,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Member, CircleType } from '../types';
import { ModeStyles } from '../services/themeConfig';
import { PRESET_AVATARS, compressUploadedImage } from '../services/avatarService';
import { triggerHaptic } from '../services/audioService';
import { getCurrentDeviceLocation } from '../services/locationService';

interface ProfileAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  circleType?: CircleType;
  modeStyles: ModeStyles;
  onSaveProfile: (updates: Partial<Member>) => void;
}

export const ProfileAvatarModal: React.FC<ProfileAvatarModalProps> = ({
  isOpen,
  onClose,
  member,
  circleType = 'general',
  modeStyles,
  onSaveProfile,
}) => {
  const [displayName, setDisplayName] = useState(member.displayName);
  const [customTitle, setCustomTitle] = useState(member.customTitle || member.relationship || '');
  const [avatarUrl, setAvatarUrl] = useState(member.avatarUrl || '');
  const [activeCategory, setActiveCategory] = useState<'all' | 'hiking' | 'trip' | 'family' | 'companion'>('all');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      triggerHaptic(20);
      const compressed = await compressUploadedImage(file, 160);
      setAvatarUrl(compressed);
      triggerHaptic([30, 30]);
    } catch (err: any) {
      alert(err?.message || 'Failed to process image');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSelectPreset = (url: string) => {
    triggerHaptic(20);
    setAvatarUrl(url);
  };

  const handleUpdateLocationNow = async () => {
    setIsUpdatingLocation(true);
    triggerHaptic(25);
    try {
      const res = await getCurrentDeviceLocation((circleType as CircleType) || 'general');
      onSaveProfile({
        location: res.location,
      });
      setLocationStatus(`Updated: ${res.location.label || 'GPS Coordinates'}`);
      triggerHaptic([40, 40]);
    } catch (err) {
      setLocationStatus('Could not read GPS');
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleSave = () => {
    triggerHaptic([40, 20, 40]);
    onSaveProfile({
      displayName: displayName.trim() || member.displayName,
      customTitle: customTitle.trim() || undefined,
      avatarUrl,
    });
    onClose();
  };

  const filteredAvatars =
    activeCategory === 'all'
      ? PRESET_AVATARS
      : PRESET_AVATARS.filter((a) => a.category === activeCategory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-lg ${modeStyles.bgModal} ${modeStyles.cardShape} ${modeStyles.cardBorder} p-5 sm:p-6 shadow-2xl relative my-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-lg font-black tracking-tight ${modeStyles.textPrimary}`}>
                  Display Picture & Profile
                </h2>
                <p className={`text-xs ${modeStyles.textMuted}`}>
                  Customize how your hiking crew or friends see you
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-white/10 ${modeStyles.textMuted} transition`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Active Display Picture Preview & Upload Action */}
            <div className={`p-4 rounded-xl ${modeStyles.bgItem} border border-white/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left`}>
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-md flex items-center justify-center bg-slate-800">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition border border-white/20"
                  title="Upload new photo"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-sm ${modeStyles.textPrimary}`}>
                  Your Display Picture
                </h3>
                <p className={`text-xs ${modeStyles.textMuted} mt-0.5`}>
                  Upload a personal photo or choose a trail/trip sticker below.
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isCompressing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{isCompressing ? 'Processing...' : 'Upload Photo'}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Name & Custom Role / Title Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-bold ${modeStyles.textMuted} mb-1 uppercase tracking-wider`}>
                  Display Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-2.5 w-4 h-4 ${modeStyles.textMuted}`} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm font-semibold ${modeStyles.bgItem} border border-white/10 ${modeStyles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold ${modeStyles.textMuted} mb-1 uppercase tracking-wider`}>
                  Role / Custom Title
                </label>
                <div className="relative">
                  <Compass className={`absolute left-3 top-2.5 w-4 h-4 ${modeStyles.textMuted}`} />
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Trail Guide, Navigator"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm font-semibold ${modeStyles.bgItem} border border-white/10 ${modeStyles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>
              </div>
            </div>

            {/* Choose from Preset Stickers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-xs font-bold ${modeStyles.textMuted} uppercase tracking-wider flex items-center gap-1`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Preset Avatar</span>
                </label>
                {/* Category filters */}
                <div className="flex items-center gap-1 text-[11px]">
                  {(['all', 'hiking', 'trip', 'family'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2 py-0.5 rounded-full capitalize font-semibold transition ${
                        activeCategory === cat
                          ? 'bg-blue-600 text-white'
                          : `${modeStyles.textMuted} hover:bg-white/10`
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 p-2 rounded-xl bg-black/20 border border-white/5 max-h-44 overflow-y-auto">
                {filteredAvatars.map((opt) => {
                  const isSelected = avatarUrl === opt.dataUrl;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectPreset(opt.dataUrl)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 p-1 transition flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20 scale-105 shadow-md ring-2 ring-blue-400/40'
                          : 'border-white/10 hover:border-white/30 hover:scale-102 bg-white/5'
                      }`}
                      title={opt.name}
                    >
                      <img src={opt.dataUrl} alt={opt.name} className="w-full h-full object-contain rounded-lg" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Location Quick Sync */}
            <div className={`p-3 rounded-xl ${modeStyles.bgItem} border border-white/10 flex items-center justify-between`}>
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className={`text-xs font-bold block ${modeStyles.textPrimary}`}>
                    My Location Sharing
                  </span>
                  <span className={`text-[11px] truncate block ${modeStyles.textMuted}`}>
                    {locationStatus || (member.location ? member.location.label || 'Location Active' : 'No location shared yet')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUpdateLocationNow}
                disabled={isUpdatingLocation}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${isUpdatingLocation ? 'animate-spin' : ''}`} />
                <span>{isUpdatingLocation ? 'Locating...' : 'Sync GPS'}</span>
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${modeStyles.textMuted} hover:bg-white/10 transition`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
