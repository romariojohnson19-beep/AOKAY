import React, { useState } from 'react';
import { MemberRole } from '../types';
import { Users, UserPlus, LogIn, ArrowRight, Sparkles, Heart, Shield } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string, userName: string, role: MemberRole) => void;
  onJoinGroup: (code: string, userName: string, role: MemberRole) => { success: boolean; error?: string };
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
  onJoinGroup,
}) => {
  const [view, setView] = useState<'CHOICE' | 'CREATE' | 'JOIN'>('CHOICE');
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [code, setCode] = useState('');
  const [role, setRole] = useState<MemberRole>('SENIOR');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    onCreateGroup(groupName, userName, role);
    onClose();
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!code.trim()) {
      setErrorMessage('Please enter the 6-character group code or 4-digit PIN');
      return;
    }
    const res = onJoinGroup(code, userName, role);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to join group');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-3 shadow-lg shadow-blue-600/30">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Aokay</h2>
          <p className="text-sm text-slate-400 mt-1">
            Instant check-ins and voice updates for your circle.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500 text-red-300 text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* 1. Main Choice View */}
        {view === 'CHOICE' && (
          <div className="space-y-4">
            <button
              onClick={() => {
                setErrorMessage('');
                setView('CREATE');
              }}
              className="w-full p-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-left transition flex items-center justify-between shadow-lg shadow-blue-900/40 group border border-blue-400/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-blue-700/80">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-base font-extrabold">Create Family Group</div>
                  <div className="text-xs text-blue-200 font-medium">
                    Start a new safety circle & get a 6-character code
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => {
                setErrorMessage('');
                setView('JOIN');
              }}
              className="w-full p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-left transition flex items-center justify-between border border-slate-700 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-slate-700/80">
                  <LogIn className="w-6 h-6 text-slate-200" />
                </div>
                <div>
                  <div className="text-base font-extrabold">Join Family Group</div>
                  <div className="text-xs text-slate-400 font-medium">
                    Enter an existing 6-character code or PIN
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition font-medium"
            >
              Continue exploring with demo family (The Miller Family)
            </button>
          </div>
        )}

        {/* 2. Create Group View */}
        {view === 'CREATE' && (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Family Group Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Miller Family"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mom or Sarah"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('SENIOR')}
                  className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1 ${
                    role === 'SENIOR'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Senior (Checking In)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('CAREGIVER')}
                  className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1 ${
                    role === 'CAREGIVER'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Caregiver (Monitoring)</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView('CHOICE')}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition shadow-lg shadow-blue-900/40"
              >
                Create Group
              </button>
            </div>
          </form>
        )}

        {/* 3. Join Group View */}
        {view === 'JOIN' && (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                6-Character Code or 4-Digit PIN
              </label>
              <input
                type="text"
                placeholder="e.g. OK-4829 or 4829"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-base font-mono text-center font-bold tracking-widest uppercase"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Default demo PIN is <span className="font-mono text-blue-400 font-bold">4829</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. David"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('SENIOR')}
                  className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1 ${
                    role === 'SENIOR'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Senior</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('CAREGIVER')}
                  className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1 ${
                    role === 'CAREGIVER'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Caregiver</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView('CHOICE')}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition shadow-lg shadow-blue-900/40"
              >
                Join Group
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
