import React, { useState } from 'react';
import { FamilyGroup, Member } from '../types';
import { ModeStyles, AppThemeConfig } from '../services/themeConfig';
import {
  ShieldCheck,
  KeyRound,
  Users,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserPlus,
  Lock,
  Flower2,
  Cpu,
  Bookmark,
  UserCheck,
} from 'lucide-react';
import { triggerHaptic } from '../services/audioService';

interface LoginScreenProps {
  group: FamilyGroup;
  modeStyles: ModeStyles;
  themeConfig: AppThemeConfig;
  onLoginAsMember: (memberUid: string) => void;
  onLoginWithPin: (pinOrCode: string) => boolean;
  onOpenCreateCircle: () => void;
  onViewStartup: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  group,
  modeStyles,
  themeConfig,
  onLoginAsMember,
  onLoginWithPin,
  onOpenCreateCircle,
  onViewStartup,
}) => {
  const [tab, setTab] = useState<'quick' | 'pin' | 'phone'>('quick');
  const [pinInput, setPinInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const membersList = Object.values(group.members) as Member[];

  const handleQuickProfileSelect = (uid: string) => {
    triggerHaptic(40);
    onLoginAsMember(uid);
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPinError(null);
    if (!pinInput.trim()) {
      setPinError('Please enter your 4-digit PIN or Circle Code');
      return;
    }

    const success = onLoginWithPin(pinInput.trim());
    if (success) {
      triggerHaptic([30, 50]);
    } else {
      setPinError(`Incorrect PIN. Try the default demo PIN: ${group.pinCode}`);
      triggerHaptic([80, 80]);
    }
  };

  const handleKeypadPress = (val: string) => {
    triggerHaptic(25);
    setPinError(null);
    if (pinInput.length < 6) {
      const next = pinInput + val;
      setPinInput(next);
      if (next === group.pinCode || next === group.groupId) {
        onLoginWithPin(next);
      }
    }
  };

  const handleKeypadBackspace = () => {
    triggerHaptic(20);
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setSmsSent(true);
    triggerHaptic(40);
  };

  const handleVerifySms = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic([30, 50]);
    onLoginAsMember('senior-mom');
  };

  const renderArchetypeEmblem = () => {
    if (themeConfig.id === 'floral') {
      return (
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-300 text-white flex items-center justify-center shadow-xl shadow-rose-500/20 mb-3">
          <Flower2 className="w-9 h-9" />
        </div>
      );
    }
    if (themeConfig.id === 'mech') {
      return (
        <div className="w-16 h-16 rounded-lg bg-gradient-to-tr from-cyan-600 to-slate-900 text-cyan-300 border-2 border-cyan-400 flex items-center justify-center shadow-xl shadow-cyan-500/30 mb-3">
          <Cpu className="w-9 h-9" />
        </div>
      );
    }
    if (themeConfig.id === 'linen') {
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-[#b85929] text-amber-100 flex items-center justify-center shadow-xl shadow-amber-900/20 mb-3">
          <Bookmark className="w-9 h-9" />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 mb-3">
        <ShieldCheck className="w-9 h-9" />
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 ${modeStyles.bgCanvas}`}
    >
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center my-auto">
        {/* Header Branding */}
        <div className="text-center mb-6 flex flex-col items-center">
          {renderArchetypeEmblem()}
          <h1 className={`text-2xl font-black tracking-tight ${modeStyles.textPrimary}`}>
            Welcome to Aokay
          </h1>
          <p className={`text-xs mt-1 font-medium ${modeStyles.textSecondary}`}>
            Senior family safety circle • {group.groupName}
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className={`grid grid-cols-3 p-1 rounded-2xl mb-4 border ${modeStyles.borderCard} ${modeStyles.bgCard} gap-1`}>
          <button
            onClick={() => {
              setTab('quick');
              triggerHaptic(20);
            }}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'quick'
                ? `${modeStyles.accent} shadow-xs font-black`
                : `${modeStyles.textSecondary} hover:${modeStyles.textPrimary}`
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">One-Tap</span>
          </button>

          <button
            onClick={() => {
              setTab('pin');
              triggerHaptic(20);
            }}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'pin'
                ? `${modeStyles.accent} shadow-xs font-black`
                : `${modeStyles.textSecondary} hover:${modeStyles.textPrimary}`
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Circle PIN</span>
          </button>

          <button
            onClick={() => {
              setTab('phone');
              triggerHaptic(20);
            }}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'phone'
                ? `${modeStyles.accent} shadow-xs font-black`
                : `${modeStyles.textSecondary} hover:${modeStyles.textPrimary}`
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">SMS Code</span>
          </button>
        </div>

        {/* TAB 1: QUICK PROFILES (Senior-Friendly 1-Tap) */}
        {tab === 'quick' && (
          <div className="space-y-2.5">
            <span className={`text-[11px] font-black uppercase tracking-wider block text-center ${modeStyles.textSecondary}`}>
              Select who is using this phone
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {membersList.map((member) => (
                <button
                  key={member.uid}
                  onClick={() => handleQuickProfileSelect(member.uid)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between group ${modeStyles.bgCard} ${modeStyles.borderCard} ${modeStyles.bgCardHover}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-sm ${
                        member.role === 'SENIOR'
                          ? 'bg-amber-600 border border-amber-400'
                          : 'bg-blue-600 border border-blue-400'
                      }`}
                    >
                      {member.displayName.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black ${modeStyles.textPrimary}`}>
                          {member.displayName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            member.role === 'SENIOR'
                              ? 'bg-amber-500/20 text-amber-600'
                              : 'bg-blue-500/20 text-blue-600'
                          }`}
                        >
                          {member.role === 'SENIOR' ? 'Senior Mom' : 'Caregiver'}
                        </span>
                      </div>
                      <p className={`text-xs ${modeStyles.textSecondary} mt-0.5`}>
                        {member.relationship} • Tap to enter app
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CIRCLE PIN KEYPAD */}
        {tab === 'pin' && (
          <div className={`p-5 rounded-3xl border ${modeStyles.bgCard} ${modeStyles.borderCard} space-y-4`}>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center mb-1.5">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className={`text-sm font-black ${modeStyles.textPrimary}`}>
                Enter Circle PIN
              </h2>
              <p className={`text-xs ${modeStyles.textSecondary} mt-0.5`}>
                Default family code is <strong>{group.pinCode}</strong>
              </p>
            </div>

            {/* PIN Dots display */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pinInput.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      isFilled
                        ? 'bg-blue-600 border-blue-500 scale-110'
                        : 'border-slate-400/50'
                    }`}
                  />
                );
              })}
            </div>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* Accessible Large Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className={`py-3.5 rounded-2xl font-black text-xl border transition shadow-xs active:scale-95 ${modeStyles.bgSurface} ${modeStyles.borderCard} ${modeStyles.textPrimary}`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  setPinInput('');
                }}
                className={`py-3.5 rounded-2xl font-bold text-xs border transition ${modeStyles.bgSurface} ${modeStyles.borderCard} ${modeStyles.textSecondary}`}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className={`py-3.5 rounded-2xl font-black text-xl border transition shadow-xs active:scale-95 ${modeStyles.bgSurface} ${modeStyles.borderCard} ${modeStyles.textPrimary}`}
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className={`py-3.5 rounded-2xl font-bold text-xs border transition ${modeStyles.bgSurface} ${modeStyles.borderCard} ${modeStyles.textSecondary}`}
              >
                ⌫
              </button>
            </div>

            <button
              type="button"
              onClick={() => handlePinSubmit()}
              className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-md transition ${modeStyles.accent}`}
            >
              Verify PIN & Continue
            </button>
          </div>
        )}

        {/* TAB 3: SMS PHONE LOGIN */}
        {tab === 'phone' && (
          <div className={`p-5 rounded-3xl border ${modeStyles.bgCard} ${modeStyles.borderCard}`}>
            {!smsSent ? (
              <form onSubmit={handleSendSms} className="space-y-4">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center mb-1.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h2 className={`text-sm font-black ${modeStyles.textPrimary}`}>
                    Phone Login
                  </h2>
                  <p className={`text-xs ${modeStyles.textSecondary} mt-0.5`}>
                    Enter your mobile number to sign in
                  </p>
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 234-5678"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className={`w-full p-3.5 rounded-2xl text-sm font-semibold border ${modeStyles.inputBg}`}
                  />
                  <p className={`text-[11px] mt-1.5 ${modeStyles.textMuted}`}>
                    We'll text a 6-digit confirmation code to your phone.
                  </p>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${modeStyles.accent}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Login Code</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifySms} className="space-y-4">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className={`text-sm font-bold ${modeStyles.textPrimary}`}>
                    Code Sent to {phoneInput}
                  </h3>
                  <p className={`text-xs mt-1 ${modeStyles.textMuted}`}>
                    Use demo code <strong>123456</strong>
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  placeholder="123456"
                  className={`w-full p-3.5 rounded-2xl text-center font-mono text-xl tracking-widest font-black border ${modeStyles.inputBg}`}
                />

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl font-black text-sm ${modeStyles.accent}`}
                >
                  Confirm & Enter
                </button>
              </form>
            )}
          </div>
        )}

        {/* Create circle or startup replay actions */}
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <button
            onClick={onOpenCreateCircle}
            className={`text-xs font-bold hover:underline flex items-center gap-1.5 ${modeStyles.textPrimary}`}
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-500" />
            <span>Create a new Family Safety Circle</span>
          </button>

          <button
            onClick={onViewStartup}
            className={`text-[11px] font-medium opacity-70 hover:opacity-100 ${modeStyles.textMuted}`}
          >
            ← View Welcome Intro Screen
          </button>
        </div>
      </div>
    </div>
  );
};
