export type Priority = 'high' | 'medium' | 'low';

export type GiftStatus = 'drawn' | 'purchased' | 'sent' | 'cancelled';

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  email: string;
  phone: string;
  searchEnabled: boolean;
  wishlistPaused: boolean;
  deactivatedAt: string | null; // null if active, ISO date if deactivated
  birthday?: string; // 选填生日 (YYYY-MM-DD 或 MM-DD，仅供送礼提醒)
  giftReminderDays?: number; // 默认提前几天弹窗提醒准备礼物，默认 5 天
}

export interface Binding {
  id: string;
  requesterId: string;
  targetId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string; // 7 days from creation
  retainHistory: {
    [userId: string]: boolean;
  };
}

export interface Wish {
  id: string;
  userId: string; // Owner ID
  title: string;
  images: string[];
  url?: string;
  price?: number;
  quantity: number;
  specs?: string;
  category: string;
  priority: Priority;
  budgetNote?: string;
  note?: string;
  deadline?: string;
  order: number;
  createdAt: string;
  // Specific individual/group permissions. If empty, visible to all accepted bindings.
  allowedUserIds?: string[];
}

export interface SharePage {
  id: string;
  userId: string;
  title: string;
  description?: string;
  wishIds: string[];
  authorizedUserIds: string[];
  isActive: boolean;
  shareCode: string;
  createdAt: string;
}

export interface GiftRecord {
  id: string;
  wishId: string;
  giverId: string; // The user who drew this wish
  receiverId: string; // The wishlist owner
  status: GiftStatus;
  drawnAt: string;
  purchasedAt?: string;
  sentAt?: string;
  cancelledAt?: string;
  purchaseNote?: string;
  giftWishSnapshot: Wish;
}

export interface AvoidItem {
  id: string;
  userId: string;
  category: string;
  content: string;
  reason?: string;
  allowedUserIds: string[]; // Who can see this avoid item
  updatedAt: string;
}

export type NotificationType =
  | 'binding_invite'
  | 'binding_accepted'
  | 'binding_rejected'
  | 'binding_unbound'
  | 'gift_sent'
  | 'wish_deleted'
  | 'permission_change'
  | 'account_alert'
  | 'avoid_list_updated';

export interface AppNotification {
  id: string;
  userId: string; // Receiver of notification
  senderId?: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedBindingId?: string;
  relatedWishId?: string;
  relatedGiftRecordId?: string;
  read: boolean;
  createdAt: string;
}

export interface GiftHistoryItem {
  id: string;
  giftRecordId: string;
  giverId: string;
  receiverId: string;
  giverNickname: string;
  receiverNickname: string;
  wishTitle: string;
  wishImage?: string;
  wishSpecs?: string;
  price?: number;
  sentAt: string;
  purchaseNote?: string;
}

export type AnniversaryType = 'love_anniversary' | 'birthday' | 'holiday' | 'custom';

export interface Anniversary {
  id: string;
  userId: string;
  title: string;
  type: AnniversaryType;
  date: string; // YYYY-MM-DD
  isRepeatYearly: boolean;
  remindDaysAhead: number; // e.g. 7, 15, 30
  targetPerson?: string; // 'partner' | 'me' | 'both'
  notes?: string;
  createdAt: string;
}

export interface UpcomingAnniversary extends Anniversary {
  nextDate: string; // YYYY-MM-DD of the upcoming occurrence
  daysRemaining: number; // 0 for today, > 0 for future
  daysElapsed?: number; // total days since origin for love_anniversary
}
