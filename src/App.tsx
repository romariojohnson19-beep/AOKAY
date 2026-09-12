import React, { useState, useEffect } from 'react';
import {
  FamilyGroup,
  Member,
  PushNotificationEvent,
  MemberRole,
  AppTheme,
  AppFont,
  TextScale,
  SubscriptionPlan,
  LocationData,
} from './types';
import {
  getStoredGroup,
  saveGroup,
  getActiveUserId,
  setActiveUserId,
  performCheckIn,
  toggleMemorySaved,
  sendPing,
  createNewFamilyGroup,
  joinExistingFamilyGroup,
  resetDemoData,
  getStoredTheme,
  saveStoredTheme,
  getStoredFont,
  saveStoredFont,
  getStoredTextScale,
  saveStoredTextScale,
  getStoredDarkMode,
  saveStoredDarkMode,
  getStoredSubscription,
  saveStoredSubscription,
  getIsLoggedIn,
  saveIsLoggedIn,
  getHasSeenStartup,
  saveHasSeenStartup,
  switchCirclePreset,
  updateMemberProfile,
  requestMemberLocation,
} from './services/storageService';
import {
  playSuccessChime,
  playPingChime,
  playEmergencyAlertSound,
  triggerHaptic,
} from './services/audioService';
import {
  THEME_CONFIGS,
  FONTS,
  TEXT_SCALES,
  getActiveThemeStyles,
} from './services/themeConfig';
import { getCurrentDeviceLocation } from './services/locationService';
import { Header } from './components/Header';
import { FamilyFeed } from './components/FamilyFeed';
import { HeroActionButton } from './components/HeroActionButton';
import { MemoriesModal } from './components/MemoriesModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { FlutterCodeModal } from './components/FlutterCodeModal';
import { NotificationToast } from './components/NotificationToast';
import { StartupScreen } from './components/StartupScreen';
import { LoginScreen } from './components/LoginScreen';
import { CarePlusModal } from './components/CarePlusModal';
import { ProfileAvatarModal } from './components/ProfileAvatarModal';
import { LocationViewModal } from './components/LocationViewModal';
import {
  AlertTriangle,
  Phone,
  Crown,
} from 'lucide-react';

