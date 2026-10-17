import React from 'react';
import { Home, Sparkles, Gift, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type TabType = 'home' | 'wishes' | 'draw' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const { getActiveGiftTasks } = useApp();
  const activeTasksCount = getActiveGiftTasks().length;

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: '首页',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'wishes',
      label: '心愿清单',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'draw',
      label: '为TA送礼',
      icon: <Gift className="w-5 h-5" />,
      badge: activeTasksCount > 0 ? activeTasksCount : undefined,
    },
    {
      id: 'profile',
      label: '我的',
      icon: <UserRound className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all ${
                isActive ? 'text-rose-500 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight mt-1 ${isActive ? 'scale-105' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
