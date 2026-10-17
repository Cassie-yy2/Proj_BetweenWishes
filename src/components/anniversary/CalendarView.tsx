import React, { useState } from 'react';
import { UpcomingAnniversary } from '../../types';
import { getAnniversaryIcon, getHolidayShortLabel } from '../../utils/anniversaryUtils';
import { ChevronLeft, ChevronRight, Gift, Heart, CalendarDays } from 'lucide-react';

interface CalendarViewProps {
  upcomingList: UpcomingAnniversary[];
  onSelectAnniversary?: (ann: UpcomingAnniversary) => void;
  onNavigateToDraw?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  upcomingList,
  onSelectAnniversary,
  onNavigateToDraw,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const jumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
      ).padStart(2, '0')}`
    );
  };

  // Build grid for currentMonth
  // 1st day of month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map dates in format YYYY-MM-DD or MM-DD to upcoming events
  const monthStr = String(currentMonth + 1).padStart(2, '0');

  // Find events that match each day in this month
  const getEventsForDay = (day: number) => {
    const dayStr = String(day).padStart(2, '0');
    const fullDateStr = `${currentYear}-${monthStr}-${dayStr}`;
    const mmddStr = `${monthStr}-${dayStr}`;

    return upcomingList.filter((item) => {
      // Direct match on nextDate
      if (item.nextDate === fullDateStr) return true;
      // If repeated yearly, match month & day
      if (item.isRepeatYearly && item.date.slice(5) === mmddStr) return true;
      // Or exact original date
      if (item.date === fullDateStr) return true;
      return false;
    });
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const selectedEvents = selectedDateStr
    ? upcomingList.filter((item) => {
        const [, m, d] = selectedDateStr.split('-');
        const mmddStr = `${m}-${d}`;
        if (item.nextDate === selectedDateStr) return true;
        if (item.isRepeatYearly && item.date.slice(5) === mmddStr) return true;
        if (item.date === selectedDateStr) return true;
        return false;
      })
    : [];

  const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="space-y-3">
      {/* Calendar Header with Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-800">
            {currentYear}年 {currentMonth + 1}月
          </span>
          <button
            onClick={jumpToToday}
            className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold border border-rose-200/60 transition-colors"
          >
            今天
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="上个月"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="下个月"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center">
        {weekLabels.map((lbl, idx) => (
          <div
            key={lbl}
            className={`text-[11px] font-semibold py-1 ${
              idx >= 5 ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {lbl}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1 bg-slate-50/70 p-1.5 rounded-2xl border border-slate-200/60">
        {/* Leading empty cells */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-11 rounded-xl" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayStr = String(day).padStart(2, '0');
          const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDateStr;
          const dayEvents = getEventsForDay(day);
          const hasEvent = dayEvents.length > 0;
          const holidayTag = dayEvents.map((ev) => getHolidayShortLabel(ev.title)).find(Boolean);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDateStr(dateStr)}
              className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-semibold p-0.5 ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-xs scale-102 z-10'
                  : isToday
                  ? 'bg-rose-100 text-rose-700 font-bold border border-rose-300'
                  : hasEvent
                  ? 'bg-white hover:bg-rose-50 text-slate-800 border border-rose-100 shadow-2xs'
                  : 'hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <span className="leading-none">{day}</span>

              {/* Event indicator badge or holiday label */}
              {hasEvent && (
                <div className="flex flex-col items-center mt-0.5 leading-none max-w-full overflow-hidden">
                  {holidayTag ? (
                    <span
                      className={`text-[8px] font-bold px-1 rounded-sm truncate max-w-full leading-tight ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                      title={dayEvents.map((e) => e.title).join(' / ')}
                    >
                      {holidayTag}
                    </span>
                  ) : (
                    <div className="flex items-center gap-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <span
                          key={ev.id}
                          className={`text-[9px] leading-none ${
                            isSelected ? 'brightness-150' : ''
                          }`}
                          title={ev.title}
                        >
                          {getAnniversaryIcon(ev)}
                        </span>
                      ))}
                      {dayEvents.length > 2 && (
                        <span
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-rose-500'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Details Card */}
      {selectedDateStr && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-rose-500" />
              <span>{selectedDateStr} 日期备忘</span>
              {selectedDateStr === todayStr && (
                <span className="px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold">
                  今天
                </span>
              )}
            </span>
            <span className="text-[11px] text-slate-400">
              {selectedEvents.length > 0 ? `${selectedEvents.length} 个纪念事项` : '暂无纪念日'}
            </span>
          </div>

          {selectedEvents.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {selectedEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectAnniversary && onSelectAnniversary(ev)}
                  className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between gap-2 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{getAnniversaryIcon(ev)}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{ev.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {ev.type === 'love_anniversary' && ev.daysElapsed !== undefined
                          ? `相恋第 ${ev.daysElapsed} 天`
                          : ev.targetPerson
                          ? `对象: ${ev.targetPerson}`
                          : ev.date}
                        {ev.notes ? ` · ${ev.notes}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-bold text-rose-600">
                      {ev.daysRemaining === 0 ? '🎉 就是今天' : `还有 ${ev.daysRemaining} 天`}
                    </span>
                    {onNavigateToDraw && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToDraw();
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold flex items-center gap-0.5 shadow-xs"
                        title="去抽礼物"
                      >
                        <Gift className="w-3 h-3 text-rose-300" />
                        <span>抽礼</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-slate-400">
              这天暂无设定的节日或纪念日，可点击上方「+」快速添加
            </div>
          )}
        </div>
      )}
    </div>
  );
};
