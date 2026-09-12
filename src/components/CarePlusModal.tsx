import React, { useState } from 'react';
import { ModeStyles } from '../services/themeConfig';
import { SubscriptionPlan } from '../types';
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  Mic,
  Users,
  BellRing,
  PhoneCall,
  Sparkles,
  Zap,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { triggerHaptic } from '../services/audioService';

interface CarePlusModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionPlan;
  onUpdateSubscription: (plan: SubscriptionPlan) => void;
  modeStyles: ModeStyles;
}

export const CarePlusModal: React.FC<CarePlusModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription,
  modeStyles,
}) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>(subscription.billingInterval);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const isAlreadyActive = subscription.isActive && subscription.tier === 'CARE_PLUS';

  const handleSubscribe = () => {
    triggerHaptic([40, 60]);
    onUpdateSubscription({
      tier: 'CARE_PLUS',
      billingInterval: billing,
      isActive: true,
      trialDaysRemaining: 14,
    });
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1200);
  };

  const handleCancelSubscription = () => {
    triggerHaptic(30);
    onUpdateSubscription({
      tier: 'FREE',
      billingInterval: 'monthly',
      isActive: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`w-full max-w-md ${modeStyles.bgSurface} ${modeStyles.border} border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className={`text-base font-black ${modeStyles.textPrimary}`}>
                  Aokay Plus
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  PLUS PASS
                </span>
              </div>
              <p className={`text-[11px] ${modeStyles.textSecondary}`}>
                Comprehensive peace of mind for your circle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${modeStyles.textMuted} hover:${modeStyles.textPrimary} transition`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs">
          {/* Aokay Plus Subscriber Benefits Showcase */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/30 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <h3 className={`font-black text-sm ${modeStyles.textPrimary}`}>
                  Why Circles Choose Aokay Plus
                </h3>
                <p className={`text-[11px] ${modeStyles.textSecondary}`}>
                  Zero friction check-ins, automated alerts, and complete peace of mind
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-500/10">
                <Users className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className={`font-bold text-xs block ${modeStyles.textPrimary}`}>
                    Unlimited Members
                  </span>
                  <span className={`text-[10px] ${modeStyles.textMuted}`}>
                    Connect all siblings, grandkids & aides
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-500/10">
                <BellRing className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className={`font-bold text-xs block ${modeStyles.textPrimary}`}>
                    10 AM Missed Alerts
                  </span>
                  <span className={`text-[10px] ${modeStyles.textMuted}`}>
                    Auto-call if senior hasn't checked in
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-500/10">
                <Mic className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <span className={`font-bold text-xs block ${modeStyles.textPrimary}`}>
                    Forever Voice Vault
                  </span>
                  <span className={`text-[10px] ${modeStyles.textMuted}`}>
                    Never lose heartwarming check-in audio
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-500/10">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <span className={`font-bold text-xs block ${modeStyles.textPrimary}`}>
                    Cellular SMS Fallback
                  </span>
                  <span className={`text-[10px] ${modeStyles.textMuted}`}>
                    Telephony dispatch if data drops
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Toggle: Monthly vs Annual */}
          <div className="p-1 rounded-2xl bg-slate-500/10 border border-slate-500/20 grid grid-cols-2 gap-1 text-center">
            <button
              onClick={() => {
                triggerHaptic(20);
                setBilling('annual');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-black transition relative ${
                billing === 'annual'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : modeStyles.textSecondary
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span>Annual Billing</span>
                <span className="text-[9px] bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded font-black">
                  SAVE 33%
                </span>
              </div>
              <span className="text-[10px] block opacity-80 mt-0.5">$3.33/mo ($39.99/yr)</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(20);
                setBilling('monthly');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-black transition ${
                billing === 'monthly'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : modeStyles.textSecondary
              }`}
            >
              <span>Monthly Billing</span>
              <span className="text-[10px] block opacity-80 mt-0.5">$4.99 / month</span>
            </button>
          </div>

          {/* Tier Comparison Breakdown */}
          <div className="space-y-2">
            <span className={`text-[11px] font-black uppercase tracking-wider block ${modeStyles.textSecondary}`}>
              Plan Comparison
            </span>

            <div className="space-y-2">
              {/* Feature 1 */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`font-black text-xs block ${modeStyles.textPrimary}`}>
                      1-Tap Check-In & Emergency Alerts
                    </span>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>
                      Instant "I'm Aokay" & swipe-up "NOT OKAY"
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[10px] font-bold">
                  <span className="text-emerald-600 block">Free: Yes</span>
                  <span className="text-amber-600 font-black">Plus: Yes</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`font-black text-xs block ${modeStyles.textPrimary}`}>
                      Family & Circle Size
                    </span>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>
                      Siblings, friends, hikers, trip mates & caregivers
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[10px] font-bold">
                  <span className="opacity-70 block">Free: 2 Members</span>
                  <span className="text-amber-600 font-black">Plus: Unlimited</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`font-black text-xs block ${modeStyles.textPrimary}`}>
                      Voice Memories Vault
                    </span>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>
                      Cherished audio check-in storage
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[10px] font-bold">
                  <span className="opacity-70 block">Free: 24 Hours</span>
                  <span className="text-amber-600 font-black">Plus: Forever</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`font-black text-xs block ${modeStyles.textPrimary}`}>
                      Missed Check-In Escalation
                    </span>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>
                      Automated alerts if member hasn't checked in by 10 AM
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[10px] font-bold">
                  <span className="opacity-70 block">Free: Manual</span>
                  <span className="text-amber-600 font-black">Plus: Automated</span>
                </div>
              </div>

              {/* Feature 5 */}
              <div className={`p-3 rounded-2xl border ${modeStyles.bgCard} ${modeStyles.borderCard} flex items-start justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`font-black text-xs block ${modeStyles.textPrimary}`}>
                      Fallback Emergency SMS / Calling
                    </span>
                    <span className={`text-[10px] ${modeStyles.textMuted}`}>
                      Direct telephony dispatch if phone is offline
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[10px] font-bold">
                  <span className="opacity-70 block">Free: No</span>
                  <span className="text-amber-600 font-black">Plus: Included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee / Free Trial badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-medium opacity-80 text-center">
            <HeartHandshake className="w-4 h-4 text-emerald-500" />
            <span>14-day free trial • Cancel anytime with one tap</span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="pt-3 border-t border-inherit space-y-2">
          {!isAlreadyActive ? (
            <button
              onClick={handleSubscribe}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>Start 14-Day Free Aokay Plus Trial</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className={`font-bold text-xs ${modeStyles.textPrimary}`}>
                  Aokay Plus Active ({subscription.billingInterval})
                </span>
              </div>
              <button
                onClick={handleCancelSubscription}
                className="text-xs text-red-500 hover:underline font-bold"
              >
                Switch to Free Tier
              </button>
            </div>
          )}

          {showSuccessToast && (
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-black text-center text-xs animate-in zoom-in">
              🎉 Welcome to Aokay Plus!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
