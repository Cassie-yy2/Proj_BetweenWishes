import React, { useState } from 'react';
import { UpcomingAnniversary } from '../../types';
import { useApp } from '../../context/AppContext';
import { getAnniversaryIcon } from '../../utils/anniversaryUtils';
import {
  X,
  Gift,
  Bell,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart,
  Check,
  Clock,
} from 'lucide-react';

interface GiftReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDraw: () => void;
  events: UpcomingAnniversary[];
}

export const GiftReminderModal: React.FC<GiftReminderModalProps> = ({
  isOpen,
  onClose,
  onNavigateToDraw,
  events,
}) => {
  const { giftReminderDays, setGiftReminderDays, getBoundUsers } = useApp();
  const [customDaysInput, setCustomDaysInput] = useState<string>(String(giftReminderDays || 5));
  const [isEditingDays, setIsEditingDays] = useState(false);

  if (!isOpen || events.length === 0) return null;

  const boundPartner = getBoundUsers()[0];
  const primaryEvent = events[0];

  const PRESET_DAYS = [3, 5, 7, 10, 15, 30];

  const handleApplyCustomDays = (days: number) => {
    const val = Math.max(1, Math.min(60, days));
    setGiftReminderDays(val);
    setCustomDaysInput(String(val));
    setIsEditingDays(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[92vh]">
        {/* Decorative Top Accent */}
        <div className="h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-b from-rose-50/80 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-800">浪漫送礼心意提醒</h3>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                  提前备礼
                </span>
              </div>
              <p className="text-[11px] text-slate-400">节日与生日倒数，让心意从不缺席</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Main Hero Card for Primary Event */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50/60 to-amber-50/40 border border-rose-200/90 shadow-xs relative overflow-hidden text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-xs border border-rose-100 text-3xl mx-auto">
              {getAnniversaryIcon(primaryEvent)}
            </div>

            <div>
              <div className="text-xs font-semibold text-rose-500 tracking-wide uppercase">
                {primaryEvent.type === 'birthday' ? '🎂 生日将至 · 备礼提醒' : '🎉 节日将至 · 备礼提醒'}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">
                {primaryEvent.title}
              </h2>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-xs">
                {primaryEvent.daysRemaining === 0 ? (
                  <span>🎉 就在今天！</span>
                ) : (
                  <span>
                    仅剩 <strong className="text-sm font-black underline decoration-2">{primaryEvent.daysRemaining}</strong> 天 ({primaryEvent.nextDate})
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              {boundPartner ? (
                <>
                  专属情侣节日，无需尴尬试探！快去 <strong>{boundPartner.nickname}</strong> 的心愿清单挑选或抽选一件好物吧~
                </>
              ) : (
                <>重要日子快到了，提前挑一件称心好物，送礼无需烦恼！</>
              )}
            </p>

            {/* Quick Draw / Select Gift Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToDraw();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>立即去为 TA 抽选心愿礼物</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* If there are more upcoming events in this reminder window */}
          {events.length > 1 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>同期即将到来的重要日子 ({events.length})</span>
              </h4>
              <div className="space-y-1.5">
                {events.slice(1).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getAnniversaryIcon(ev)}</span>
                      <span className="font-semibold text-slate-800">{ev.title}</span>
                    </div>
                    <span className="text-rose-600 font-bold text-[11px]">
                      还有 {ev.daysRemaining} 天 ({ev.nextDate})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Reminder Timing Section (User Requirement: 用户也可以自定义提前几天提醒) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">自定义提前几天提醒</span>
              </div>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                当前: 提前 {giftReminderDays} 天
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              系统默认在节日与生日到来 <strong>5 日前</strong> 弹窗提醒。你可以自由调整备礼提前量：
            </p>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PRESET_DAYS.map((days) => {
                const isSelected = giftReminderDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handleApplyCustomDays(days)}
                    className={`px-2.5 py-1 text-xs rounded-xl font-semibold transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {days === 5 ? '5天 (默认)' : `${days}天`}
                  </button>
                );
              })}
            </div>

            {/* Custom Number Input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">自定义天数:</span>
              <input
                type="number"
                min="1"
                max="60"
                value={customDaysInput}
                onChange={(e) => setCustomDaysInput(e.target.value)}
                className="w-16 px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <span className="text-xs text-slate-500">天</span>
              <button
                type="button"
                onClick={() => {
                  const val = parseInt(customDaysInput, 10);
                  if (!isNaN(val)) handleApplyCustomDays(val);
                }}
                className="px-3 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">设置将自动保存至你的账号</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
