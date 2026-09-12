import { FamilyGroup, Member, CheckIn, PushNotificationEvent, LocationData, CircleType, MemberRole } from '../types';
import { PRESET_AVATARS, generateInitialsAvatar } from './avatarService';

const STORAGE_KEY = 'aokay_family_group';
const USER_KEY = 'aokay_active_user_id';
const NOTIFICATIONS_KEY = 'aokay_notifications';

export const INITIAL_GROUP_ID = 'OK-4829';

// Default initial state matching Miller Family
export const DEFAULT_FAMILY_GROUP: FamilyGroup = {
  groupId: INITIAL_GROUP_ID,
  groupName: 'The Miller Family',
  pinCode: '4829',
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
  adminUid: 'caregiver-sarah',
  groupType: 'family',
  categoryLabel: 'Family Circle',
  escalationTime: '10:00 AM',
  members: {
    'senior-mom': {
      uid: 'senior-mom',
      displayName: 'Mom (Eleanor)',
      role: 'SENIOR',
      customTitle: 'Mother',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 42, // 42 mins ago
      pushToken: 'token-mom-fcm-1',
      relationship: 'Mother',
      phone: '+1 (555) 234-5678',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'family-mom')?.dataUrl,
      location: {
        latitude: 37.3861,
        longitude: -122.0839,
        label: 'Home Garden Patio',
        altitude: 32,
        accuracy: 5,
        updatedAt: Date.now() - 1000 * 60 * 42,
      },
    },
    'senior-joe': {
      uid: 'senior-joe',
      displayName: 'Grandpa Joe',
      role: 'SENIOR',
      customTitle: 'Father',
      status: 'PENDING',
      lastCheckInAt: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
      pushToken: 'token-joe-fcm-2',
      relationship: 'Father',
      phone: '+1 (555) 456-7890',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'family-grandpa')?.dataUrl,
      location: {
        latitude: 37.3688,
        longitude: -122.0363,
        label: 'Sunnyvale Senior Community Center',
        altitude: 38,
        accuracy: 10,
        updatedAt: Date.now() - 1000 * 60 * 60 * 18,
      },
    },
    'caregiver-sarah': {
      uid: 'caregiver-sarah',
      displayName: 'Sarah Miller',
      role: 'CAREGIVER',
      customTitle: 'Daughter & Nurse',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 120,
      pushToken: 'token-sarah-fcm-3',
      relationship: 'Daughter',
      phone: '+1 (555) 890-1234',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'family-heart')?.dataUrl,
      location: {
        latitude: 37.422,
        longitude: -122.084,
        label: 'Valley Health Clinic',
        altitude: 24,
        accuracy: 8,
        updatedAt: Date.now() - 1000 * 60 * 120,
      },
    },
    'caregiver-david': {
      uid: 'caregiver-david',
      displayName: 'David Miller',
      role: 'CAREGIVER',
      customTitle: 'Son',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 300,
      pushToken: 'token-david-fcm-4',
      relationship: 'Son',
      phone: '+1 (555) 345-6789',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'companion-coffee')?.dataUrl,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        label: 'San Francisco Office',
        altitude: 16,
        accuracy: 12,
        updatedAt: Date.now() - 1000 * 60 * 300,
      },
    },
  },
  checkins: [
    {
      id: 'checkin-1',
      authorUid: 'senior-mom',
      authorName: 'Mom (Eleanor)',
      type: 'AOKAY',
      timestamp: Date.now() - 1000 * 60 * 42,
      audioUrl: null,
      audioDurationSec: 14,
      isSaved: true,
      emergencyNote: 'Good morning my loves! Having morning tea on the patio with sunny skies. Feeling great today.',
      location: {
        latitude: 37.3861,
        longitude: -122.0839,
        label: 'Home Garden Patio',
        altitude: 32,
        accuracy: 5,
        updatedAt: Date.now() - 1000 * 60 * 42,
      },
    },
    {
      id: 'checkin-2',
      authorUid: 'caregiver-sarah',
      authorName: 'Sarah Miller',
      type: 'AOKAY',
      timestamp: Date.now() - 1000 * 60 * 120,
      audioUrl: null,
      audioDurationSec: 8,
      isSaved: false,
      emergencyNote: 'Checked in before my morning clinic rounds. Love you Mom!',
    },
  ],
};

