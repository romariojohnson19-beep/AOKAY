import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Flower2,
  Cpu,
  Bookmark,
} from 'lucide-react';
import { ModeStyles, AppThemeConfig } from '../services/themeConfig';

interface StartupScreenProps {
  modeStyles: ModeStyles;
  themeConfig: AppThemeConfig;
  onContinue: () => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({
  modeStyles,
  themeConfig,
  onContinue,
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderEmblem = () => {
    if (themeConfig.id === 'floral') {
      return (
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-300 p-0.5 shadow-2xl shadow-rose-500/30 flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-black/10 backdrop-blur-xs flex items-center justify-center relative">
            <Flower2 className="w-14 h-14 text-white drop-shadow-md" />
            <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg animate-pulse">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>
      );
    }
    if (themeConfig.id === 'mech') {
      return (
        <div className="w-28 h-28 rounded-xl bg-gradient-to-tr from-cyan-600 to-slate-900 border-2 border-cyan-400 p-0.5 shadow-2xl shadow-cyan-500/40 flex items-center justify-center">
          <div className="w-full h-full rounded-lg bg-black/30 backdrop-blur-xs flex items-center justify-center relative">
            <Cpu className="w-14 h-14 text-cyan-300 drop-shadow-md" />
            <div className="absolute bottom-2 right-2 p-1.5 rounded-xs bg-emerald-500 text-slate-950 font-mono text-[9px] font-black shadow-lg">
              SEC
            </div>
          </div>
        </div>
      );
    }
    if (themeConfig.id === 'linen') {
      return (
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-700 to-[#b85929] border-2 border-[#dfd3c0] p-0.5 shadow-2xl shadow-amber-900/30 flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-black/10 backdrop-blur-xs flex items-center justify-center relative">
            <Bookmark className="w-14 h-14 text-amber-100 drop-shadow-md" />
            <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-600 text-white shadow-lg animate-pulse">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 p-0.5 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
        <div className="w-full h-full rounded-[22px] bg-black/10 backdrop-blur-xs flex items-center justify-center relative">
          <ShieldCheck className="w-14 h-14 text-white drop-shadow-md" />
          <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg animate-pulse">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 select-none transition-colors duration-300 ${modeStyles.bgCanvas}`}
    >
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-[500px] h-[500px] rounded-full border-2 border-slate-500/20 animate-ping duration-1000" />
        <div className="w-[340px] h-[340px] rounded-full border border-slate-400/20" />
      </div>

      {/* Top Bar / Skip */}
      <div className="w-full max-w-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className={modeStyles.textPrimary}>Family Safety Circle</span>
        </div>
        <button
          onClick={onContinue}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition hover:bg-slate-500/10 ${modeStyles.textSecondary}`}
        >
          Skip Intro →
        </button>
      </div>

      {/* Center Branding Hero */}
      <div className="w-full max-w-sm flex flex-col items-center text-center z-10 my-auto py-8">
        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          {renderEmblem()}
          {/* Subtle Beacon Waves */}
          <span className="absolute -inset-2 rounded-3xl border-2 border-blue-400/40 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-4xl font-extrabold tracking-tight mb-2 ${modeStyles.textPrimary}`}
        >
          Aokay
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-base font-medium max-w-xs leading-relaxed ${modeStyles.textSecondary}`}
        >
          Instant check-ins and voice updates for your circle.
        </motion.p>

        {/* Trust Points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col gap-2 text-left w-full px-2"
        >
          <div className={`p-3 rounded-2xl flex items-center gap-3 border ${modeStyles.bgCard} ${modeStyles.borderCard}`}>
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className={`text-xs font-semibold ${modeStyles.textPrimary}`}>
              One-tap morning & evening safety check-ins
            </span>
          </div>

          <div className={`p-3 rounded-2xl flex items-center gap-3 border ${modeStyles.bgCard} ${modeStyles.borderCard}`}>
            <Heart className="w-5 h-5 text-rose-500 shrink-0" />
            <span className={`text-xs font-semibold ${modeStyles.textPrimary}`}>
              Swipe up for instant emergency caregiver broadcast
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full max-w-sm z-10 pb-2">
        <button
          onClick={onContinue}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition duration-150 ${modeStyles.accent}`}
        >
          <span>Enter Family Circle</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className={`text-[11px] text-center mt-3 font-medium ${modeStyles.textMuted}`}>
          Aokay Care • Safe & Connected
        </p>
      </div>
    </div>
  );
};
