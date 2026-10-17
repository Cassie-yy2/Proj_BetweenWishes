import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wish } from '../../types';
import { WishCard } from './WishCard';
import { AddEditWishModal } from './AddEditWishModal';
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  PauseCircle,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

interface WishlistPageProps {
  onNavigateToTab?: (tab: 'home' | 'wishes' | 'draw' | 'profile') => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = () => {
  const {
    currentUser,
    wishes,
    togglePauseWishlist,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePriority, setActivePriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [wishToEdit, setWishToEdit] = useState<Wish | null>(null);

  // Wishes for current user
  const myWishes = wishes.filter((w) => w.userId === currentUser.id);

  // Available categories for my wishes
  const categories = ['all', ...Array.from(new Set(myWishes.map((w) => w.category)))];

  // Filtered wishes for mine
  const filteredMyWishes = myWishes.filter((w) => {
    if (activeCategory !== 'all' && w.category !== activeCategory) return false;
    if (activePriority !== 'all' && w.priority !== activePriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchSpecs = w.specs?.toLowerCase().includes(q);
      const matchNote = w.note?.toLowerCase().includes(q);
      if (!matchTitle && !matchSpecs && !matchNote) return false;
    }
    return true;
  });

  const totalMyValue = myWishes.reduce((sum, w) => sum + (w.price || 0), 0);

  const handleEditWish = (wish: Wish) => {
    setWishToEdit(wish);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setWishToEdit(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-4">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-rose-50/80 via-pink-50/40 to-amber-50/50 border border-rose-100/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">我的心愿清单</h2>
            <span className="text-xs font-semibold text-rose-500 bg-white/80 px-2 py-0.5 rounded-full border border-rose-200">
              {myWishes.length} 个愿望
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            写下你真心喜欢的好物，伴侣可通过抽奖机为你保密抽选实现
          </p>
        </div>

        {/* Pause Wishlist & Add Wish */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => togglePauseWishlist(!currentUser.wishlistPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              currentUser.wishlistPaused
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {currentUser.wishlistPaused ? (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>清单已暂停 (点击恢复)</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-slate-400" />
                <span>公开参与抽选中</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>加心愿</span>
          </button>
        </div>
      </div>

      {/* Paused Alert notice for mine */}
      {currentUser.wishlistPaused && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
          <span>
            ⏸️ 你的心愿清单当前处于「暂停」状态，伴侣在抽选时将暂时无法抽取你未被锁定的心愿。
          </span>
          <button
            onClick={() => togglePauseWishlist(false)}
            className="text-amber-900 underline font-semibold ml-2 shrink-0"
          >
            立即恢复
          </button>
        </div>
      )}

      {/* Search and View Switcher */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索我的心愿、规格或备注..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-xl transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="卡片视图"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-xl transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="列表视图"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills & Priority Filters */}
      <div className="space-y-2">
        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">优先级：</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: '全部' },
              { id: 'high', label: '🔥 高优先' },
              { id: 'medium', label: '✨ 中优先' },
              { id: 'low', label: '🌱 随缘' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePriority(p.id)}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  activePriority === p.id
                    ? 'bg-rose-100 text-rose-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Wishes List / Grid Display */}
      {filteredMyWishes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">暂无心愿记录</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            点击下方按钮写下你期待收到的惊喜礼物吧~
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>添加第一个心愿</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredMyWishes.map((w) => (
            <WishCard key={w.id} wish={w} viewMode="grid" onEdit={handleEditWish} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMyWishes.map((w) => (
            <WishCard key={w.id} wish={w} viewMode="list" onEdit={handleEditWish} />
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {filteredMyWishes.length > 0 && (
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
          <span>显示 {filteredMyWishes.length} 项心愿</span>
          <span className="tabular-nums">
            参考价值估算：<strong className="text-rose-600 font-semibold">¥{totalMyValue.toFixed(0)}</strong>
          </span>
        </div>
      )}

      {/* Add / Edit Modal for current user */}
      <AddEditWishModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        wishToEdit={wishToEdit}
      />
    </div>
  );
};