// Preset 2: Hiking & Trail Crew
export const HIKING_CREW_GROUP: FamilyGroup = {
  groupId: 'HIKE-7721',
  groupName: 'Pacific Crest Trail Crew',
  pinCode: '7721',
  createdAt: Date.now() - 1000 * 60 * 60 * 48,
  adminUid: 'hiker-maya',
  groupType: 'hiking',
  categoryLabel: 'Hiking & Trail Crew',
  members: {
    'hiker-maya': {
      uid: 'hiker-maya',
      displayName: 'Maya (Trail Lead)',
      role: 'LEADER',
      customTitle: 'Lead Guide & First Aid',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 25,
      pushToken: 'token-maya-1',
      relationship: 'Guide',
      phone: '+1 (555) 789-0123',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'hiker-mountain')?.dataUrl,
      location: {
        latitude: 38.8872,
        longitude: -120.0435,
        label: 'Desolation Ridge (Elev. 7,420ft)',
        altitude: 2261,
        accuracy: 6,
        updatedAt: Date.now() - 1000 * 60 * 25,
      },
    },
    'hiker-alex': {
      uid: 'hiker-alex',
      displayName: 'Alex Rivers',
      role: 'MEMBER',
      customTitle: 'Backpacker & Navigator',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 50,
      pushToken: 'token-alex-2',
      relationship: 'Friend',
      phone: '+1 (555) 890-2345',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'hiker-backpack')?.dataUrl,
      location: {
        latitude: 38.8941,
        longitude: -120.052,
        label: 'Eagle Falls Bridge (Elev. 6,800ft)',
        altitude: 2072,
        accuracy: 8,
        updatedAt: Date.now() - 1000 * 60 * 50,
      },
    },
    'hiker-sam': {
      uid: 'hiker-sam',
      displayName: 'Sam Chen',
      role: 'MEMBER',
      customTitle: 'Camp Master',
      status: 'PENDING',
      lastCheckInAt: Date.now() - 1000 * 60 * 60 * 3,
      pushToken: 'token-sam-3',
      relationship: 'Friend',
      phone: '+1 (555) 901-3456',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'outdoor-camp')?.dataUrl,
      location: {
        latitude: 38.8315,
        longitude: -120.0219,
        label: 'Echo Lake Basecamp',
        altitude: 2260,
        accuracy: 10,
        updatedAt: Date.now() - 1000 * 60 * 60 * 3,
      },
    },
    'hiker-chris': {
      uid: 'hiker-chris',
      displayName: 'Chris & Scout 🐕',
      role: 'MEMBER',
      customTitle: 'Trail Sweeper',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 95,
      pushToken: 'token-chris-4',
      relationship: 'Friend',
      phone: '+1 (555) 012-4567',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'companion-dog')?.dataUrl,
      location: {
        latitude: 38.8712,
        longitude: -120.0381,
        label: 'Granite Lake Pass',
        altitude: 2310,
        accuracy: 15,
        updatedAt: Date.now() - 1000 * 60 * 95,
      },
    },
  },
  checkins: [
    {
      id: 'chk-hike-1',
      authorUid: 'hiker-maya',
      authorName: 'Maya (Trail Lead)',
      type: 'AOKAY',
      timestamp: Date.now() - 1000 * 60 * 25,
      audioUrl: null,
      audioDurationSec: 18,
      isSaved: true,
      emergencyNote: 'Reached Desolation Ridge safely! Wind is mild, sun is shining, gorgeous 360 views.',
      location: {
        latitude: 38.8872,
        longitude: -120.0435,
        label: 'Desolation Ridge (Elev. 7,420ft)',
        altitude: 2261,
        accuracy: 6,
        updatedAt: Date.now() - 1000 * 60 * 25,
      },
    },
  ],
};

