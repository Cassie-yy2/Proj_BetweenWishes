import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Binding,
  Wish,
  GiftRecord,
  AvoidItem,
  AppNotification,
  SharePage,
  GiftHistoryItem,
  Anniversary,
  UpcomingAnniversary,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BINDINGS,
  INITIAL_WISHES,
  INITIAL_GIFT_RECORDS,
  INITIAL_AVOID_LISTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SHARE_PAGES,
  INITIAL_ANNIVERSARIES,
} from '../data/mockData';
import { calculateUpcomingAnniversary, BUILTIN_COUPLE_HOLIDAYS } from '../utils/anniversaryUtils';
import { avatarXiaotao } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
  bindings: Binding[];
  wishes: Wish[];
  giftRecords: GiftRecord[];
  avoidLists: AvoidItem[];
  notifications: AppNotification[];
  sharePages: SharePage[];

  // User auth & login with optional birthday
  giftReminderDays: number;
  setGiftReminderDays: (days: number) => void;
  loginUser: (userId: string, updates?: { birthday?: string }) => void;
  registerOrSwitchUser: (params: { nickname: string; username: string; birthday?: string; avatar?: string }) => void;

  // Wishes
  addWish: (wish: Omit<Wish, 'id' | 'userId' | 'order' | 'createdAt'>) => Wish;
  updateWish: (wishId: string, updates: Partial<Wish>) => { success: boolean; message?: string };
  deleteWish: (wishId: string) => { wasDrawn: boolean };
  reorderWishes: (orderedIds: string[]) => void;
  togglePauseWishlist: (paused: boolean) => void;
  isWishLocked: (wishId: string, forGiverId?: string) => boolean;

  // Bindings
  sendBindingInvite: (targetIdentifier: string) => { success: boolean; message: string };
  acceptBindingInvite: (bindingId: string) => void;
  rejectBindingInvite: (bindingId: string) => void;
  unbind: (bindingId: string, retainHistory: boolean) => void;
  getBoundUsers: (userId?: string) => User[];
  getBindingBetween: (userAId: string, userBId: string) => Binding | undefined;

  // Draw & Gifting
  getEligibleWishesForDraw: (partnerId: string, maxBudget?: number) => {
    eligible: Wish[];
    reasonIfEmpty?: string;
    totalWishesCount: number;
    avoidItems: AvoidItem[];
  };
  lockWishAsDrawn: (wish: Wish, giverId: string) => GiftRecord;
  markPurchased: (recordId: string, note?: string) => void;
  markSent: (recordId: string, note?: string) => void;
  cancelGiftRecord: (recordId: string) => void;
  getActiveGiftTasks: (giverId?: string) => GiftRecord[];

  // Avoid List
  addAvoidItem: (item: Omit<AvoidItem, 'id' | 'userId' | 'updatedAt'>, notifyAllowedUsers?: boolean) => void;
  updateAvoidItem: (id: string, updates: Partial<AvoidItem>, notifyAllowedUsers?: boolean) => void;
  deleteAvoidItem: (id: string) => void;
  getUserAvoidListForViewer: (targetUserId: string, viewerId: string) => AvoidItem[];

  // Share Pages
  createSharePage: (title: string, description: string, wishIds: string[], authorizedUserIds: string[]) => SharePage;
  updateSharePage: (id: string, updates: Partial<SharePage>) => void;
  deleteSharePage: (id: string) => void;

  // Notifications
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Profile & System
  updateUserProfile: (updates: Partial<User>) => void;
  deactivateAccount: () => void;
  reactivateAccount: () => void;
  exportUserData: () => void;
  resetAllDemoData: () => void;

  // Gift History
  getSentGiftHistory: (userId?: string) => GiftHistoryItem[];
  getReceivedGiftHistory: (userId?: string) => GiftHistoryItem[];

  // Anniversaries & Milestones
  anniversaries: Anniversary[];
  addAnniversary: (item: Omit<Anniversary, 'id' | 'userId' | 'createdAt'>) => Anniversary;
  updateAnniversary: (id: string, updates: Partial<Anniversary>) => void;
  deleteAnniversary: (id: string) => void;
  getUpcomingAnniversaries: (userId?: string) => UpcomingAnniversary[];
}

