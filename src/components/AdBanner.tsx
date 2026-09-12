import React, { useState } from 'react';
import { Crown, Sparkles, ExternalLink, X, Info } from 'lucide-react';
import { ModeStyles } from '../services/themeConfig';

interface AdBannerProps {
  modeStyles: ModeStyles;
  onOpenCarePlus: () => void;
  isPlusActive: boolean;
}

interface SponsoredAd {
  id: string;
  advertiser: string;
  headline: string;
  description: string;
  ctaText: string;
  badge: string;
  rating?: string;
  iconBg: string;
  category: string;
}

const SAMPLE_ADS: SponsoredAd[] = [
  {
    id: 'ad-pixel-watch',
    advertiser: 'Google Pixel Watch 3',
    headline: 'Fall Detection & 24/7 Safety',
    description: 'Real-time heart telemetry & automated emergency SOS for seniors.',
    ctaText: 'Explore',
    badge: 'Sponsored',
    rating: '4.8 ★',
    iconBg: 'bg-blue-600',
    category: 'Safety Device',
  },
  {
    id: 'ad-aarp-care',
    advertiser: 'AARP Caregiving',
    headline: 'Free Family Caregiver Guides',
    description: 'Local respite support, medication checklists & legal assistance.',
    ctaText: 'Learn More',
    badge: 'Sponsored',
    rating: '4.9 ★',
    iconBg: 'bg-emerald-600',
    category: 'Family Care',
  },
  {
    id: 'ad-alltrails',
    advertiser: 'AllTrails+ Outdoors',
    headline: 'Offline GPS Mountain Maps',
    description: 'Never lose cell signal on hiking trails with satellite topo maps.',
    ctaText: 'Install',
    badge: 'Sponsored',
    rating: '4.9 ★',
    iconBg: 'bg-teal-600',
    category: 'Hiking & Trails',
  },
];

export const AdBanner: React.FC<AdBannerProps> = ({
  modeStyles,
  onOpenCarePlus,
  isPlusActive,
}) => {
  const [adIndex, setAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // If user has Aokay Plus subscription, never show any ads!
  if (isPlusActive || isDismissed) {
    return null;
  }

  const currentAd = SAMPLE_ADS[adIndex % SAMPLE_ADS.length];

  const handleNextAd = () => {
    setAdIndex((prev) => (prev + 1) % SAMPLE_ADS.length);
  };

  return (
    <div className="w-full my-1.5 animate-in fade-in duration-200">
      <div
        className={`relative overflow-hidden p-2.5 rounded-xl border transition-all shadow-xs ${modeStyles.bgCard} ${modeStyles.borderCard}`}
      >
        {/* Top Mini Bar: Ad Label + Remove Ads trigger */}
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-500/10 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded font-black text-[9px] uppercase bg-slate-500/20 text-slate-500 dark:text-slate-400">
              Ad
            </span>
            <span className={`font-semibold opacity-75 ${modeStyles.textSecondary}`}>
              Google AdMob • Test Partner
            </span>
            {currentAd.rating && (
              <span className="text-amber-500 font-bold hidden sm:inline">
                {currentAd.rating}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCarePlus}
              className="inline-flex items-center gap-1 font-black text-[10px] text-amber-500 hover:text-amber-400 hover:underline transition"
              title="Upgrade to Aokay Plus to permanently remove all ads"
            >
              <Crown className="w-2.5 h-2.5 fill-current" />
              <span>Remove Ads</span>
            </button>

            <button
              onClick={() => setShowInfoModal(true)}
              className="opacity-50 hover:opacity-100 transition p-0.5"
              title="Ad information & Google Play deployment compliance"
            >
              <Info className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="opacity-50 hover:opacity-100 transition p-0.5"
              title="Hide this ad banner for this session"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Ad Body: Icon + Content + CTA */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Ad Icon */}
            <div
              className={`w-9 h-9 rounded-lg ${currentAd.iconBg} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs`}
            >
              {currentAd.advertiser.charAt(0)}
            </div>

            {/* Headline & Description */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <h4 className={`font-black text-xs truncate ${modeStyles.textPrimary}`}>
                  {currentAd.advertiser}
                </h4>
                <span className={`text-[9px] opacity-65 truncate hidden sm:inline ${modeStyles.textSecondary}`}>
                  • {currentAd.category}
                </span>
              </div>
              <p className={`text-[11px] truncate ${modeStyles.textSecondary} leading-tight`}>
                {currentAd.headline} - {currentAd.description}
              </p>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleNextAd}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition active:scale-95 flex items-center gap-1"
            >
              <span>{currentAd.ctaText}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Dialog Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`max-w-sm w-full p-4 rounded-2xl ${modeStyles.bgModal} border ${modeStyles.cardBorder} shadow-2xl space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className={`font-black text-xs ${modeStyles.textPrimary}`}>
                  Google Play Ad Policy & Free Tier
                </h4>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-full opacity-60 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs ${modeStyles.textSecondary} leading-relaxed`}>
              This app is monetized under the Google Play Freemium model. Free users receive non-intrusive, privacy-respecting sponsored announcements.
            </p>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                👑 Go 100% Ad-Free with Aokay Plus
              </span>
              <p className={`text-[11px] ${modeStyles.textSecondary}`}>
                Aokay Plus immediately disables all ads and unlocks automated custom escalation deadlines & real-time GPS location sharing.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowInfoModal(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${modeStyles.textSecondary}`}
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  onOpenCarePlus();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-amber-500 text-slate-950 shadow-sm"
              >
                Upgrade to Aokay Plus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
