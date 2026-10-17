import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { HomePage } from './components/home/HomePage';
import { WishlistPage } from './components/wishes/WishlistPage';
import { DrawPage } from './components/draw/DrawPage';
import { NotificationModal } from './components/notifications/NotificationModal';
import { ProfilePage } from './components/profile/ProfilePage';
import { OnboardingModal } from './components/common/OnboardingModal';
import { GiftReminderModal } from './components/common/GiftReminderModal';
import { Smartphone, Monitor } from 'lucide-react';

function MainApp() {
  const { getUpcomingAnniversaries, giftReminderDays } = useApp();
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(false);
  const [isGiftReminderOpen, setIsGiftReminderOpen] = useState(false);

  const upcomingEvents = getUpcomingAnniversaries();
  const urgentEvents = upcomingEvents.filter(
    (ev) => ev.daysRemaining >= 0 && ev.daysRemaining <= (giftReminderDays || 5)
  );

  // Show onboarding guide on first visit
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('wish_between_seen_onboarding');
    if (!hasSeenGuide) {
      setIsOnboardingOpen(true);
      localStorage.setItem('wish_between_seen_onboarding', 'true');
    }
  }, []);

  // Auto default reminder: when holiday or birthday is within giftReminderDays (default 5 days), popup modal
  useEffect(() => {
    if (urgentEvents.length > 0) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const sessionKey = `wish_between_reminder_prompt_${todayStr}`;
      const hasPrompted = sessionStorage.getItem(sessionKey);
      if (!hasPrompted) {
        const timer = setTimeout(() => {
          setIsGiftReminderOpen(true);
          sessionStorage.setItem(sessionKey, 'true');
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [urgentEvents.length, giftReminderDays]);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        );
      case 'wishes':
        return <WishlistPage onNavigateToTab={(tab) => setCurrentTab(tab)} />;
      case 'draw':
        return <DrawPage />;
      case 'profile':
        return (
          <ProfilePage
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onNavigateToDraw={() => setCurrentTab('draw')}
          />
        );
      default:
        return (
          <HomePage
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col items-center">
      {/* Top desktop frame toggle bar (only visible on medium+ screens) */}
      <div className="hidden lg:flex w-full max-w-4xl px-4 py-2 justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-600">心愿之间 (Wish Between)</span>
          <span>·</span>
          <span>情侣送礼与心愿清单</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setIsMobileFrameMode(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              isMobileFrameMode
                ? 'bg-rose-500 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>手机模拟框</span>
          </button>
          <button
            onClick={() => setIsMobileFrameMode(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              !isMobileFrameMode
                ? 'bg-rose-500 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>自适应宽屏</span>
          </button>
        </div>
      </div>

      {/* Main Container: Mobile Frame vs Fluid Responsive */}
      <div
        className={`w-full flex-1 flex flex-col bg-slate-50 relative ${
          isMobileFrameMode
            ? 'max-w-[430px] my-0 lg:my-4 rounded-none lg:rounded-[40px] shadow-2xl border-0 lg:border-[8px] lg:border-slate-800 overflow-hidden min-h-[844px]'
            : 'max-w-4xl'
        }`}
      >
        {/* App Header with notification bell on top right */}
        <Header
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Tab View Content */}
        <main className="flex-1 overflow-x-hidden">
          {renderCurrentTab()}
        </main>

        {/* Bottom Tab Navigation: 首页, 心愿清单, 为TA送礼, 我的 */}
        <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

        {/* Notification Modal (opened from top right bell) */}
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
        />

        {/* Onboarding Guide Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />

        {/* Automatic 5-Day Gift Reminder Popup Modal */}
        <GiftReminderModal
          isOpen={isGiftReminderOpen}
          onClose={() => setIsGiftReminderOpen(false)}
          onNavigateToDraw={() => setCurrentTab('draw')}
          events={urgentEvents.length > 0 ? urgentEvents : (upcomingEvents.length > 0 ? [upcomingEvents[0]] : [])}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
