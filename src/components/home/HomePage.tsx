import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wish } from '../../types';
import { AddEditWishModal } from '../wishes/AddEditWishModal';
import { AnniversaryHomeWidget } from './AnniversaryHomeWidget';
import heroGiftImg from '../../assets/images/app_hero_gift_1791739407131.jpg';
import {
  Sparkles,
  Dices,
  Plus,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToTab: (tab: 'home' | 'wishes' | 'draw' | 'profile') => void;
  onOpenOnboarding: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToTab, onOpenOnboarding }) => {
  const {
    currentUser,
    wishes,
    getBoundUsers,
    getActiveGiftTasks,
    togglePauseWishlist,
  } = useApp();

  const [isAddWishModalOpen, setIsAddWishModalOpen] = useState(false);

  const boundUsers = getBoundUsers();
  const activeGiftingTasks = getActiveGiftTasks();
  const myWishes = wishes.filter((w) => w.userId === currentUser.id);

  const handleOpenAddWish = () => {
    setIsAddWishModalOpen(true);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-5">
      {/* Warm Hero Welcome Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-50/90 via-pink-50/60 to-amber-50/50 border border-rose-200/70 text-slate-800 shadow-xs">
        <div className="relative p-6 z-10 space-y-3 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-rose-600 border border-rose-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>愿望悄悄许，惊喜自然来</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 leading-snug">
            嗨，{currentUser.nickname}！<br />
            今天有什么想被实现的愿望吗？
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            记录心仪好物，专属绑定情侣伴侣。让每一次节日与纪念日的送礼，都成为无需尴尬询问的心有灵犀。
          </p>

          <div className="pt-2 flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleOpenAddWish}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-rose-300" />
              <span>记个心愿</span>
            </button>

            {boundUsers.length > 0 && (
              <button
                onClick={() => onNavigateToTab('draw')}
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Dices className="w-4 h-4 text-rose-500" />
                <span>为TA抽选礼物</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Background Artwork */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 sm:opacity-35 pointer-events-none overflow-hidden">
          <img
            src={heroGiftImg}
            alt="心愿之间礼盒"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-rose-50/80 to-transparent" />
        </div>
      </div>

      {/* Quick Status & Stats Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onNavigateToTab('wishes')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-left hover:border-rose-200 transition-colors"
        >
          <div className="text-[11px] text-slate-400 font-medium">我的心愿</div>
          <div className="text-lg font-black text-slate-800 mt-1 tabular-nums">
            {myWishes.length}
          </div>
          <div className="text-[10px] text-rose-500 mt-0.5">
            {currentUser.wishlistPaused ? '⏸️ 清单已暂停' : '参与抽选中'}
          </div>
        </button>

        <button
          onClick={() => onNavigateToTab('profile')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-left hover:border-rose-200 transition-colors"
        >
          <div className="text-[11px] text-slate-400 font-medium">伴侣绑定状态</div>
          <div className="text-sm font-black text-slate-800 mt-1">
            {boundUsers.length > 0 ? '已绑定伴侣' : '未绑定伴侣'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {boundUsers[0]?.nickname ? `TA: ${boundUsers[0].nickname}` : '去个人页绑定伴侣'}
          </div>
        </button>

        <button
          onClick={() => onNavigateToTab('draw')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-left hover:border-rose-200 transition-colors relative"
        >
          <div className="text-[11px] text-slate-400 font-medium">送礼任务</div>
          <div className="text-lg font-black text-slate-800 mt-1 tabular-nums">
            {activeGiftingTasks.length}
          </div>
          <div className="text-[10px] text-teal-600 mt-0.5">
            {activeGiftingTasks.length > 0 ? '进行中' : '准备就绪'}
          </div>
          {activeGiftingTasks.length > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* Couple Anniversaries & Holidays Milestone Widget */}
      <AnniversaryHomeWidget onNavigateToDraw={() => onNavigateToTab('draw')} />

      {/* Add Wish Modal triggered by hero banner */}
      <AddEditWishModal
        isOpen={isAddWishModalOpen}
        onClose={() => setIsAddWishModalOpen(false)}
      />
    </div>
  );
};
