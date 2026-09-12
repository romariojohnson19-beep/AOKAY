export type MemberRole = 'SENIOR' | 'CAREGIVER' | 'MEMBER' | 'LEADER';
export type MemberStatus = 'CHECKED_IN' | 'PENDING' | 'NOT_OKAY';
export type CheckInType = 'AOKAY' | 'NOT_OKAY';

export type CircleType = 'family' | 'hiking' | 'trip' | 'friends' | 'general';

export interface LocationData {
  latitude: number;
  longitude: number;
  label?: string;
  altitude?: number;
  accuracy?: number;
  updatedAt: number;
}

export interface Member {
  uid: string;
  displayName: string;
  role: MemberRole | string;
  customTitle?: string;
  status: MemberStatus;
  lastCheckInAt: number; // timestamp in ms
  pushToken?: string;
  avatarUrl?: string;
  phone?: string;
  relationship?: string;
  location?: LocationData;
  lastLocationRequestedAt?: number;
}

export interface CheckIn {
  id: string;
  authorUid: string;
  authorName: string;
  type: CheckInType;
  timestamp: number;
  audioUrl?: string | null;
  audioDurationSec?: number | null;
  isSaved?: boolean;
  emergencyNote?: string;
  location?: LocationData;
}

export interface FamilyGroup {
  groupId: string; // e.g. "OK-4829"
  groupName: string; // e.g. "Pacific Crest Hiking Crew" or "The Miller Family"
  pinCode: string; // e.g. "4829"
  createdAt: number;
  adminUid: string;
  groupType?: CircleType;
  categoryLabel?: string;
  escalationTime?: string; // e.g. "10:00 AM" or custom "08:30 AM"
  members: Record<string, Member>;
  checkins: CheckIn[];
}

export interface PushNotificationEvent {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  senderName: string;
  type: 'PING' | 'CHECKIN' | 'EMERGENCY' | 'LOCATION_REQUEST' | 'LOCATION_SHARE';
}

export type AppTheme = 'midnight' | 'floral' | 'mech' | 'linen';
export type AppFont = 'lexend' | 'jakarta' | 'outfit';
export type TextScale = 'normal' | 'large' | 'extra-large';

export type SubscriptionTier = 'FREE' | 'CARE_PLUS';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  billingInterval: 'monthly' | 'annual';
  isActive: boolean;
  expiresAt?: number;
  trialDaysRemaining?: number;
}

export interface UserPreferences {
  theme: AppTheme;
  darkMode: boolean;
  font: AppFont;
  textScale: TextScale;
  soundEnabled: boolean;
  hasSeenStartup: boolean;
  subscription: SubscriptionPlan;
}