// Preset 3: Travel & Road Trip Group
export const TRAVEL_TRIP_GROUP: FamilyGroup = {
  groupId: 'TRIP-3904',
  groupName: 'Tokyo Trip Crew 2026',
  pinCode: '3904',
  createdAt: Date.now() - 1000 * 60 * 60 * 72,
  adminUid: 'traveler-leo',
  groupType: 'trip',
  categoryLabel: 'Travel & Road Trip',
  members: {
    'traveler-leo': {
      uid: 'traveler-leo',
      displayName: 'Leo V.',
      role: 'LEADER',
      customTitle: 'Trip Planner',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 15,
      pushToken: 'token-leo-1',
      relationship: 'Friend',
      phone: '+1 (555) 123-9876',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'trip-plane')?.dataUrl,
      location: {
        latitude: 35.6895,
        longitude: 139.6917,
        label: 'Shinjuku South Gate Cafe',
        altitude: 42,
        accuracy: 8,
        updatedAt: Date.now() - 1000 * 60 * 15,
      },
    },
    'traveler-nina': {
      uid: 'traveler-nina',
      displayName: 'Nina Brooks',
      role: 'MEMBER',
      customTitle: 'Photographer',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 40,
      pushToken: 'token-nina-2',
      relationship: 'Friend',
      phone: '+1 (555) 234-8765',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'trip-camera')?.dataUrl,
      location: {
        latitude: 35.6719,
        longitude: 139.703,
        label: 'Meiji Jingu Shrine Garden',
        altitude: 28,
        accuracy: 10,
        updatedAt: Date.now() - 1000 * 60 * 40,
      },
    },
    'traveler-ken': {
      uid: 'traveler-ken',
      displayName: 'Ken Takahashi',
      role: 'MEMBER',
      customTitle: 'Local Foodie Guide',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now() - 1000 * 60 * 75,
      pushToken: 'token-ken-3',
      relationship: 'Friend',
      phone: '+1 (555) 345-7654',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'trip-sunglasses')?.dataUrl,
      location: {
        latitude: 35.6595,
        longitude: 139.7005,
        label: 'Shibuya Ramen Alley',
        altitude: 18,
        accuracy: 5,
        updatedAt: Date.now() - 1000 * 60 * 75,
      },
    },
    'traveler-chloe': {
      uid: 'traveler-chloe',
      displayName: 'Chloe Martin',
      role: 'MEMBER',
      customTitle: 'Navigator',
      status: 'PENDING',
      lastCheckInAt: Date.now() - 1000 * 60 * 60 * 2,
      pushToken: 'token-chloe-4',
      relationship: 'Friend',
      phone: '+1 (555) 456-6543',
      avatarUrl: PRESET_AVATARS.find((a) => a.id === 'trail-compass')?.dataUrl,
    },
  },
  checkins: [],
};

export const DEFAULT_GROUP = DEFAULT_FAMILY_GROUP;

export const CIRCLE_PRESETS = [
  {
    id: 'family',
    name: 'The Miller Family',
    type: 'family' as CircleType,
    icon: '🏡',
    description: 'Senior home safety & multi-generational check-in',
    groupData: DEFAULT_FAMILY_GROUP,
  },
  {
    id: 'hiking',
    name: 'Pacific Crest Trail Crew',
    type: 'hiking' as CircleType,
    icon: '🏔️',
    description: 'Trail safety, mountain elevations & altitude tracking',
    groupData: HIKING_CREW_GROUP,
  },
  {
    id: 'trip',
    name: 'Tokyo Trip Crew 2026',
    type: 'trip' as CircleType,
    icon: '✈️',
    description: 'Friends traveling together with city landmarks & meetups',
    groupData: TRAVEL_TRIP_GROUP,
  },
];

export function getStoredGroup(): FamilyGroup {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure avatars exist if null
      let updated = false;
      Object.keys(parsed.members || {}).forEach((uid) => {
        if (!parsed.members[uid].avatarUrl) {
          parsed.members[uid].avatarUrl = generateInitialsAvatar(parsed.members[uid].displayName);
          updated = true;
        }
      });
      if (updated) {
        saveGroup(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored group', e);
  }
  saveGroup(DEFAULT_GROUP);
  return DEFAULT_GROUP;
}

export function saveGroup(group: FamilyGroup): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
    // Dispatch custom event for real-time reactive sync across components
    window.dispatchEvent(new CustomEvent('aokay_data_updated', { detail: group }));
  } catch (e) {
    console.error('Failed to save group', e);
  }
}

