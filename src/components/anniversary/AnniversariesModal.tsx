import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Anniversary, UpcomingAnniversary } from '../../types';
import { getAnniversaryIcon } from '../../utils/anniversaryUtils';
import { AddEditAnniversaryModal } from './AddEditAnniversaryModal';
import {
  Calendar,
  Plus,
  X,
  Heart,
  Pencil,
  Trash2,
  Gift,
  Clock,
  Sparkles,
  ArrowRight,
  Bell,
  List,
  CalendarDays,
} from 'lucide-react';
import { CalendarView } from './CalendarView';

interface AnniversariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDraw?: () => void;
}

export const AnniversariesModal: React.FC<AnniversariesModalProps> = ({
  isOpen,
  onClose,
  onNavigateToDraw,
}) => {
  const { getUpcomingAnniversaries, deleteAnniversary, currentUser, getBoundUsers } = useApp();
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState<Anniversary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  if (!isOpen) return null;

  const upcomingList = getUpcomingAnniversaries();
  const loveAnniversary = upcomingList.find((a) => a.type === 'love_anniversary');
  const boundPartners = getBoundUsers();
  const hasPartner = boundPartners.length > 0;

  const handleEdit = (ann: Anniversary) => {
    setEditingAnniversary(ann);
    setIsAddEditOpen(true);
  };

  const handleAdd = () => {
    setEditingAnniversary(null);
    setIsAddEditOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAnniversary(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/80 via-pink-50/40 to-amber-50/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span>心动纪念日 & 节日备忘</span>
                <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {upcomingList.length}个重要日子
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                记录相爱时光，自动计算倒数日，让送礼不再手忙脚乱
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Highlight Banner: Love Anniversary Days */}
          {loveAnniversary && loveAnniversary.daysElapsed !== undefined && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-500 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold tracking-wide backdrop-blur-xs">
                    <Heart className="w-3 h-3 text-rose-200 fill-rose-200" />
                    <span>相守岁月</span>
                  </div>
                  <div className="mt-2 text-2xl font-black tracking-tight flex items-baseline gap-1.5">
                    <span>相恋第</span>
                    <span className="text-3xl sm:text-4xl tabular-nums text-amber-200 font-extrabold">
                      {loveAnniversary.daysElapsed}
                    </span>
                    <span>天</span>
                  </div>
                  <p className="text-xs text-rose-100/90 mt-1">
                    起点：{loveAnniversary.date} · 下次纪念日还有{' '}
                    <span className="font-bold text-white underline">
                      {loveAnniversary.daysRemaining} 天
                    </span>
                  </p>
                </div>

                {onNavigateToDraw && hasPartner && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToDraw();
                    }}
                    className="px-3.5 py-2 rounded-2xl bg-white text-rose-600 text-xs font-bold shadow-md hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1 shrink-0"
                  >
                    <Gift className="w-3.5 h-3.5 text-rose-500" />
                    <span>为TA抽礼</span>
                  </button>
                )}
              </div>

              {/* Background Glow */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            </div>
          )}

          {/* Action Bar & View Switcher */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>日历视图</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>倒数清单</span>
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-rose-300" />
              <span>新增纪念日</span>
            </button>
          </div>

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <CalendarView
              upcomingList={upcomingList}
              onSelectAnniversary={(ann) => handleEdit(ann)}
              onNavigateToDraw={() => {
                onClose();
                if (onNavigateToDraw) onNavigateToDraw();
              }}
            />
          )}

          {/* Anniversary List View */}
          {viewMode === 'list' && (upcomingList.length === 0 ? (
            <div className="py-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 p-6">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">还没有设定任何纪念日或节日</p>
              <button
                onClick={handleAdd}
                className="mt-3 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold shadow-xs"
              >
                立即设定第一个纪念日
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingList.map((ann) => {
                const icon = getAnniversaryIcon(ann);
                const isComingSoon = ann.daysRemaining <= 15;
                const isToday = ann.daysRemaining === 0;

                return (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isToday
                        ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-200 shadow-sm'
                        : isComingSoon
                        ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
                          {icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                              {ann.title}
                            </h5>
                            {ann.isRepeatYearly && (
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md">
                                每年
                              </span>
                            )}
                            {ann.targetPerson === 'partner' && (
                              <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-200">
                                为TA准备
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>日期：{ann.date}</span>
                            <span>·</span>
                            <span>下次：{ann.nextDate}</span>
                          </div>

                          {ann.notes && (
                            <p className="text-[11px] text-slate-500 mt-1.5 bg-slate-50/80 p-2 rounded-xl border border-slate-100 leading-relaxed">
                              💡 {ann.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Countdown Box & Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div
                          className={`text-right px-2.5 py-1 rounded-xl ${
                            isToday
                              ? 'bg-rose-500 text-white font-extrabold'
                              : isComingSoon
                              ? 'bg-amber-100/90 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isToday ? (
                            <span className="text-xs font-black tracking-wide">就是今天 🎉</span>
                          ) : (
                            <div className="text-xs font-bold leading-none">
                              还剩{' '}
                              <span className="text-sm sm:text-base font-black text-rose-500 tabular-nums">
                                {ann.daysRemaining}
                              </span>{' '}
                              天
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {onNavigateToDraw && hasPartner && isComingSoon && (
                            <button
                              onClick={() => {
                                onClose();
                                onNavigateToDraw();
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-semibold border border-rose-200 transition-colors"
                              title="为TA抽选心愿礼物"
                            >
                              抽选礼物
                            </button>
                          )}

                          <button
                            onClick={() => handleEdit(ann)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="编辑"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(ann.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation Box */}
                    {confirmDeleteId === ann.id && (
                      <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-700 animate-in fade-in duration-100">
                        <span>确定要删除这个纪念日吗？</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleDelete(ann.id)}
                            className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-semibold"
                          >
                            确认删除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <p className="text-[11px] text-slate-400">
            当纪念日临近设定的提醒天数时，系统会在首页显著提醒准备心愿好礼
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            完成
          </button>
        </div>
      </div>

      {/* Edit Modal Nested */}
      <AddEditAnniversaryModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingAnniversary(null);
        }}
        anniversaryToEdit={editingAnniversary}
      />
    </div>
  );
};
