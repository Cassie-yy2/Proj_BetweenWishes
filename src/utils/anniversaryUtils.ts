import { Anniversary, UpcomingAnniversary, AnniversaryType } from '../types';

export interface AnniversaryPreset {
  type: AnniversaryType;
  title: string;
  defaultMonthDay?: string; // MM-DD
  isRepeatYearly: boolean;
  targetPerson?: string;
  icon: string;
  badgeColor: string;
  suggestedNotes: string;
}

export const ANNIVERSARY_PRESETS: AnniversaryPreset[] = [
  {
    type: 'love_anniversary',
    title: '恋爱纪念日',
    isRepeatYearly: true,
    targetPerson: 'both',
    icon: '💕',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    suggestedNotes: '记录我们在一起的珍贵时刻，每年都要浪漫庆祝',
  },
  {
    type: 'birthday',
    title: 'TA的生日',
    isRepeatYearly: true,
    targetPerson: 'partner',
    icon: '🎂',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    suggestedNotes: '最重要的人的生日，提前从心愿单里抽取惊喜礼物',
  },
  {
    type: 'birthday',
    title: '我的生日',
    isRepeatYearly: true,
    targetPerson: 'me',
    icon: '🎉',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    suggestedNotes: '属于自己的特别日子，期待被用心守护与惊喜',
  },
  {
    type: 'holiday',
    title: '情人节 (2.14)',
    defaultMonthDay: '02-14',
    isRepeatYearly: true,
    targetPerson: 'both',
    icon: '🍫',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    suggestedNotes: '情人节约会，准备巧克力和心愿心意',
  },
  {
    type: 'holiday',
    title: '妇女节 / 女神节 (3.8)',
    defaultMonthDay: '03-08',
    isRepeatYearly: true,
    targetPerson: 'partner',
    icon: '🌸',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    suggestedNotes: '3.8 女神节，给心爱的她送上温柔鲜花与心仪已久的好物',
  },
  {
    type: 'holiday',
    title: '520 告白日',
    defaultMonthDay: '05-20',
    isRepeatYearly: true,
    targetPerson: 'both',
    icon: '💌',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    suggestedNotes: '大声表达爱意的日子，赠送甜蜜惊喜',
  },
  {
    type: 'holiday',
    title: '七夕情人节',
    defaultMonthDay: '08-19', // Traditional Chinese Qixi Festival
    isRepeatYearly: true,
    targetPerson: 'both',
    icon: '🎋',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    suggestedNotes: '浪漫银河相会，互赠定情心愿信物',
  },
  {
    type: 'holiday',
    title: '圣诞节 (12.25)',
    defaultMonthDay: '12-25',
    isRepeatYearly: true,
    targetPerson: 'both',
    icon: '🎄',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    suggestedNotes: '冬日壁炉与圣诞树下的礼物拆盒时刻',
  },
  {
    type: 'custom',
    title: '自定义纪念日',
    isRepeatYearly: true,
    targetPerson: 'both',
    icon: '✨',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    suggestedNotes: '我们的专属特殊日子（初次相遇/领证/旅行约定等）',
  },
];

/**
 * Calculates upcoming occurrence, days remaining, and days elapsed for an anniversary
 */