export function getActiveUserId(): string {
  try {
    const stored = localStorage.getItem(USER_KEY);
    const group = getStoredGroup();
    if (stored && group.members[stored]) return stored;
    // Otherwise fallback to first member
    const firstUid = Object.keys(group.members)[0];
    if (firstUid) return firstUid;
  } catch (e) {
    // ignore
  }
  return 'senior-mom';
}

export function setActiveUserId(uid: string): void {
  try {
    localStorage.setItem(USER_KEY, uid);
    window.dispatchEvent(new CustomEvent('aokay_user_switched', { detail: uid }));
  } catch (e) {
    // ignore
  }
}

export function switchCirclePreset(presetId: 'family' | 'hiking' | 'trip'): FamilyGroup {
  const match = CIRCLE_PRESETS.find((p) => p.id === presetId);
  const targetGroup = match ? match.groupData : DEFAULT_FAMILY_GROUP;
  saveGroup(targetGroup);
  const firstUid = Object.keys(targetGroup.members)[0];
  setActiveUserId(firstUid);
  return targetGroup;
}

export function updateGroupEscalationTime(escalationTime: string): void {
  const group = getStoredGroup();
  group.escalationTime = escalationTime;
  saveGroup(group);
  window.dispatchEvent(new CustomEvent('aokay_group_updated', { detail: group }));
}

export function updateMemberProfile(uid: string, updates: Partial<Member>): void {
  const group = getStoredGroup();
  if (group.members[uid]) {
    group.members[uid] = {
      ...group.members[uid],
      ...updates,
    };
    saveGroup(group);
  }
}

export function updateMemberAvatar(uid: string, avatarUrl: string): void {
  updateMemberProfile(uid, { avatarUrl });
}

export function updateMemberLocation(uid: string, location: LocationData): void {
  const group = getStoredGroup();
  const member = group.members[uid];
  if (member) {
    member.location = location;
    saveGroup(group);

    // Broadcast location share notification
    broadcastNotification({
      id: `notif_loc_${Date.now()}`,
      title: `📍 Location Shared`,
      body: `${member.displayName} shared location: ${location.label || 'Current GPS'}`,
      timestamp: Date.now(),
      senderName: member.displayName,
      type: 'LOCATION_SHARE',
    });
  }
}

export function requestMemberLocation(requesterUid: string, targetUid: string): void {
  const group = getStoredGroup();
  const requester = group.members[requesterUid];
  const target = group.members[targetUid];

  if (target) {
    target.lastLocationRequestedAt = Date.now();
    saveGroup(group);

    const requesterName = requester?.displayName || 'A circle member';
    broadcastNotification({
      id: `notif_req_${Date.now()}`,
      title: `📍 Location Requested`,
      body: `${requesterName} requested your current location on the map`,
      timestamp: Date.now(),
      senderName: requesterName,
      type: 'LOCATION_REQUEST',
    });
  }
}

export function performCheckIn(
  authorUid: string,
  type: 'AOKAY' | 'NOT_OKAY',
  audioUrl?: string | null,
  audioDurationSec?: number | null,
  emergencyNote?: string,
  location?: LocationData
): CheckIn {
  const group = getStoredGroup();
  const member = group.members[authorUid];
  const now = Date.now();

  const newCheckIn: CheckIn = {
    id: `chk_${now}_${Math.random().toString(36).substring(2, 7)}`,
    authorUid,
    authorName: member ? member.displayName : 'Circle Member',
    type,
    timestamp: now,
    audioUrl: audioUrl || null,
    audioDurationSec: audioDurationSec || null,
    isSaved: false,
    emergencyNote: emergencyNote || (type === 'NOT_OKAY' ? '⚠️ Sent emergency alert' : undefined),
    location: location || member?.location,
  };

  // Update member status and optional location
  if (member) {
    member.status = type === 'AOKAY' ? 'CHECKED_IN' : 'NOT_OKAY';
    member.lastCheckInAt = now;
    if (location) {
      member.location = location;
    }
  }

  // Prepend check-in to history
  group.checkins.unshift(newCheckIn);
  saveGroup(group);

  // Trigger push notification event
  const isEmergency = type === 'NOT_OKAY';
  const authorName = member ? member.displayName : 'Circle Member';
  broadcastNotification({
    id: `notif_${now}`,
    title: isEmergency
      ? `🚨 EMERGENCY: ${authorName} needs help!`
      : `✓ ${authorName} is Aokay!`,
    body: isEmergency
      ? emergencyNote || `${authorName} triggered emergency alert.`
      : audioDurationSec
      ? `Checked in with a ${audioDurationSec}s voice message: "${emergencyNote || 'All is well!'}"`
      : `Checked in and confirmed safe.`,
    timestamp: now,
    senderName: authorName,
    type: isEmergency ? 'EMERGENCY' : 'CHECKIN',
  });

  return newCheckIn;
}