export default function App() {
  const [group, setGroup] = useState<FamilyGroup>(getStoredGroup);
  const [currentUserId, setCurrentUserId] = useState<string>(getActiveUserId);
  const [notification, setNotification] = useState<PushNotificationEvent | null>(null);

  // Appearance & Themes (Midnight, Floral, Mech, Linen with dedicated Light & Dark modes)
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme);
  const [darkMode, setDarkMode] = useState<boolean>(getStoredDarkMode);
  const [font, setFont] = useState<AppFont>(getStoredFont);
  const [textScale, setTextScale] = useState<TextScale>(getStoredTextScale);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Monetization & Subscription (Freemium + Care+ Family Pass)
  const [subscription, setSubscription] = useState<SubscriptionPlan>(getStoredSubscription);
  const [isCarePlusOpen, setIsCarePlusOpen] = useState(false);

  // Screen routing
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getIsLoggedIn);
  const [showStartup, setShowStartup] = useState<boolean>(() => !getHasSeenStartup());

  // Modals
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isFlutterCodeOpen, setIsFlutterCodeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocationMember, setSelectedLocationMember] = useState<Member | null>(null);
  const [selectedLocationData, setSelectedLocationData] = useState<LocationData | undefined>(undefined);

  // Sync state across custom events
  useEffect(() => {
    const handleDataUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<FamilyGroup>;
      if (customEvent.detail) {
        setGroup(customEvent.detail);
      }
    };

    const handleUserSwitched = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setCurrentUserId(customEvent.detail);
      }
    };

    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<PushNotificationEvent>;
      if (customEvent.detail) {
        setNotification(customEvent.detail);
        if (soundEnabled) {
          if (customEvent.detail.type === 'EMERGENCY') {
            playEmergencyAlertSound();
          } else if (customEvent.detail.type === 'PING') {
            playPingChime();
          }
        }
      }
    };

    window.addEventListener('aokay_data_updated', handleDataUpdated);
    window.addEventListener('aokay_user_switched', handleUserSwitched);
    window.addEventListener('aokay_notification_received', handleNotification);

    return () => {
      window.removeEventListener('aokay_data_updated', handleDataUpdated);
      window.removeEventListener('aokay_user_switched', handleUserSwitched);
      window.removeEventListener('aokay_notification_received', handleNotification);
    };
  }, [soundEnabled]);

  // Auto-dismiss notification toast after 6s
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Global UI & Text Scaling across all screens, tabs, and modals
  useEffect(() => {
    document.documentElement.setAttribute('data-text-scale', textScale);
    if (textScale === 'extra-large') {
      document.documentElement.style.fontSize = '20.8px';
    } else if (textScale === 'large') {
      document.documentElement.style.fontSize = '18.4px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [textScale]);

  // Sync dark mode class on root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const modeStyles = getActiveThemeStyles(theme, darkMode);
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.midnight;
  const currentFontObj = FONTS[font] || FONTS.lexend;
  const currentScaleObj = TEXT_SCALES[textScale] || TEXT_SCALES.normal;

  const activeMember: Member | null = group.members[currentUserId] || null;
  const membersList: Member[] = Object.values(group.members) as Member[];
  const savedMemories = group.checkins.filter((c) => c.isSaved);
  const emergencyMembers: Member[] = membersList.filter((m) => m.status === 'NOT_OKAY');

  // Theme & Appearance handlers
  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    saveStoredTheme(newTheme);
  };

  const handleToggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    saveStoredDarkMode(nextVal);
  };

  const handleSelectFont = (newFont: AppFont) => {
    setFont(newFont);
    saveStoredFont(newFont);
  };

  const handleSelectTextScale = (newScale: TextScale) => {
    setTextScale(newScale);
    saveStoredTextScale(newScale);
  };

  // Subscription plan handler
  const handleUpdateSubscription = (plan: SubscriptionPlan) => {
    setSubscription(plan);
    saveStoredSubscription(plan);
  };

  // Auth & Startup handlers
  const handleDismissStartup = () => {
    setShowStartup(false);
    saveHasSeenStartup(true);
    triggerHaptic(30);
  };

  const handleLoginAsMember = (memberUid: string) => {
    setActiveUserId(memberUid);
    setCurrentUserId(memberUid);
    setIsLoggedIn(true);
    saveIsLoggedIn(true);
    if (soundEnabled) playSuccessChime();
    triggerHaptic([30, 40]);
  };

  const handleLoginWithPin = (pinOrCode: string): boolean => {
    const clean = pinOrCode.trim();
    if (clean === group.pinCode || clean === group.groupId) {
      setIsLoggedIn(true);
      saveIsLoggedIn(true);
      if (soundEnabled) playSuccessChime();
      return true;
    }
    return false;
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    saveIsLoggedIn(false);
    triggerHaptic(40);
  };

  // Check-in Actions with location attachment
  const handleCheckIn = async (
    type: 'AOKAY' | 'NOT_OKAY',
    audioUrl?: string | null,
    durationSec?: number | null,
    emergencyNote?: string
  ) => {
    let loc: LocationData | undefined = undefined;
    try {
      const res = await getCurrentDeviceLocation(group.groupType || 'family');
      loc = res.location;
    } catch {
      // Continue gracefully without blocking check-in
    }
    performCheckIn(currentUserId, type, audioUrl, durationSec, emergencyNote, loc);
    setGroup(getStoredGroup());
  };

  const handleSaveProfile = (updates: Partial<Member>) => {
    updateMemberProfile(currentUserId, updates);
    setGroup(getStoredGroup());
  };

  const handleRequestLocation = (targetUid: string) => {
    requestMemberLocation(currentUserId, targetUid);
    triggerHaptic([30, 40]);
  };

  const handleViewLocation = (member: Member, location?: LocationData) => {
    setSelectedLocationMember(member);
    setSelectedLocationData(location || member.location);
    setIsLocationModalOpen(true);
    triggerHaptic(20);
  };

  const handleSelectCirclePreset = (presetId: 'family' | 'hiking' | 'trip') => {
    const newGroup = switchCirclePreset(presetId);
    setGroup(newGroup);
    setCurrentUserId(getActiveUserId());
    triggerHaptic([30, 50]);
  };

  const handlePing = (targetUid: string) => {
    triggerHaptic([40, 60]);
    if (soundEnabled) playPingChime();
    sendPing(targetUid, currentUserId);
  };

  const handleToggleSaveMemory = (checkinId: string) => {
    toggleMemorySaved(checkinId);
    setGroup(getStoredGroup());
    triggerHaptic(30);
  };

  const handleSwitchUser = (uid: string) => {
    setActiveUserId(uid);
    setCurrentUserId(uid);
    triggerHaptic(30);
  };

  const handleCreateGroup = (groupName: string, userName: string, role: MemberRole) => {
    const newGroup = createNewFamilyGroup(groupName, userName, role);
    setGroup(newGroup);
    setCurrentUserId(newGroup.adminUid);
    setIsLoggedIn(true);
    saveIsLoggedIn(true);
  };

  const handleJoinGroup = (code: string, userName: string, role: MemberRole) => {
    const res = joinExistingFamilyGroup(code, userName, role);
    if (res.success && res.group) {
      setGroup(res.group);
      setCurrentUserId(getActiveUserId());
      setIsLoggedIn(true);
      saveIsLoggedIn(true);
    }
    return res;
  };

  const handleResetDemo = () => {
    const pristine = resetDemoData();
    setGroup(pristine);
    setCurrentUserId('senior-mom');
    setIsLoggedIn(true);
    saveIsLoggedIn(true);
  };

  const handleResolveEmergency = (memberUid: string) => {
    const updated = { ...group };
    if (updated.members[memberUid]) {
      updated.members[memberUid].status = 'CHECKED_IN';
      updated.members[memberUid].lastCheckInAt = Date.now();
      saveGroup(updated);
      setGroup(updated);
      triggerHaptic(40);
    }
  };

  // Render 1: Startup Splash Screen
  if (showStartup) {
    return (
      <div className={`min-h-screen ${currentFontObj.className} ${currentScaleObj.scaleClass}`}>
        <StartupScreen
          modeStyles={modeStyles}
          themeConfig={themeConfig}
          onContinue={handleDismissStartup}
        />
      </div>
    );
  }

  // Render 2: Login Screen
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${currentFontObj.className} ${currentScaleObj.scaleClass}`}>
        <LoginScreen
          group={group}
          modeStyles={modeStyles}
          themeConfig={themeConfig}
          onLoginAsMember={handleLoginAsMember}
          onLoginWithPin={handleLoginWithPin}
          onOpenCreateCircle={() => setIsOnboardingOpen(true)}
          onViewStartup={() => setShowStartup(true)}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onCreateGroup={handleCreateGroup}
          onJoinGroup={handleJoinGroup}
        />
      </div>
    );
  }

  // Render 3: Full Authenticated Application
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        currentFontObj.className
      } ${currentScaleObj.scaleClass} ${modeStyles.bgCanvas}`}
    >
      {/* Toast notifications */}
      <NotificationToast
        notification={notification}
        onDismiss={() => setNotification(null)}
      />

      {/* Main App Canvas Container */}
      <div
        className={`w-full max-w-md mx-auto flex-1 flex flex-col shadow-2xl min-h-screen border-x transition-colors duration-200 ${modeStyles.bgSurface} ${modeStyles.border}`}
      >
        {/* Header */}
        <Header
          group={group}
          activeMember={activeMember}
          modeStyles={modeStyles}
          themeConfig={themeConfig}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          subscription={subscription}
          onOpenCarePlus={() => setIsCarePlusOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMemories={() => setIsMemoriesOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onSwitchUser={handleSwitchUser}
          onSignOut={handleSignOut}
          onSelectCirclePreset={handleSelectCirclePreset}
          savedMemoriesCount={savedMemories.length}
        />

        {/* Global Emergency Banner if any family member is in NOT_OKAY state */}
        {emergencyMembers.length > 0 && (
          <div className="bg-red-600 text-white px-4 py-3 shadow-lg flex items-center justify-between gap-3 animate-pulse border-b border-red-400">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-5 h-5 shrink-0 fill-white text-red-600" />
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-wider">
                  ⚠️ Emergency Alert Active
                </div>
                <div className="text-xs truncate font-bold">
                  {emergencyMembers.map((m) => m.displayName).join(', ')} reported NOT OKAY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {emergencyMembers[0].phone && (
                <a
                  href={`tel:${emergencyMembers[0].phone}`}
                  className="px-2.5 py-1 rounded-lg bg-white text-red-700 font-extrabold text-xs shadow flex items-center gap-1 hover:bg-red-50 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}
              <button
                onClick={() => handleResolveEmergency(emergencyMembers[0].uid)}
                className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow border border-red-400/50"
                title="Mark safe after assisting"
              >
                Resolve
              </button>
            </div>
          </div>
        )}

        {/* Main Feed Section (Scrollable) */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-2">
          <FamilyFeed
            members={membersList}
            checkins={group.checkins}
            currentUserId={currentUserId}
            modeStyles={modeStyles}
            themeConfig={themeConfig}
            onPing={handlePing}
            onRequestLocation={handleRequestLocation}
            onViewLocation={handleViewLocation}
            onToggleSaveMemory={handleToggleSaveMemory}
          />
        </main>

        {/* Bottom Section: Hero Gesture Action Button */}
        <footer
          className={`sticky bottom-0 z-20 backdrop-blur-md pt-2 px-4 border-t transition-colors duration-200 bg-gradient-to-t ${modeStyles.footerBg}`}
        >
          <HeroActionButton
            onCheckIn={handleCheckIn}
            currentUserStatus={activeMember?.status || 'CHECKED_IN'}
            modeStyles={modeStyles}
            themeConfig={themeConfig}
          />
        </footer>
      </div>

      {/* Modals */}
      {activeMember && (
        <ProfileAvatarModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          member={activeMember}
          circleType={group.groupType || 'family'}
          modeStyles={modeStyles}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {selectedLocationMember && (
        <LocationViewModal
          isOpen={isLocationModalOpen}
          onClose={() => {
            setIsLocationModalOpen(false);
            setSelectedLocationMember(null);
            setSelectedLocationData(undefined);
          }}
          member={selectedLocationMember}
          location={selectedLocationData}
          modeStyles={modeStyles}
          onRequestLocation={() => handleRequestLocation(selectedLocationMember.uid)}
          isCurrentUser={selectedLocationMember.uid === currentUserId}
        />
      )}

      <MemoriesModal
        isOpen={isMemoriesOpen}
        onClose={() => setIsMemoriesOpen(false)}
        savedCheckins={savedMemories}
        onToggleSave={handleToggleSaveMemory}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCreateGroup={handleCreateGroup}
        onJoinGroup={handleJoinGroup}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        group={group}
        activeMember={activeMember}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        font={font}
        onSelectFont={handleSelectFont}
        textScale={textScale}
        onSelectTextScale={handleSelectTextScale}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        subscription={subscription}
        onOpenCarePlus={() => setIsCarePlusOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onSwitchUser={handleSwitchUser}
        onOpenFlutterCode={() => setIsFlutterCodeOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenStartup={() => setShowStartup(true)}
        onSignOut={handleSignOut}
        onResetDemo={handleResetDemo}
        modeStyles={modeStyles}
      />

      <CarePlusModal
        isOpen={isCarePlusOpen}
        onClose={() => setIsCarePlusOpen(false)}
        subscription={subscription}
        onUpdateSubscription={handleUpdateSubscription}
        modeStyles={modeStyles}
      />

      <FlutterCodeModal
        isOpen={isFlutterCodeOpen}
        onClose={() => setIsFlutterCodeOpen(false)}
      />
    </div>
  );
}
