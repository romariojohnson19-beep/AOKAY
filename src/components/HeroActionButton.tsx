import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Mic,
  CheckCircle,
  AlertOctagon,
  X,
  ChevronUp,
  Radio,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  playSuccessChime,
  playEmergencyAlertSound,
  triggerHaptic,
  startAudioRecording,
  stopAudioRecording,
} from '../services/audioService';
import { ModeStyles, AppThemeConfig } from '../services/themeConfig';

interface HeroActionButtonProps {
  onCheckIn: (
    type: 'AOKAY' | 'NOT_OKAY',
    audioUrl?: string | null,
    durationSec?: number | null,
    emergencyNote?: string
  ) => void;
  currentUserStatus: 'CHECKED_IN' | 'PENDING' | 'NOT_OKAY';
  modeStyles: ModeStyles;
  themeConfig: AppThemeConfig;
}

export const HeroActionButton: React.FC<HeroActionButtonProps> = ({
  onCheckIn,
  currentUserStatus,
  modeStyles,
  themeConfig,
}) => {
  // Mode: 'BLUE' (I'm Aokay) | 'RED' (NOT OKAY emergency)
  const [mode, setMode] = useState<'BLUE' | 'RED'>('BLUE');

  // Interaction states
  const [isPressing, setIsPressing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeSec, setRecordingTimeSec] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100 during the first 1s
  const [showSuccessBubble, setShowSuccessBubble] = useState(false);

  // Swipe / Drag tracking
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTimeRef = useRef<number>(0);
  const hasTriggeredRecordRef = useRef<boolean>(false);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearInterval(pressTimerRef.current);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // Handle pointer / touch down
  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    touchStartYRef.current = clientY;
    pressStartTimeRef.current = Date.now();
    hasTriggeredRecordRef.current = false;
    setIsPressing(true);
    setHoldProgress(0);
    triggerHaptic(20);

    // Track hold duration for audio recording initiation (starts after 600ms hold)
    const interval = setInterval(() => {
      const elapsed = Date.now() - pressStartTimeRef.current;
      const progress = Math.min(100, Math.floor((elapsed / 600) * 100));
      setHoldProgress(progress);

      if (elapsed >= 600 && !hasTriggeredRecordRef.current) {
        hasTriggeredRecordRef.current = true;
        clearInterval(interval);
        startVoiceRecording();
      }
    }, 50);

    pressTimerRef.current = interval;
  };

  // Handle pointer move (detect swipe up)
  const handlePointerMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!touchStartYRef.current) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    const deltaY = clientY - touchStartYRef.current;

    // Upward drag detection
    if (deltaY < 0) {
      setDragOffsetY(deltaY);

      // Swipe up threshold: -75px switches directly to RED NOT_OKAY mode
      if (deltaY < -75 && mode === 'BLUE') {
        setMode('RED');
        cancelPressing();
        triggerHaptic([60, 40, 60]);
        playEmergencyAlertSound();
      }
    }
  };

  // Handle pointer / touch release
  const handlePointerUp = async () => {
    if (!isPressing && !isRecording) return;

    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    const elapsed = Date.now() - pressStartTimeRef.current;

    if (isRecording) {
      // Finish voice recording check-in
      await finishVoiceRecording();
    } else if (elapsed < 600) {
      // Standard quick tap check-in
      handleQuickTap();
    }

    cancelPressing();
  };

  const cancelPressing = () => {
    setIsPressing(false);
    setHoldProgress(0);
    touchStartYRef.current = null;
    setDragOffsetY(0);
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const startVoiceRecording = async () => {
    setIsRecording(true);
    setRecordingTimeSec(0);
    triggerHaptic([40, 80]);
    await startAudioRecording();

    // Start ticker
    const timer = setInterval(() => {
      setRecordingTimeSec((prev) => {
        if (prev >= 29) {
          // Cap at 30 seconds
          finishVoiceRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
    recordingIntervalRef.current = timer;
  };

  const finishVoiceRecording = async () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsRecording(false);
    const audioDataUrl = await stopAudioRecording();
    const finalSec = Math.max(1, recordingTimeSec);

    if (mode === 'BLUE') {
      playSuccessChime();
      triggerHaptic([30, 60, 30]);
      fireConfetti();
      showSuccessAnimation();
      onCheckIn('AOKAY', audioDataUrl, finalSec);
    } else {
      playEmergencyAlertSound();
      triggerHaptic([100, 100, 100]);
      onCheckIn('NOT_OKAY', audioDataUrl, finalSec, 'Emergency voice note');
      setMode('BLUE'); // Return back after sending
    }
  };

  const handleQuickTap = () => {
    if (mode === 'BLUE') {
      playSuccessChime();
      triggerHaptic(40);
      fireConfetti();
      showSuccessAnimation();
      onCheckIn('AOKAY', null, null);
    } else {
      // Tap on RED button: Instant NOT OKAY alert
      playEmergencyAlertSound();
      triggerHaptic([80, 80, 80]);
      onCheckIn('NOT_OKAY', null, null, 'Immediate NOT OKAY alert triggered');
      setMode('BLUE');
    }

    touchStartYRef.current = null;
    setDragOffsetY(0);
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#38BDF8', '#34D399', '#60A5FA', '#FBBF24'],
      });
    } catch (e) {
      // ignore
    }
  };

  const showSuccessAnimation = () => {
    setShowSuccessBubble(true);
    setTimeout(() => setShowSuccessBubble(false), 2600);
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-end select-none pt-2 pb-5">
      {/* Success Notification Popover */}
      <AnimatePresence>
        {showSuccessBubble && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            className="absolute -top-12 z-30 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 border border-emerald-300"
          >
            <CheckCircle className="w-4 h-4 fill-slate-950 text-emerald-400" />
            <span>Family notified: You're Aokay! ✓</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe-Up Prompt indicator (Only visible in BLUE mode) */}
      {mode === 'BLUE' && !isRecording && (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="flex flex-col items-center mb-2.5 cursor-pointer"
          onClick={() => {
            setMode('RED');
            triggerHaptic([80, 50, 80]);
            playEmergencyAlertSound();
          }}
          title="Swipe up or tap for NOT OKAY"
        >
          <div className="flex items-center gap-1 text-[11px] font-black text-red-500 hover:text-red-400 transition tracking-wider px-3 py-1 rounded-full bg-red-950/25 border border-red-500/40 shadow-xs">
            <span>▲ NOT OKAY</span>
          </div>
        </motion.div>
      )}

      {/* Red Mode Cancel Button Header */}
      {mode === 'RED' && (
        <div className="w-full flex items-center justify-between px-3 mb-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Emergency Mode Active</span>
          </div>
          <button
            onClick={() => {
              setMode('BLUE');
              cancelPressing();
              triggerHaptic(20);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-500/20 hover:bg-slate-500/30 text-xs font-bold transition flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Button Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer SVG Hold-Progress Ring/Border */}
        <svg
          className="absolute w-48 h-48 -rotate-90 pointer-events-none"
          viewBox="0 0 160 160"
        >
          {themeConfig.id === 'mech' ? (
            <>
              <rect
                x="6"
                y="6"
                width="148"
                height="148"
                rx="18"
                className="stroke-transparent"
                strokeWidth="6"
                fill="none"
              />
              {isPressing && (
                <rect
                  x="6"
                  y="6"
                  width="148"
                  height="148"
                  rx="18"
                  pathLength={100}
                  className={mode === 'BLUE' ? 'stroke-cyan-400' : 'stroke-orange-400'}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="100"
                  strokeDashoffset={100 - holdProgress}
                  strokeLinecap="round"
                />
              )}
            </>
          ) : (
            <>
              <circle
                cx="80"
                cy="80"
                r="74"
                className="stroke-transparent"
                strokeWidth="6"
                fill="none"
              />
              {isPressing && (
                <circle
                  cx="80"
                  cy="80"
                  r="74"
                  className={mode === 'BLUE' ? 'stroke-blue-400' : 'stroke-red-400'}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 74}
                  strokeDashoffset={2 * Math.PI * 74 * (1 - holdProgress / 100)}
                  strokeLinecap="round"
                />
              )}
            </>
          )}
        </svg>

        {/* Pulse / Beacon / Glow animation matching button geometry */}
        {themeConfig.id === 'mech' ? (
          <>
            {/* Tactical Mech Square Glow & Expanding Frame */}
            {currentUserStatus === 'PENDING' && !isPressing && !isRecording && (
              <>
                <div
                  className={`absolute w-44 h-44 rounded-2xl animate-ping border-2 ${
                    mode === 'BLUE' ? 'border-cyan-400 bg-cyan-500/20' : 'border-orange-500 bg-orange-500/20'
                  } opacity-40 pointer-events-none`}
                />
                <div
                  className={`absolute w-48 h-48 rounded-2xl ${
                    mode === 'BLUE' ? 'bg-cyan-500/15' : 'bg-orange-500/15'
                  } blur-lg animate-pulse pointer-events-none`}
                />
              </>
            )}
            {/* Precision HUD Corner Brackets for Mech theme */}
            <div className="absolute w-48 h-48 pointer-events-none flex flex-col justify-between p-0.5">
              <div className="flex justify-between w-full">
                <div className={`w-3 h-3 border-t-2 border-l-2 ${mode === 'BLUE' ? 'border-cyan-400/80' : 'border-orange-400/80'}`} />
                <div className={`w-3 h-3 border-t-2 border-r-2 ${mode === 'BLUE' ? 'border-cyan-400/80' : 'border-orange-400/80'}`} />
              </div>
              <div className="flex justify-between w-full">
                <div className={`w-3 h-3 border-b-2 border-l-2 ${mode === 'BLUE' ? 'border-cyan-400/80' : 'border-orange-400/80'}`} />
                <div className={`w-3 h-3 border-b-2 border-r-2 ${mode === 'BLUE' ? 'border-cyan-400/80' : 'border-orange-400/80'}`} />
              </div>
            </div>
          </>
        ) : (
          currentUserStatus === 'PENDING' && !isPressing && !isRecording && (
            <>
              <div className="absolute w-44 h-44 rounded-full animate-ping opacity-25 bg-blue-500 pointer-events-none" />
              <div className="absolute w-48 h-48 rounded-full bg-blue-500/15 blur-md animate-pulse pointer-events-none" />
            </>
          )
        )}

        {/* The Action Button */}
        <motion.button
          id="hero-aokay-button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={cancelPressing}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onTouchCancel={cancelPressing}
          whileTap={{ scale: 0.95 }}
          style={{ y: dragOffsetY < 0 ? Math.max(-60, dragOffsetY) : 0 }}
          className={`relative w-44 h-44 ${themeConfig.id === 'mech' ? 'rounded-2xl' : 'rounded-full'} flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-200 border-4 touch-none cursor-pointer ${
            mode === 'BLUE'
              ? isRecording
                ? `${modeStyles.heroButtonBlue} ring-8 ${themeConfig.id === 'mech' ? 'ring-cyan-400/40 rounded-2xl' : 'ring-blue-500/30'}`
                : `${modeStyles.heroButtonBlue} hover:scale-[1.02]`
              : isRecording
              ? `${modeStyles.heroButtonRed} ring-8 ${themeConfig.id === 'mech' ? 'ring-orange-400/40 rounded-2xl' : 'ring-red-500/30'}`
              : `${modeStyles.heroButtonRed} hover:scale-[1.02] animate-pulse`
          }`}
          aria-label={mode === 'BLUE' ? 'A Okay' : 'Send Emergency NOT OKAY'}
        >
          {/* Internal Content */}
          {isRecording ? (
            /* RECORDING STATE */
            <div className="flex flex-col items-center justify-center p-2 text-center animate-in fade-in zoom-in duration-150">
              <div className={`w-12 h-12 ${themeConfig.id === 'mech' ? 'rounded-xl' : 'rounded-full'} bg-white/20 flex items-center justify-center mb-1 animate-ping`}>
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-white/90">
                Recording Note
              </span>
              <span className="text-xl font-mono font-black mt-0.5">
                0:{recordingTimeSec < 10 ? `0${recordingTimeSec}` : recordingTimeSec}
              </span>
              <span className="text-[10px] text-white/80 mt-1 font-medium">
                Release to Send
              </span>
            </div>
          ) : mode === 'BLUE' ? (
            /* BLUE "A OKAY" STATE */
            <div className="flex flex-col items-center justify-center text-center p-2">
              <div className={`w-11 h-11 ${themeConfig.id === 'mech' ? 'rounded-xl' : 'rounded-full'} bg-white/15 flex items-center justify-center mb-2 backdrop-blur-xs`}>
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight drop-shadow-md">
                A Okay
              </span>
            </div>
          ) : (
            /* RED "NOT OKAY" STATE */
            <div className="flex flex-col items-center justify-center text-center p-2">
              <div className={`w-10 h-10 ${themeConfig.id === 'mech' ? 'rounded-xl' : 'rounded-full'} bg-white/20 flex items-center justify-center mb-1.5`}>
                <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase text-white drop-shadow">
                NOT OKAY
              </span>
              <span className="text-[11px] font-bold text-red-100 mt-1">
                Tap: Silent Alert
              </span>
              <span className="text-[10px] text-red-200/80 font-medium">
                Hold: Voice Emergency
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Red mode emergency note if active */}
      {mode === 'RED' && (
        <div className="mt-2 text-center">
          <p className="text-xs text-red-500 font-bold">
            ⚠️ Emergency alert will notify all caregivers with high priority
          </p>
        </div>
      )}
    </div>
  );
};