export function toggleMemorySaved(checkinId: string): boolean {
  const group = getStoredGroup();
  const checkin = group.checkins.find((c) => c.id === checkinId);
  if (checkin) {
    checkin.isSaved = !checkin.isSaved;
    saveGroup(group);
    return checkin.isSaved;
  }
  return false;
}

export function sendPing(targetUid: string, senderUid: string): PushNotificationEvent {
  const group = getStoredGroup();
  const target = group.members[targetUid];
  const sender = group.members[senderUid];
  const now = Date.now();

  const event: PushNotificationEvent = {
    id: `ping_${now}`,
    title: `🔔 Gentle Ping from ${sender?.displayName || 'Family'}`,
    body: `Hi ${target?.displayName || 'there'}, are you Aokay? Just checking in on you! ❤️`,
    timestamp: now,
    senderName: sender?.displayName || 'Family Member',
    type: 'PING',
  };

  broadcastNotification(event);
  return event;
}

export function broadcastNotification(event: PushNotificationEvent): void {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    const list: PushNotificationEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(event);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new CustomEvent('aokay_notification_received', { detail: event }));
  } catch (e) {
    console.error('Failed to broadcast notification', e);
  }
}

export function createNewFamilyGroup(
  groupName: string,
  adminName: string,
  role: MemberRole = 'LEADER',
  groupType: CircleType = 'friends'
): FamilyGroup {
  const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
  const prefix = groupType === 'hiking' ? 'HIKE' : groupType === 'trip' ? 'TRIP' : 'OK';
  const groupId = `${prefix}-${randomPin}`;
  const adminUid = `user-${Date.now().toString(36)}`;
  const cleanName = adminName.trim() || 'Circle Organizer';

  const categoryLabelMap: Record<CircleType, string> = {
    family: 'Family Circle',
    hiking: 'Hiking Crew',
    trip: 'Travel & Trip Group',
    friends: 'Friend Group',
    general: 'Safety Circle',
  };

  const newGroup: FamilyGroup = {
    groupId,
    groupName: groupName.trim() || 'Our Circle',
    pinCode: randomPin,
    createdAt: Date.now(),
    adminUid,
    groupType,
    categoryLabel: categoryLabelMap[groupType] || 'Safety Circle',
    members: {
      [adminUid]: {
        uid: adminUid,
        displayName: cleanName,
        role,
        customTitle: role === 'LEADER' ? 'Organizer' : role === 'SENIOR' ? 'Senior' : 'Member',
        status: 'CHECKED_IN',
        lastCheckInAt: Date.now(),
        pushToken: `token-${adminUid}`,
        relationship: 'Admin',
        avatarUrl: generateInitialsAvatar(cleanName),
      },
    },
    checkins: [],
  };

  saveGroup(newGroup);
  setActiveUserId(adminUid);
  return newGroup;
}

export function joinExistingFamilyGroup(
  pinOrId: string,
  userName: string,
  role: MemberRole = 'MEMBER'
): { success: boolean; group?: FamilyGroup; error?: string } {
  const cleanCode = pinOrId.trim().toUpperCase().replace('#', '');
  const group = getStoredGroup();

  // If joining current group code or PIN
  if (
    group.groupId.toUpperCase() === cleanCode ||
    group.pinCode === cleanCode ||
    `OK-${group.pinCode}` === cleanCode ||
    cleanCode.length >= 4
  ) {
    const newUid = `user-${Date.now().toString(36)}`;
    const cleanName = userName.trim() || 'Circle Member';
    group.members[newUid] = {
      uid: newUid,
      displayName: cleanName,
      role,
      customTitle: role === 'SENIOR' ? 'Senior' : 'Circle Member',
      status: 'CHECKED_IN',
      lastCheckInAt: Date.now(),
      pushToken: `token-${newUid}`,
      relationship: 'Friend',
      avatarUrl: generateInitialsAvatar(cleanName),
    };
    saveGroup(group);
    setActiveUserId(newUid);
    return { success: true, group };
  }

  return {
    success: false,
    error: 'Group code not found. Please verify the 4-digit PIN or code (e.g. OK-4829 or HIKE-7721).',
  };
}

