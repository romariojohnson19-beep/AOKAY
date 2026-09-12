import React from 'react';
import { CheckIn } from '../types';
import { InlineAudioPlayer } from './InlineAudioPlayer';
import { Sparkles, X, Heart, Calendar } from 'lucide-react';

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCheckins: CheckIn[];
  onToggleSave: (id: string) => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({
  isOpen,
  onClose,
  savedCheckins,
  onToggleSave,
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Family Memories</h2>
              <p className="text-xs text-slate-400">
                Cherished voice check-ins saved by your family
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedCheckins.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500 mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">No saved memories yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                When family members check in with audio notes, tap the ⭐ icon on any check-in card to keep their voice here forever.
              </p>
            </div>
          ) : (
            savedCheckins.map((checkin) => (
              <div
                key={checkin.id}
                className="p-4 rounded-2xl bg-slate-800/70 border border-amber-500/30 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{checkin.authorName}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(checkin.timestamp)}
                  </span>
                </div>

                {checkin.emergencyNote && (
                  <p className="text-xs text-slate-300 italic bg-slate-900/40 p-2 rounded-lg">
                    "{checkin.emergencyNote}"
                  </p>
                )}

                <InlineAudioPlayer
                  audioUrl={checkin.audioUrl}
                  durationSec={checkin.audioDurationSec || 12}
                  isSaved={checkin.isSaved}
                  onToggleSave={() => onToggleSave(checkin.id)}
                  authorName={checkin.authorName}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
