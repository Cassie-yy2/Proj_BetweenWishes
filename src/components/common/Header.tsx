import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Sparkles, ChevronDown, Check, Users, LogIn } from 'lucide-react';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenOnboarding }) => {
  const { currentUser, users, switchUser, unreadCount } = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/60 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand & Guide */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>心愿之间</span>
            </h1>
          </div>
        </div>

        {/* Right actions: User switcher & Notification bell */}
        <div className="flex items-center gap-2">
          {/* User Switcher Pill for Multi-perspective Testing */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors text-xs text-slate-700"
              title="切换当前体验用户视角"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.nickname}
                className="w-5 h-5 rounded-full object-cover border border-white"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium max-w-[60px] truncate">{currentUser.nickname}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowUserDropdown(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>快速切换体验视角</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    切换后可体验送礼保密、心愿抽选与双向通知
                  </p>
                </div>

                <div className="py-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-rose-50/80 text-rose-600' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.nickname}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate flex items-center gap-1">
                              <span>{u.nickname}</span>
                              {u.id === 'u_xiaotao' && (
                                <span className="text-[10px] text-slate-400 font-normal">(主人设)</span>
                              )}
                              {u.id === 'u_yiche' && (
                                <span className="text-[10px] text-slate-400 font-normal">(送礼者)</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{u.bio}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>情侣登录 / 选填生日</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="查看通知"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Login & Birthday Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};
