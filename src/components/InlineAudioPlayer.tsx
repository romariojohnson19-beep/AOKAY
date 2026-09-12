import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Star, Volume2 } from 'lucide-react';

interface InlineAudioPlayerProps {
  audioUrl?: string | null;
  durationSec?: number | null;
  isSaved?: boolean;
  onToggleSave: () => void;
  authorName: string;
}

export const InlineAudioPlayer: React.FC<InlineAudioPlayerProps> = ({
  audioUrl,
  durationSec = 12,
  isSaved = false,
  onToggleSave,
  authorName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const duration = durationSec && durationSec > 0 ? durationSec : 12;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Audio playback error:', e);
        // Fallback progress animation if empty audio element
        simulatePlayback();
      });
    }
  };

  const simulatePlayback = () => {
    setIsPlaying(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 0.2;
      setProgress((current / duration) * 100);
      if (current >= duration) {
        clearInterval(interval);
        setIsPlaying(false);
        setProgress(0);
      }
    }, 200);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 flex items-center justify-between gap-3">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
        />
      )}

      {/* Left: Play / Pause Button */}
      <button
        onClick={togglePlay}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition active:scale-95 ${
          isPlaying
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30'
        }`}
        title={isPlaying ? 'Pause voice note' : 'Play voice note'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
        <span>{isPlaying ? 'Playing' : `Play (${formatSec(duration)})`}</span>
      </button>

      {/* Middle: Waveform Animation / Scrubber */}
      <div className="flex-1 flex items-center gap-1 h-5 px-1 overflow-hidden">
        {[40, 70, 95, 60, 85, 100, 75, 50, 90, 65, 80, 45, 90, 70, 50].map((h, i) => {
          const isActive = (i / 15) * 100 <= progress;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying
                  ? isActive
                    ? 'bg-blue-400'
                    : 'bg-slate-700'
                  : isSaved
                  ? 'bg-amber-400/40'
                  : 'bg-slate-600'
              }`}
              style={{
                height: isPlaying ? `${Math.max(20, (h * (0.6 + Math.sin(Date.now() / 150 + i) * 0.4)))}%` : `${h * 0.6}%`,
              }}
            />
          );
        })}
      </div>

      {/* Right: Save to Memories Button */}
      <button
        onClick={onToggleSave}
        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
          isSaved
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
            : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
        }`}
        title={isSaved ? 'Saved in Memories' : 'Save to Memories'}
      >
        <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
        <span className="text-[11px] hidden sm:inline">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      </button>
    </div>
  );
};