const STORAGE_KEYS = {
  USERS: 'wish_between_users',
  CURRENT_USER_ID: 'wish_between_current_user_id',
  BINDINGS: 'wish_between_bindings',
  WISHES: 'wish_between_wishes',
  GIFT_RECORDS: 'wish_between_gift_records',
  AVOID_LISTS: 'wish_between_avoid_lists',
  NOTIFICATIONS: 'wish_between_notifications',
  SHARE_PAGES: 'wish_between_share_pages',
  ANNIVERSARIES: 'wish_between_anniversaries',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'u_xiaotao';
  });

  const [bindings, setBindings] = useState<Binding[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BINDINGS);
    return saved ? JSON.parse(saved) : INITIAL_BINDINGS;
  });

  const [wishes, setWishes] = useState<Wish[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHES);
    return saved ? JSON.parse(saved) : INITIAL_WISHES;
  });

  const [giftRecords, setGiftRecords] = useState<GiftRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GIFT_RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_GIFT_RECORDS;
  });

  const [avoidLists, setAvoidLists] = useState<AvoidItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AVOID_LISTS);
    return saved ? JSON.parse(saved) : INITIAL_AVOID_LISTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [sharePages, setSharePages] = useState<SharePage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHARE_PAGES);
    return saved ? JSON.parse(saved) : INITIAL_SHARE_PAGES;
  });

  const [anniversaries, setAnniversaries] = useState<Anniversary[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNIVERSARIES);
    return saved ? JSON.parse(saved) : INITIAL_ANNIVERSARIES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BINDINGS, JSON.stringify(bindings));
  }, [bindings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));
  }, [wishes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GIFT_RECORDS, JSON.stringify(giftRecords));
  }, [giftRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AVOID_LISTS, JSON.stringify(avoidLists));
  }, [avoidLists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHARE_PAGES, JSON.stringify(sharePages));
  }, [sharePages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNIVERSARIES, JSON.stringify(anniversaries));
  }, [anniversaries]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [giftReminderDays, setGiftReminderDaysState] = useState<number>(() => {
    const saved = localStorage.getItem('wish_between_gift_reminder_days');
    if (saved) return parseInt(saved, 10);
    return currentUser?.giftReminderDays || 5;
  });

  const setGiftReminderDays = (days: number) => {
    const val = Math.max(1, Math.min(365, days));
    setGiftReminderDaysState(val);
    localStorage.setItem('wish_between_gift_reminder_days', String(val));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, giftReminderDays: val } : u))
    );
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    if (target?.giftReminderDays) {
      setGiftReminderDaysState(target.giftReminderDays);
    }
  };

  const loginUser = (userId: string, updates?: { birthday?: string }) => {
    setCurrentUserId(userId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    if (updates && updates.birthday !== undefined) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, birthday: updates.birthday } : u))
      );
    }
    const target = users.find((u) => u.id === userId);
    if (target?.giftReminderDays) {
      setGiftReminderDaysState(target.giftReminderDays);
    }
  };

  const registerOrSwitchUser = (params: { nickname: string; username: string; birthday?: string; avatar?: string }) => {
    const cleanUsername = params.username.trim().toLowerCase();
    const existing = users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      loginUser(existing.id, { birthday: params.birthday });
      return;
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      username: params.username.trim(),
      nickname: params.nickname.trim(),
      avatar: params.avatar || avatarXiaotao,
      bio: '新加入心愿之间的温柔守护者 ✨',
      email: `${params.username.trim()}@wishes.me`,
      phone: '138****0000',
      searchEnabled: true,
      wishlistPaused: false,
      deactivatedAt: null,
      birthday: params.birthday?.trim() || undefined,
      giftReminderDays: 5,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    setGiftReminderDaysState(5);
  };

  // Helper to send internal notifications
  const sendNotification = (
    receiverId: string,
    type: AppNotification['type'],
    title: string,
    content: string,
    extra?: Partial<AppNotification>
  ) => {
    const newNotif: AppNotification = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: receiverId,
      senderId: currentUser.id,
      type,
      title,
      content,
      read: false,
      createdAt: new Date().toISOString(),
      ...extra,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Wishes logic
  const isWishLocked = (wishId: string, forGiverId?: string) => {
    return giftRecords.some((gr) => {
      if (gr.wishId !== wishId) return false;
      if (gr.status === 'cancelled' || gr.status === 'sent') return false;
      if (forGiverId) {
        return gr.giverId === forGiverId;
      }
      return true;
    });
  };

  const addWish = (wishData: Omit<Wish, 'id' | 'userId' | 'order' | 'createdAt'>) => {
    const userWishes = wishes.filter((w) => w.userId === currentUser.id);
    const newWish: Wish = {
      ...wishData,
      id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: currentUser.id,
      order: userWishes.length + 1,
      createdAt: new Date().toISOString(),
    };
    setWishes((prev) => [newWish, ...prev]);
    return newWish;
  };

  const updateWish = (wishId: string, updates: Partial<Wish>) => {
    const existing = wishes.find((w) => w.id === wishId);
    if (!existing) return { success: false, message: '心愿不存在' };

    // Check if drawn in an active gifting process
    const activeRecord = giftRecords.find(
      (gr) => gr.wishId === wishId && (gr.status === 'drawn' || gr.status === 'purchased')
    );

    if (activeRecord) {
      // If updating core fields (title, price, specs, url)
      const coreFieldsChanged =
        (updates.title && updates.title !== existing.title) ||
        (updates.price !== undefined && updates.price !== existing.price) ||
        (updates.specs !== undefined && updates.specs !== existing.specs) ||
        (updates.url !== undefined && updates.url !== existing.url);

      if (coreFieldsChanged) {
        return {
          success: false,
          message:
            '此心愿已被送礼者抽中并进入准备流程。根据规则，已被抽中的心愿只能修改备注或排序；如需更换商品或核心规格，请先取消原心愿再重新添加。',
        };
      }
    }

    setWishes((prev) => prev.map((w) => (w.id === wishId ? { ...w, ...updates } : w)));
    return { success: true };
  };

  const deleteWish = (wishId: string) => {
    const wishToDelete = wishes.find((w) => w.id === wishId);
    let wasDrawn = false;

    // Check active gift records
    const activeRecords = giftRecords.filter(
      (gr) => gr.wishId === wishId && (gr.status === 'drawn' || gr.status === 'purchased')
    );

    if (activeRecords.length > 0) {
      wasDrawn = true;
      // PRD 4.3 & 4.7: 用户删除已被抽中的心愿时，结束对应送礼记录并通知相关送礼者
      setGiftRecords((prev) =>
        prev.map((gr) =>
          gr.wishId === wishId && (gr.status === 'drawn' || gr.status === 'purchased')
            ? { ...gr, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : gr
        )
      );

      activeRecords.forEach((gr) => {
        sendNotification(
          gr.giverId,
          'wish_deleted',
          '送礼任务已结束',
          `你正在准备的心愿【${wishToDelete?.title || '礼物'}】已被对方从清单中移除，对应的送礼任务已自动结束。`,
          { relatedWishId: wishId }
        );
      });
    }

    setWishes((prev) => prev.filter((w) => w.id !== wishId));
    return { wasDrawn };
  };

  const reorderWishes = (orderedIds: string[]) => {
    setWishes((prev) => {
      const map = new Map(orderedIds.map((id, index) => [id, index + 1]));
      return prev.map((w) => {
        if (map.has(w.id)) {
          return { ...w, order: map.get(w.id)! };
        }
        return w;
      });
    });
  };

  const togglePauseWishlist = (paused: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, wishlistPaused: paused } : u))
    );
  };

  // Bindings logic
  const getBoundUsers = (userId: string = currentUser.id) => {
    const boundIds: string[] = [];
    bindings.forEach((b) => {
      if (b.status === 'accepted') {
        if (b.requesterId === userId) boundIds.push(b.targetId);
        else if (b.targetId === userId) boundIds.push(b.requesterId);
      }
    });
    return users.filter((u) => boundIds.includes(u.id) && !u.deactivatedAt);
  };

  const getBindingBetween = (userAId: string, userBId: string) => {
    return bindings.find(
      (b) =>
        (b.requesterId === userAId && b.targetId === userBId) ||
        (b.requesterId === userBId && b.targetId === userAId)
    );
  };

  const sendBindingInvite = (targetIdentifier: string) => {
    const clean = targetIdentifier.trim().toLowerCase();
    const target = users.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.nickname.toLowerCase() === clean ||
        u.id === clean
    );

    if (!target) {
      return { success: false, message: '未找到该用户，请检查用户名或账号' };
    }
    if (target.id === currentUser.id) {
      return { success: false, message: '不能与自己建立绑定关系' };
    }
    if (!target.searchEnabled) {
      return { success: false, message: '该用户已关闭账号搜索功能' };
    }

    const myCurrentBound = getBoundUsers(currentUser.id);
    if (myCurrentBound.length >= 1) {
      return { success: false, message: '心愿之间 V1.0 仅支持唯一情侣绑定。若需重新绑定，请先解除当前关系。' };
    }

    const targetCurrentBound = getBoundUsers(target.id);
    if (targetCurrentBound.length >= 1) {
      return { success: false, message: '对方当前已绑定了情侣对象，暂时无法接收新的绑定邀请。' };
    }

    const existing = getBindingBetween(currentUser.id, target.id);
    if (existing) {
      if (existing.status === 'accepted') {
        return { success: false, message: '你们已经建立了绑定关系，无需重复申请' };
      }
      if (existing.status === 'pending') {
        return { success: false, message: '已有待处理的绑定邀请，请等待对方确认' };
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const newBinding: Binding = {
      id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      requesterId: currentUser.id,
      targetId: target.id,
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt,
      retainHistory: {
        [currentUser.id]: true,
        [target.id]: true,
      },
    };

    setBindings((prev) => [newBinding, ...prev]);

    sendNotification(
      target.id,
      'binding_invite',
      '收到心愿守护绑定邀请',
      `${currentUser.nickname} 邀请与你建立「心愿之间」绑定关系，绑定后可互相授权心愿抽选。邀请将在 7 天后失效。`,
      { relatedBindingId: newBinding.id }
    );

    return { success: true, message: `已成功向 ${target.nickname} 发送邀请！` };
  };

  const acceptBindingInvite = (bindingId: string) => {
    const binding = bindings.find((b) => b.id === bindingId);
    if (!binding) return;

    setBindings((prev) =>
      prev.map((b) => (b.id === bindingId ? { ...b, status: 'accepted' } : b))
    );

    const requester = users.find((u) => u.id === binding.requesterId);
    if (requester) {
      sendNotification(
        requester.id,
        'binding_accepted',
        '绑定邀请已通过',
        `${currentUser.nickname} 接受了你的绑定邀请！你们现在可以互相分享心愿并开启惊喜抽选了。`,
        { relatedBindingId: bindingId }
      );
    }
  };

  const rejectBindingInvite = (bindingId: string) => {
    const binding = bindings.find((b) => b.id === bindingId);
    if (!binding) return;

    setBindings((prev) =>
      prev.map((b) => (b.id === bindingId ? { ...b, status: 'rejected' } : b))
    );

    const requester = users.find((u) => u.id === binding.requesterId);
    if (requester) {
      sendNotification(
        requester.id,
        'binding_rejected',
        '绑定邀请未接受',
        `${currentUser.nickname} 暂未接受你的绑定邀请。`,
        { relatedBindingId: bindingId }
      );
    }
  };

  const unbind = (bindingId: string, retainHistory: boolean) => {
    const binding = bindings.find((b) => b.id === bindingId);
    if (!binding) return;

    const partnerId =
      binding.requesterId === currentUser.id ? binding.targetId : binding.requesterId;
    const partner = users.find((u) => u.id === partnerId);

    // PRD 4.2 & 4.7: 解除后立即终止双方之间所有未完成的送礼流程，并解除对应心愿锁定
    setGiftRecords((prev) =>
      prev.map((gr) => {
        const isBetween =
          (gr.giverId === currentUser.id && gr.receiverId === partnerId) ||
          (gr.giverId === partnerId && gr.receiverId === currentUser.id);

        if (isBetween && (gr.status === 'drawn' || gr.status === 'purchased')) {
          return {
            ...gr,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          };
        }
        return gr;
      })
    );

    // Update retention preference and remove or mark unbind
    setBindings((prev) =>
      prev.filter((b) => b.id !== bindingId)
    );

    if (partner) {
      sendNotification(
        partner.id,
        'binding_unbound',
        '绑定关系已解除',
        `${currentUser.nickname} 解除了与你的绑定关系。双方之间所有未完成的送礼流程已终止并解除锁定。`
      );
    }
  };

  // Draw and Gifting
  const getEligibleWishesForDraw = (partnerId: string, maxBudget?: number) => {
    const partner = users.find((u) => u.id === partnerId);
    if (!partner) {
      return { eligible: [], reasonIfEmpty: '用户不存在', totalWishesCount: 0, avoidItems: [] };
    }

    if (partner.wishlistPaused) {
      return {
        eligible: [],
        reasonIfEmpty: `${partner.nickname} 当前暂停了心愿清单，暂不接受新的抽选`,
        totalWishesCount: 0,
        avoidItems: getUserAvoidListForViewer(partnerId, currentUser.id),
      };
    }

    if (partner.deactivatedAt) {
      return {
        eligible: [],
        reasonIfEmpty: '该账号处于停用期，心愿清单暂不可见',
        totalWishesCount: 0,
        avoidItems: [],
      };
    }

    // Get partner's wishes
    const partnerWishes = wishes.filter((w) => w.userId === partnerId);
    const now = new Date();

    // Check existing active gift records between (giver: currentUser, receiver: partnerId)
    const alreadyDrawnWishIds = new Set(
      giftRecords
        .filter(
          (gr) =>
            gr.giverId === currentUser.id &&
            gr.receiverId === partnerId &&
            (gr.status === 'drawn' || gr.status === 'purchased')
        )
        .map((gr) => gr.wishId)
    );

    // Eligible candidates
    let candidates = partnerWishes.filter((w) => {
      // Check if locked by current relationship
      if (alreadyDrawnWishIds.has(w.id)) return false;

      // Check permission: if allowedUserIds is specified, currentUser must be in it
      if (w.allowedUserIds && w.allowedUserIds.length > 0) {
        if (!w.allowedUserIds.includes(currentUser.id)) return false;
      }

      // Check deadline: if deadline expired, cannot draw (PRD 4.5)
      if (w.deadline) {
        const deadDate = new Date(w.deadline);
        if (deadDate < now) return false;
      }

      return true;
    });

    const totalAvailableBeforeBudget = candidates.length;

    // Budget filtering (PRD 4.5: 预算为选填项。填写预算后，仅抽取价格符合预算的心愿；价格未知的心愿不参与已设置预算的抽选)
    if (maxBudget !== undefined && maxBudget > 0) {
      candidates = candidates.filter((w) => {
        if (w.price === undefined || w.price === null) return false; // Unknown price does not participate
        return w.price <= maxBudget;
      });
    }

    const partnerAvoidItems = getUserAvoidListForViewer(partnerId, currentUser.id);

    if (candidates.length === 0) {
      const reason =
        maxBudget !== undefined && maxBudget > 0
          ? `在 ¥${maxBudget} 预算内未找到符合条件的心愿（价格未知或超预算的心愿未纳入筛选）`
          : '暂无可供抽选的心愿（可能已被抽中锁定或已过期）';
      return {
        eligible: [],
        reasonIfEmpty: reason,
        totalWishesCount: totalAvailableBeforeBudget,
        avoidItems: partnerAvoidItems,
      };
    }

    return {
      eligible: candidates,
      totalWishesCount: totalAvailableBeforeBudget,
      avoidItems: partnerAvoidItems,
    };
  };

  const lockWishAsDrawn = (wish: Wish, giverId: string) => {
    const newRecord: GiftRecord = {
      id: `gr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      wishId: wish.id,
      giverId,
      receiverId: wish.userId,
      status: 'drawn',
      drawnAt: new Date().toISOString(),
      giftWishSnapshot: { ...wish },
    };

    setGiftRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const markPurchased = (recordId: string, note?: string) => {
    setGiftRecords((prev) =>
      prev.map((gr) =>
        gr.id === recordId
          ? {
              ...gr,
              status: 'purchased',
              purchasedAt: new Date().toISOString(),
              purchaseNote: note || gr.purchaseNote,
            }
          : gr
      )
    );
  };

  const markSent = (recordId: string, note?: string) => {
    const record = giftRecords.find((gr) => gr.id === recordId);
    if (!record) return;

    const sentAt = new Date().toISOString();
    setGiftRecords((prev) =>
      prev.map((gr) =>
        gr.id === recordId
          ? {
              ...gr,
              status: 'sent',
              sentAt,
              purchaseNote: note || gr.purchaseNote,
            }
          : gr
      )
    );

    // PRD 4.6: 只有送礼者主动标记「已送出」后，系统才向主人展示完成状态并揭晓送礼者身份
    const giver = users.find((u) => u.id === record.giverId);
    const wishTitle = record.giftWishSnapshot?.title || '心愿礼物';

    sendNotification(
      record.receiverId,
      'gift_sent',
      '惊喜已送达！TA为你实现了心愿 🎉',
      `${giver?.nickname || 'TA'} 已为你送出了心愿【${wishTitle}】！点击可前往「送礼历史」查看这份甜蜜心意与备忘。`,
      { relatedGiftRecordId: recordId, relatedWishId: record.wishId }
    );
  };

  const cancelGiftRecord = (recordId: string) => {
    // PRD 4.6: 取消后结束当前记录并解除锁定；取消操作不通知心愿主人
    setGiftRecords((prev) =>
      prev.map((gr) =>
        gr.id === recordId
          ? {
              ...gr,
              status: 'cancelled',
              cancelledAt: new Date().toISOString(),
            }
          : gr
      )
    );
  };

  const getActiveGiftTasks = (giverId: string = currentUser.id) => {
    return giftRecords.filter(
      (gr) => gr.giverId === giverId && (gr.status === 'drawn' || gr.status === 'purchased')
    );
  };

  // Avoid List logic
  const getUserAvoidListForViewer = (targetUserId: string, viewerId: string) => {
    const items = avoidLists.filter((item) => item.userId === targetUserId);
    return items.filter((item) => {
      if (item.allowedUserIds.length === 0) return true;
      return item.allowedUserIds.includes(viewerId);
    });
  };

  const addAvoidItem = (
    itemData: Omit<AvoidItem, 'id' | 'userId' | 'updatedAt'>,
    notifyAllowedUsers?: boolean
  ) => {
    const newItem: AvoidItem = {
      ...itemData,
      id: `av_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: currentUser.id,
      updatedAt: new Date().toISOString(),
    };

    setAvoidLists((prev) => [newItem, ...prev]);

    if (notifyAllowedUsers && newItem.allowedUserIds.length > 0) {
      newItem.allowedUserIds.forEach((targetId) => {
        sendNotification(
          targetId,
          'avoid_list_updated',
          '避雷清单有更新',
          `${currentUser.nickname} 更新了TA的避雷清单，送礼前不妨留意下新的喜好与忌讳哦。`
        );
      });
    }
  };

  const updateAvoidItem = (
    id: string,
    updates: Partial<AvoidItem>,
    notifyAllowedUsers?: boolean
  ) => {
    setAvoidLists((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );

    const existing = avoidLists.find((i) => i.id === id);
    const targetUserIds = updates.allowedUserIds || existing?.allowedUserIds || [];

    if (notifyAllowedUsers && targetUserIds.length > 0) {
      targetUserIds.forEach((targetId) => {
        sendNotification(
          targetId,
          'avoid_list_updated',
          '避雷清单有更新',
          `${currentUser.nickname} 更新了TA的避雷清单，送礼前不妨留意下新的喜好与忌讳哦。`
        );
      });
    }
  };

  const deleteAvoidItem = (id: string) => {
    setAvoidLists((prev) => prev.filter((item) => item.id !== id));
  };

  // Share Pages
  const createSharePage = (
    title: string,
    description: string,
    wishIds: string[],
    authorizedUserIds: string[]
  ) => {
    const newPage: SharePage = {
      id: `sp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: currentUser.id,
      title,
      description,
      wishIds,
      authorizedUserIds,
      isActive: true,
      shareCode: `WISH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    setSharePages((prev) => [newPage, ...prev]);
    return newPage;
  };

  const updateSharePage = (id: string, updates: Partial<SharePage>) => {
    setSharePages((prev) => prev.map((sp) => (sp.id === id ? { ...sp, ...updates } : sp)));
  };

  const deleteSharePage = (id: string) => {
    setSharePages((prev) => prev.filter((sp) => sp.id !== id));
  };

  // Notifications
  const unreadCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.read
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.filter((n) => n.userId !== currentUser.id));
  };

  // Profile & System
  const updateUserProfile = (updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const deactivateAccount = () => {
    // 30 days deactivation period simulation
    const now = new Date().toISOString();
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, deactivatedAt: now } : u))
    );
  };

  const reactivateAccount = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, deactivatedAt: null } : u))
    );
  };

  const exportUserData = () => {
    const userWishes = wishes.filter((w) => w.userId === currentUser.id);
    const userAvoids = avoidLists.filter((a) => a.userId === currentUser.id);
    const userSent = giftRecords.filter((g) => g.giverId === currentUser.id && g.status === 'sent');
    const userReceived = giftRecords.filter((g) => g.receiverId === currentUser.id && g.status === 'sent');

    const exportPayload = {
      user: currentUser,
      exportTime: new Date().toISOString(),
      wishes: userWishes,
      avoidList: userAvoids,
      sentGifts: userSent,
      receivedGifts: userReceived,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `心愿之间_数据备份_${currentUser.nickname}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('u_xiaotao');
    setBindings(INITIAL_BINDINGS);
    setWishes(INITIAL_WISHES);
    setGiftRecords(INITIAL_GIFT_RECORDS);
    setAvoidLists(INITIAL_AVOID_LISTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSharePages(INITIAL_SHARE_PAGES);
    setAnniversaries(INITIAL_ANNIVERSARIES);
  };

  // Gift History
  const getSentGiftHistory = (userId: string = currentUser.id): GiftHistoryItem[] => {
    return giftRecords
      .filter((gr) => gr.giverId === userId && gr.status === 'sent')
      .map((gr) => {
        const receiver = users.find((u) => u.id === gr.receiverId);
        return {
          id: gr.id,
          giftRecordId: gr.id,
          giverId: gr.giverId,
          receiverId: gr.receiverId,
          giverNickname: currentUser.nickname,
          receiverNickname: receiver?.nickname || 'TA',
          wishTitle: gr.giftWishSnapshot?.title || '心愿礼物',
          wishImage: gr.giftWishSnapshot?.images?.[0],
          wishSpecs: gr.giftWishSnapshot?.specs,
          price: gr.giftWishSnapshot?.price,
          sentAt: gr.sentAt || gr.drawnAt,
          purchaseNote: gr.purchaseNote,
        };
      });
  };

  const getReceivedGiftHistory = (userId: string = currentUser.id): GiftHistoryItem[] => {
    return giftRecords
      .filter((gr) => gr.receiverId === userId && gr.status === 'sent')
      .map((gr) => {
        const giver = users.find((u) => u.id === gr.giverId);
        return {
          id: gr.id,
          giftRecordId: gr.id,
          giverId: gr.giverId,
          receiverId: gr.receiverId,
          giverNickname: giver?.nickname || '心愿守护者',
          receiverNickname: currentUser.nickname,
          wishTitle: gr.giftWishSnapshot?.title || '心愿礼物',
          wishImage: gr.giftWishSnapshot?.images?.[0],
          wishSpecs: gr.giftWishSnapshot?.specs,
          price: gr.giftWishSnapshot?.price,
          sentAt: gr.sentAt || gr.drawnAt,
          purchaseNote: gr.purchaseNote,
        };
      });
  };

  // Anniversaries & Milestones
  const addAnniversary = (item: Omit<Anniversary, 'id' | 'userId' | 'createdAt'>): Anniversary => {
    const newAnn: Anniversary = {
      ...item,
      id: `ann_${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setAnniversaries((prev) => [newAnn, ...prev]);
    return newAnn;
  };

  const updateAnniversary = (id: string, updates: Partial<Anniversary>) => {
    setAnniversaries((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAnniversary = (id: string) => {
    setAnniversaries((prev) => prev.filter((a) => a.id !== id));
  };

  const getUpcomingAnniversaries = (userId: string = currentUser.id): UpcomingAnniversary[] => {
    const activeUser = users.find((u) => u.id === userId) || currentUser;
    const boundPartners = getBoundUsers(userId);
    const partner = boundPartners[0];
    const partnerIds = boundPartners.map((p) => p.id);

    // 1. User & partner custom anniversaries
    const relevantAnns = anniversaries.filter(
      (a) => a.userId === userId || partnerIds.includes(a.userId)
    );

    // 2. Builtin couple holidays (圣诞节, 七夕, 情人节, 520, 妇女节)
    const systemHolidays: Anniversary[] = BUILTIN_COUPLE_HOLIDAYS.map((h) => ({
      ...h,
      userId: 'system',
      createdAt: '2026-01-01T00:00:00.000Z',
    }));

    // 3. Current user birthday if present
    const birthdays: Anniversary[] = [];
    if (activeUser.birthday) {
      const bDate = activeUser.birthday.length === 5 ? `2000-${activeUser.birthday}` : activeUser.birthday;
      birthdays.push({
        id: `ann_bday_${activeUser.id}`,
        userId: activeUser.id,
        title: '我的生日 🎂',
        type: 'birthday',
        date: bDate,
        isRepeatYearly: true,
        remindDaysAhead: activeUser.giftReminderDays || giftReminderDays || 5,
        targetPerson: 'me',
        notes: '属于自己的特别日子，期待被用心守护与惊喜',
        createdAt: '2026-01-01T00:00:00.000Z',
      });
    }

    // 4. Partner birthday if present
    if (partner?.birthday) {
      const pDate = partner.birthday.length === 5 ? `2000-${partner.birthday}` : partner.birthday;
      birthdays.push({
        id: `ann_bday_${partner.id}`,
        userId: partner.id,
        title: `${partner.nickname}的生日 🎂`,
        type: 'birthday',
        date: pDate,
        isRepeatYearly: true,
        remindDaysAhead: activeUser.giftReminderDays || giftReminderDays || 5,
        targetPerson: 'partner',
        notes: '最重要的人的生日，提前从心愿单里抽取惊喜礼物',
        createdAt: '2026-01-01T00:00:00.000Z',
      });
    }

    const allCombined = [...relevantAnns, ...systemHolidays, ...birthdays];

    const seen = new Set<string>();
    const uniqueAnns: Anniversary[] = [];
    for (const ann of allCombined) {
      const md = ann.date.slice(5);
      const shortKey = `${ann.title.slice(0, 3)}_${md}`;
      if (!seen.has(shortKey)) {
        seen.add(shortKey);
        uniqueAnns.push(ann);
      }
    }

    return uniqueAnns
      .map((a) => calculateUpcomingAnniversary(a))
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        users,
        bindings,
        wishes,
        giftRecords,
        avoidLists,
        notifications,
        sharePages,
        giftReminderDays,
        setGiftReminderDays,
        loginUser,
        registerOrSwitchUser,
        addWish,
        updateWish,
        deleteWish,
        reorderWishes,
        togglePauseWishlist,
        isWishLocked,
        sendBindingInvite,
        acceptBindingInvite,
        rejectBindingInvite,
        unbind,
        getBoundUsers,
        getBindingBetween,
        getEligibleWishesForDraw,
        lockWishAsDrawn,
        markPurchased,
        markSent,
        cancelGiftRecord,
        getActiveGiftTasks,
        addAvoidItem,
        updateAvoidItem,
        deleteAvoidItem,
        getUserAvoidListForViewer,
        createSharePage,
        updateSharePage,
        deleteSharePage,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        updateUserProfile,
        deactivateAccount,
        reactivateAccount,
        exportUserData,
        resetAllDemoData,
        getSentGiftHistory,
        getReceivedGiftHistory,
        anniversaries,
        addAnniversary,
        updateAnniversary,
        deleteAnniversary,
        getUpcomingAnniversaries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