export const calculateUpcomingAnniversary = (
  anniversary: Anniversary,
  refDate: Date = new Date()
): UpcomingAnniversary => {
  // Normalize reference date to midnight
  const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  
  // Parse date string (YYYY-MM-DD)
  const parts = anniversary.date.split('-');
  const origYear = parseInt(parts[0], 10);
  const origMonth = parseInt(parts[1], 10) - 1; // 0-indexed
  const origDay = parseInt(parts[2], 10);

  const originalDate = new Date(origYear, origMonth, origDay);

  let daysElapsed: number | undefined;
  if (anniversary.type === 'love_anniversary' || originalDate <= today) {
    const diffMs = today.getTime() - originalDate.getTime();
    daysElapsed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  let nextDateObj: Date;

  if (anniversary.isRepeatYearly) {
    // Current year's occurrence
    const currentYearDate = new Date(today.getFullYear(), origMonth, origDay);
    if (currentYearDate.getTime() >= today.getTime()) {
      nextDateObj = currentYearDate;
    } else {
      // Already passed this year, next is next year
      nextDateObj = new Date(today.getFullYear() + 1, origMonth, origDay);
    }
  } else {
    nextDateObj = originalDate;
  }

  const diffMs = nextDateObj.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const yyyy = nextDateObj.getFullYear();
  const mm = String(nextDateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(nextDateObj.getDate()).padStart(2, '0');
  const nextDate = `${yyyy}-${mm}-${dd}`;

  return {
    ...anniversary,
    nextDate,
    daysRemaining: Math.max(0, daysRemaining),
    daysElapsed,
  };
};

export const getAnniversaryIcon = (anniversary: Anniversary): string => {
  const preset = ANNIVERSARY_PRESETS.find(
    (p) => p.type === anniversary.type && p.title.includes(anniversary.title.slice(0, 2))
  );
  if (preset) return preset.icon;

  switch (anniversary.type) {
    case 'love_anniversary':
      return '💕';
    case 'birthday':
      return '🎂';
    case 'holiday':
      return '🎁';
    default:
      return '✨';
  }
};

/**
 * Standard couple holidays that should always be auto-annotated on the calendar:
 * 圣诞节, 七夕, 情人节, 520, 妇女节
 */
export const BUILTIN_COUPLE_HOLIDAYS: Omit<Anniversary, 'userId' | 'createdAt'>[] = [
  {
    id: 'holiday_valentines',
    title: '西洋情人节 🍫',
    type: 'holiday',
    date: '2026-02-14',
    isRepeatYearly: true,
    remindDaysAhead: 5,
    targetPerson: 'both',
    notes: '2.14 情人节，准备鲜花、心愿礼物与浓情巧克力',
  },
  {
    id: 'holiday_womens_day',
    title: '妇女节 / 女神节 🌸',
    type: 'holiday',
    date: '2026-03-08',
    isRepeatYearly: true,
    remindDaysAhead: 5,
    targetPerson: 'partner',
    notes: '3.8 女神节，给心爱的她送上温柔鲜花与心仪好物',
  },
  {
    id: 'holiday_520',
    title: '520 告白日 💌',
    type: 'holiday',
    date: '2026-05-20',
    isRepeatYearly: true,
    remindDaysAhead: 5,
    targetPerson: 'both',
    notes: '520 甜蜜告白日，大声表达爱意并赠送心愿好礼',
  },
  {
    id: 'holiday_qixi',
    title: '七夕情人节 🎋',
    type: 'holiday',
    date: '2026-08-19',
    isRepeatYearly: true,
    remindDaysAhead: 5,
    targetPerson: 'both',
    notes: '浪漫中国传统七夕情人节，鹊桥相会互赠定情心愿信物',
  },
  {
    id: 'holiday_christmas',
    title: '圣诞节 🎄',
    type: 'holiday',
    date: '2026-12-25',
    isRepeatYearly: true,
    remindDaysAhead: 5,
    targetPerson: 'both',
    notes: '温馨冬日圣诞节，壁炉圣诞树下互拆惊喜心愿礼盒',
  },
];

/**
 * Returns a concise tag for calendar cells to clearly highlight special days
 */
export const getHolidayShortLabel = (title: string): string => {
  if (title.includes('情人节') && !title.includes('七夕')) return '情人节';
  if (title.includes('妇女') || title.includes('女神') || title.includes('3.8')) return '妇女节';
  if (title.includes('520')) return '520';
  if (title.includes('七夕')) return '七夕';
  if (title.includes('圣诞')) return '圣诞';
  if (title.includes('生日')) return '生日';
  if (title.includes('纪念日') || title.includes('相恋')) return '纪念日';
  return '';
};
