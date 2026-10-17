import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UpcomingAnniversary } from '../../types';
import { getAnniversaryIcon } from '../../utils/anniversaryUtils';
import { AnniversariesModal } from '../anniversary/AnniversariesModal';
import { AddEditAnniversaryModal } from '../anniversary/AddEditAnniversaryModal';
import {
  Calendar,
  Heart,
  Sparkles,
  Gift,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Bell,
} from 'lucide-react';
import { CalendarView } from '../anniversary/CalendarView';
import { GiftReminderModal } from '../common/GiftReminderModal';

interface AnniversaryHomeWidgetProps {
  onNavigateToDraw: () => void;
}

export const AnniversaryHomeWidget: React.FC<AnniversaryHomeWidgetProps> = ({
  onNavigateToDraw,
}) => {
  const { getUpcomingAnniversaries, currentUser, getBoundUsers, giftReminderDays } = useApp();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const upcomingList = getUpcomingAnniversaries();
  const loveAnniversary = upcomingList.find((a) => a.type === 'love_anniversary');
  const boundPartners = getBoundUsers();
  const hasPartner = boundPartners.length > 0;
  const partnerName = boundPartners[0]?.nickname || 'TA';

  // Events within reminder threshold (default 5 days or user custom)
  const reminderEvents = upcomingList.filter((ev) => ev.daysRemaining <= (giftReminderDays || 5));

  // Get next upcoming milestone
  const nextMilestone = upcomingList[0];

  return (
    <>
      <div className="rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-amber-50/40 border border-rose-200/80 p-5 shadow-xs relative overflow-hidden space-y-4">
        {/* Top header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">日历</h3>
                <span className="text-[10px] text-rose-500 bg-white/90 px-2 py-0.5 rounded-full border border-rose-200 font-semibold shadow-xs">
                  {upcomingList.length}个重要日子
                </span>
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(true)}
                  className="text-[10px] text-amber-700 bg-amber-50/90 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/70 font-semibold shadow-xs flex items-center gap-1 transition-colors"
                  title="点击查看或调整送礼提前提醒设置"
                >
                  <Bell className="w-2.5 h-2.5 text-amber-600" />
                  <span>提前 {giftReminderDays || 5} 天提醒</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
              className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold border border-rose-200/80 shadow-xs flex items-center gap-1 transition-colors"
              title="切换日历视图"
            >
              <CalendarDays className="w-3 h-3 text-rose-500" />
              <span>{isCalendarExpanded ? '折叠日历' : '展开日历'}</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold border border-rose-200/80 shadow-xs flex items-center gap-1 transition-colors"
              title="设定纪念日/生日/情人节"
            >
              <Plus className="w-3 h-3 text-rose-500" />
              <span>添加</span>
            </button>
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors"
            >
              <span>管理</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Hero split stats: Love Days & Next Milestone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Box 1: Love Days Count */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-rose-100 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>相恋时光</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800 mt-1 flex items-baseline gap-1">
                <span>相恋第</span>
                <span className="text-xl sm:text-2xl font-black text-rose-600 tabular-nums">
                  {loveAnniversary?.daysElapsed ?? 876}
                </span>
                <span>天</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {loveAnniversary
                  ? `下次周年还有 ${loveAnniversary.daysRemaining} 天`
                  : '记录我们心动的起点'}
              </div>
            </div>

            <button
              onClick={() => setIsManageModalOpen(true)}
              className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200/60 transition-colors"
              title="查看详情"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Box 2: Next Upcoming Milestone (Birthday / Holiday) */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-rose-100 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>下个重要日子</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1 truncate">
                {nextMilestone ? nextMilestone.title : '情人节 / 生日'}
              </div>
              <div className="text-[10px] text-rose-500 mt-0.5 font-medium flex items-center gap-1">
                {nextMilestone ? (
                  nextMilestone.daysRemaining === 0 ? (
                    <span className="font-bold text-rose-600">🎉 就是今天！</span>
                  ) : (
                    <span>
                      还有 <strong className="font-bold text-rose-600">{nextMilestone.daysRemaining}</strong> 天 ({nextMilestone.nextDate})
                    </span>
                  )
                ) : (
                  <span>暂无倒数</span>
                )}
              </div>
            </div>

            {hasPartner && (
              <button
                onClick={onNavigateToDraw}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1"
                title="提前从对方心愿单中抽选礼物"
              >
                <Gift className="w-3.5 h-3.5 text-rose-300" />
                <span>备礼</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Calendar Presentation */}
        {isCalendarExpanded && (
          <div className="pt-1 border-t border-rose-200/50">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-rose-500" />
                <span>月度纪念日历</span>
              </span>
              <span className="text-[10px] text-slate-400">点击日期查看当日纪念或备忘</span>
            </div>
            <CalendarView
              upcomingList={upcomingList}
              onSelectAnniversary={() => setIsManageModalOpen(true)}
              onNavigateToDraw={onNavigateToDraw}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AnniversariesModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onNavigateToDraw={onNavigateToDraw}
      />

      <AddEditAnniversaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Gift Reminder Modal */}
      <GiftReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onNavigateToDraw={onNavigateToDraw}
        events={reminderEvents.length > 0 ? reminderEvents : (upcomingList.length > 0 ? [upcomingList[0]] : [])}
      />
    </>
  );
};
