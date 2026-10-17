import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManageBindingsModal } from './ManageBindingsModal';
import { AvoidListModal } from './AvoidListModal';
import { GiftHistoryModal } from './GiftHistoryModal';
import { SharePagesModal } from './SharePagesModal';
import { AccountSettingsModal } from './AccountSettingsModal';
import { EditProfileModal } from './EditProfileModal';
import { AnniversariesModal } from '../anniversary/AnniversariesModal';
import {
  Users,
  ShieldAlert,
  History,
  Share2,
  Settings,
  Pencil,
  ChevronRight,
  BookOpen,
  Sparkles,
  Calendar,
  Heart,
  LogIn,
} from 'lucide-react';
import { LoginModal } from '../common/LoginModal';

export const ProfilePage: React.FC<{ onOpenOnboarding: () => void; onNavigateToDraw?: () => void }> = ({
  onOpenOnboarding,
  onNavigateToDraw,
}) => {
  const {
    currentUser,
    users,
    switchUser,
    bindings,
    avoidLists,
    getSentGiftHistory,
    getReceivedGiftHistory,
    getUpcomingAnniversaries,
    getBoundUsers,
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isBindingsOpen, setIsBindingsOpen] = useState(false);
  const [isAvoidListOpen, setIsAvoidListOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSharePagesOpen, setIsSharePagesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnniversariesOpen, setIsAnniversariesOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const upcomingAnns = getUpcomingAnniversaries();
  const nextAnn = upcomingAnns[0];

  const boundUsers = getBoundUsers();
  const isBound = boundUsers.length > 0;
  const boundPartner = boundUsers[0];

  const myAvoidCount = avoidLists.filter((i) => i.userId === currentUser.id).length;
  const totalHistoryCount =
    getSentGiftHistory(currentUser.id).length + getReceivedGiftHistory(currentUser.id).length;

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-4">
      {/* User Profile Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.nickname}
                className="w-16 h-16 rounded-full object-cover border-2 border-rose-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 truncate">
                  {currentUser.nickname}
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  @{currentUser.username}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {currentUser.bio || '写一句属于你的温柔心情吧~'}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 flex-wrap">
                <span className={isBound ? "text-rose-600 font-medium" : ""}>
                  {isBound ? '已绑定伴侣' : '未绑定伴侣'}
                </span>
                <span>·</span>
                <span>避雷项 {myAvoidCount} 条</span>
                <span>·</span>
                <span>历史记录 {totalHistoryCount} 次</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <span>🎂 生日:</span>
                  <strong className="text-slate-700">{currentUser.birthday || '未设置 (选填供送礼提醒)'}</strong>
                </span>
                <span>·</span>
                <span>🔔 提前 {currentUser.giftReminderDays || 5} 天提醒备礼</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            title="编辑资料"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Switcher Demo Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-100/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>体验伴侣视角 · 快速切换</span>
          </div>
          <span className="text-[10px] text-slate-400">体验多用户保密送礼</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {users.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-rose-500 text-white font-bold shadow-xs scale-102'
                    : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.nickname}
                  className="w-4 h-4 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="truncate">{u.nickname}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 pt-2 border-t border-rose-200/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">想要以新账号登录或填写生日？</span>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
          >
            <LogIn className="w-3 h-3" />
            <span>情侣登录 / 选填生日</span>
          </button>
        </div>
      </div>

      {/* Functional Menu List */}
      <div className="space-y-2">
        {/* Anniversaries & Holidays */}
        <button
          onClick={() => setIsAnniversariesOpen(true)}
          className="w-full p-4 rounded-2xl bg-white border border-rose-200/80 hover:border-rose-300 shadow-xs flex items-center justify-between transition-all group bg-gradient-to-r from-white via-rose-50/20 to-pink-50/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white group-hover:scale-110 transition-transform shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-800">心动纪念日 & 节日备忘</h4>
                <span className="text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded-md font-semibold border border-rose-200">
                  {upcomingAnns.length}个
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                恋爱纪念日、生日、情人节、圣诞等重要日子倒数备忘
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            {nextAnn && (
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {nextAnn.daysRemaining === 0 ? '今日!' : `距${nextAnn.title.slice(0, 4)} 剩${nextAnn.daysRemaining}天`}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setIsBindingsOpen(true)}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-200 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800">情侣伴侣绑定管理</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                搜索邀请、解除绑定与独立授权管理
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className={`text-xs font-medium ${isBound ? 'text-rose-600' : 'text-slate-400'}`}>
              {isBound ? (boundPartner ? `已绑定伴侣 (${boundPartner.nickname})` : '已绑定伴侣') : '未绑定伴侣'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setIsAvoidListOpen(true)}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-200 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800">避雷清单管理</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                过敏、饮食与不喜欢的礼物类型，独立权限控制
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-xs font-medium text-slate-500">{myAvoidCount} 条</span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setIsHistoryOpen(true)}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-200 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800">送礼历史与温情回忆</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                查看我送出的惊喜与收到的心意，揭晓送礼者
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-xs font-medium text-slate-500">{totalHistoryCount} 条</span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setIsSharePagesOpen(true)}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-pink-200 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600 group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800">心愿分享专页</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                定制生日或特别节日的心愿清单卡片，支持长效专属分享码
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800">隐私与账号设置</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                搜索隐私、数据备份导出、账号停用与恢复
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>


        <button
          onClick={onOpenOnboarding}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800">新手指南回顾</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                重温「心愿之间」的3步玩法与保密设计理念
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <ManageBindingsModal
        isOpen={isBindingsOpen}
        onClose={() => setIsBindingsOpen(false)}
      />
      <AvoidListModal
        isOpen={isAvoidListOpen}
        onClose={() => setIsAvoidListOpen(false)}
      />
      <GiftHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      <SharePagesModal
        isOpen={isSharePagesOpen}
        onClose={() => setIsSharePagesOpen(false)}
      />
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <AnniversariesModal
        isOpen={isAnniversariesOpen}
        onClose={() => setIsAnniversariesOpen(false)}
        onNavigateToDraw={onNavigateToDraw}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
