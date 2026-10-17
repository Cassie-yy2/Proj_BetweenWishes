import React, { useState, useEffect } from 'react';
import { Anniversary, AnniversaryType } from '../../types';
import { useApp } from '../../context/AppContext';
import { ANNIVERSARY_PRESETS } from '../../utils/anniversaryUtils';
import {
  X,
  Calendar,
  Heart,
  Sparkles,
  Gift,
  Bell,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AddEditAnniversaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  anniversaryToEdit?: Anniversary | null;
}

export const AddEditAnniversaryModal: React.FC<AddEditAnniversaryModalProps> = ({
  isOpen,
  onClose,
  anniversaryToEdit,
}) => {
  const { addAnniversary, updateAnniversary, currentUser, getBoundUsers } = useApp();
  const boundPartners = getBoundUsers();
  const partnerName = boundPartners[0]?.nickname || '另一半';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<AnniversaryType>('love_anniversary');
  const [date, setDate] = useState('2024-05-20');
  const [isRepeatYearly, setIsRepeatYearly] = useState(true);
  const [remindDaysAhead, setRemindDaysAhead] = useState(15);
  const [targetPerson, setTargetPerson] = useState<'partner' | 'me' | 'both'>('both');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (anniversaryToEdit) {
      setTitle(anniversaryToEdit.title);
      setType(anniversaryToEdit.type);
      setDate(anniversaryToEdit.date);
      setIsRepeatYearly(anniversaryToEdit.isRepeatYearly);
      setRemindDaysAhead(anniversaryToEdit.remindDaysAhead || 15);
      setTargetPerson((anniversaryToEdit.targetPerson as any) || 'both');
      setNotes(anniversaryToEdit.notes || '');
    } else {
      // Default reset
      setTitle('我们在一起的纪念日 💕');
      setType('love_anniversary');
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      setDate(`${y}-${m}-${d}`);
      setIsRepeatYearly(true);
      setRemindDaysAhead(15);
      setTargetPerson('both');
      setNotes('记录彼此心动的起点，每年都要浪漫庆祝~');
    }
    setError('');
  }, [anniversaryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof ANNIVERSARY_PRESETS[0]) => {
    let newTitle = preset.title;
    if (preset.title === 'TA的生日') {
      newTitle = `${partnerName}的生日 🎂`;
    }
    setTitle(newTitle);
    setType(preset.type);
    setIsRepeatYearly(preset.isRepeatYearly);
    setTargetPerson((preset.targetPerson as any) || 'both');
    setNotes(preset.suggestedNotes);

    const now = new Date();
    const curYear = now.getFullYear();

    if (preset.defaultMonthDay) {
      setDate(`${curYear}-${preset.defaultMonthDay}`);
    } else if (preset.type === 'love_anniversary') {
      // Default to 1-2 years ago for demo
      setDate(`${curYear - 1}-05-20`);
    } else if (preset.type === 'birthday') {
      setDate(`${curYear}-11-05`);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('请输入纪念日名称');
      return;
    }
    if (!date) {
      setError('请选择纪念日日期');
      return;
    }

    if (anniversaryToEdit) {
      updateAnniversary(anniversaryToEdit.id, {
        title: title.trim(),
        type,
        date,
        isRepeatYearly,
        remindDaysAhead,
        targetPerson,
        notes: notes.trim(),
      });
    } else {
      addAnniversary({
        title: title.trim(),
        type,
        date,
        isRepeatYearly,
        remindDaysAhead,
        targetPerson,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {anniversaryToEdit ? '编辑纪念日' : '设定心动纪念日 & 节日'}
              </h3>
              <p className="text-[11px] text-slate-500">
                记录恋爱里程碑、生日与情人节，提前备好惊喜心意
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Presets Carousel */}
          {!anniversaryToEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>快捷预设模版</span>
                <span className="text-[10px] text-rose-500 font-normal">点击快速填充常用节日</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ANNIVERSARY_PRESETS.map((p) => {
                  const isMatch = title.includes(p.title.slice(0, 3));
                  return (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-1.5 ${
                        isMatch
                          ? 'border-rose-400 bg-rose-50 text-rose-700 font-semibold ring-1 ring-rose-300'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{p.icon}</span>
                      <span className="truncate">{p.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              纪念日名称 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：相恋一周年、阿澈的生日、情人节"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              maxLength={30}
            />
          </div>

          {/* Category & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">纪念日类型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AnniversaryType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              >
                <option value="love_anniversary">恋爱纪念日 (在一起的日子)</option>
                <option value="birthday">生日 (TA或我的生日)</option>
                <option value="holiday">法定 / 浪漫节日 (情人节/圣诞等)</option>
                <option value="custom">其他专属纪念日</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                目标日期 <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              />
            </div>
          </div>

          {/* Repeat Yearly & Target person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">每年重复提醒</div>
                <div className="text-[10px] text-slate-500">按年自动循环倒数与备忘</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRepeatYearly}
                  onChange={(e) => setIsRepeatYearly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">关联提醒对象</label>
              <select
                value={targetPerson}
                onChange={(e) => setTargetPerson(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              >
                <option value="both">双方共同庆祝 (情侣节日/相恋纪念)</option>
                <option value="partner">主要为 TA 准备 (TA的生日/送礼备忘)</option>
                <option value="me">属于我自己的日子 (我的生日)</option>
              </select>
            </div>
          </div>

          {/* Remind Days Ahead */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>提前送礼备忘天数</span>
              </span>
              <span className="text-[11px] text-slate-500">
                提前 <span className="font-bold text-rose-500">{remindDaysAhead}</span> 天提示
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 7, 15, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setRemindDaysAhead(days)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                    remindDaysAhead === days
                      ? 'border-rose-400 bg-rose-50 text-rose-600 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  提前{days}天
                </button>
              ))}
            </div>
          </div>

          {/* Notes & Gifting Inspiration */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>备忘记录 / 送礼心愿灵感</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="写下你们的浪漫约定、心仪礼物方向或约会餐厅计划..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              maxLength={200}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-rose-300" />
              <span>{anniversaryToEdit ? '保存修改' : '确认设定'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