export function resetDemoData(): FamilyGroup {
  saveGroup(DEFAULT_GROUP);
  setActiveUserId('senior-mom');
  return DEFAULT_GROUP;
}

// User UI Preferences & Auth persistence
const THEME_KEY = 'aokay_theme';
const FONT_KEY = 'aokay_font';
const SCALE_KEY = 'aokay_text_scale';
const DARK_MODE_KEY = 'aokay_dark_mode';
const LOGIN_KEY = 'aokay_is_logged_in';
const STARTUP_KEY = 'aokay_has_seen_startup';
const SUBSCRIPTION_KEY = 'aokay_subscription';

export function getStoredTheme(): import('../types').AppTheme {
  const t = localStorage.getItem(THEME_KEY);
  if (t === 'midnight' || t === 'floral' || t === 'mech' || t === 'linen') return t;
  return 'midnight'; // Default to classic sleek Midnight Slate
}

export function saveStoredTheme(theme: import('../types').AppTheme): void {
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent('aokay_pref_updated', { detail: { theme } }));
}

export function getStoredFont(): import('../types').AppFont {
  const f = localStorage.getItem(FONT_KEY);
  if (f === 'lexend' || f === 'jakarta' || f === 'outfit') return f;
  return 'lexend'; // Lexend is scientifically designed for senior legibility!
}

export function saveStoredFont(font: import('../types').AppFont): void {
  localStorage.setItem(FONT_KEY, font);
  window.dispatchEvent(new CustomEvent('aokay_pref_updated', { detail: { font } }));
}

export function getStoredTextScale(): import('../types').TextScale {
  const s = localStorage.getItem(SCALE_KEY);
  if (s === 'normal' || s === 'large' || s === 'extra-large') return s;
  return 'normal';
}

export function saveStoredTextScale(scale: import('../types').TextScale): void {
  localStorage.setItem(SCALE_KEY, scale);
  window.dispatchEvent(new CustomEvent('aokay_pref_updated', { detail: { textScale: scale } }));
}

export function getStoredDarkMode(): boolean {
  const val = localStorage.getItem(DARK_MODE_KEY);
  if (val === null) return true; // Default to dark mode for comfortable soothing evening contrast
  return val === 'true';
}

export function saveStoredDarkMode(val: boolean): void {
  localStorage.setItem(DARK_MODE_KEY, val ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('aokay_pref_updated', { detail: { darkMode: val } }));
}

export function getStoredSubscription(): import('../types').SubscriptionPlan {
  const s = localStorage.getItem(SUBSCRIPTION_KEY);
  if (s) {
    try {
      return JSON.parse(s);
    } catch {
      // fallback
    }
  }
  return {
    tier: 'FREE',
    billingInterval: 'annual',
    isActive: false,
    trialDaysRemaining: 14,
  };
}

export function saveStoredSubscription(plan: import('../types').SubscriptionPlan): void {
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(plan));
  window.dispatchEvent(new CustomEvent('aokay_pref_updated', { detail: { subscription: plan } }));
}


export function getIsLoggedIn(): boolean {
  const val = localStorage.getItem(LOGIN_KEY);
  // Default to true so users immediately see their active family circle, but can log out anytime!
  return val === null ? true : val === 'true';
}

export function saveIsLoggedIn(val: boolean): void {
  localStorage.setItem(LOGIN_KEY, val ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('aokay_auth_changed', { detail: val }));
}

export function getHasSeenStartup(): boolean {
  return localStorage.getItem(STARTUP_KEY) === 'true';
}

export function saveHasSeenStartup(val: boolean): void {
  localStorage.setItem(STARTUP_KEY, val ? 'true' : 'false');
}

