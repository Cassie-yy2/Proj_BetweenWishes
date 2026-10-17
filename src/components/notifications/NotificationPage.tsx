import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import {
  Bell,
  HeartHandshake,
  Gift,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  CheckCheck,
} from 'lucide-react';

export const NotificationPage: React.FC<{ onNavigateToTab?: (tab: string) => void }> = ({
  onNavigateToTab,
}) => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    acceptBindingInvite,
    rejectBindingInvite,
    bindings,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'gifts' | 'bindings' | 'system'>('all');

  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);

  const filtered = myNotifications.filter((n) => {
    if (activeFilter === 'gifts') return n.type === 'gift_sent' || n.type === 'wish_deleted';
    if (activeFilter === 'bindings')
      return (
        n.type === 'binding_invite' ||
        n.type === 'binding_accepted' ||
        n.type === 'binding_rejected' ||
        n.type === 'binding_unbound'
      );
    if (activeFilter === 'system')
      return n.type === 'account_alert' || n.type === 'avoid_list_updated' || n.type === 'permission_change';
    return true;
  });

  const getIconForNotification = (type: AppNotification['type']) => {
    switch (type) {
      case 'binding_invite':
      case 'binding_accepted':
      case 'binding_rejected':
      case 'binding_unbound':
        return <HeartHandshake className="w-4 h-4 text-rose-500" />;
      case 'gift_sent':
        return <Gift className="w-4 h-4 text-teal-600" />;
      case 'avoid_list_updated':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>消息通知</span>
            {myNotifications.some((n) => !n.read) && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            情侣绑定、送礼揭晓与伴侣动态
          </p>
        </div>

        <div className="flex items-center gap-2">
          {myNotifications.some((n) => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>全部已读</span>
            </button>
          )}

          {myNotifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-xs text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              title="清空通知"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: '全部' },
          { id: 'bindings', label: '关系邀请' },
          { id: 'gifts', label: '送礼动态' },
          { id: 'system', label: '系统与避雷' },
        ].map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">暂无通知消息</h3>
          <p className="text-xs text-slate-400 mt-1">
            重要的绑定、送礼进度会在此处第一时间提醒你
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => {
            const isUnread = !item.read;
            const relatedBinding = item.relatedBindingId
              ? bindings.find((b) => b.id === item.relatedBindingId)
              : null;
            const isPendingInvite =
              item.type === 'binding_invite' && relatedBinding?.status === 'pending';

            return (
              <div
                key={item.id}
                onClick={() => !item.read && markNotificationAsRead(item.id)}
                className={`p-4 rounded-3xl border transition-all space-y-2 relative group ${
                  isUnread
                    ? 'bg-white border-rose-200 shadow-xs'
                    : 'bg-white/70 border-slate-200/70'
                }`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {getIconForNotification(item.type)}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.content}
                </p>

                {/* Interactive buttons for pending binding invites */}
                {isPendingInvite && relatedBinding && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptBindingInvite(relatedBinding.id);
                        markNotificationAsRead(item.id);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs"
                    >
                      接受绑定
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rejectBindingInvite(relatedBinding.id);
                        markNotificationAsRead(item.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium"
                    >
                      残忍拒绝
                    </button>
                  </div>
                )}

                {/* Quick jump to history if gift sent */}
                {item.type === 'gift_sent' && (
                  <div className="pt-1">
                    <button
                      onClick={() => onNavigateToTab?.('profile')}
                      className="text-xs text-teal-700 font-semibold underline"
                    >
                      前往送礼历史查看详细心意记录 →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
