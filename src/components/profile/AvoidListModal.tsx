import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvoidItem } from '../../types';
import { ShieldAlert, Plus, Trash2, X, Bell } from 'lucide-react';

interface AvoidListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  '过敏与饮食禁忌',
  '物品与气味忌讳',
  '穿搭与风格色彩',
  '材质与工艺排斥',
  '其他避雷项',
];

export const AvoidListModal: React.FC<AvoidListModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, avoidLists, addAvoidItem, deleteAvoidItem, getBoundUsers } = useApp();

  const boundUsers = getBoundUsers();
  const myAvoidItems = avoidLists.filter((item) => item.userId === currentUser.id);

  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [reason, setReason] = useState('');
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>(boundUsers.map((u) => u.id));
  const [notifyUsers, setNotifyUsers] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addAvoidItem(
      {
        category,
        content: content.trim(),
        reason: reason.trim() || undefined,
        allowedUserIds,
      },
      notifyUsers
    );

    setContent('');
    setReason('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                我的避雷清单
              </h3>
              <p className="text-xs text-slate-500">
                写下你的过敏与不喜好，帮伴侣送礼精准排雷
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list & Add form */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Top add trigger */}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/40 text-amber-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>添加一条避雷项</span>
            </button>
          )}

          {/* Add Item Form */}
          {isAdding && (
            <form onSubmit={handleSave} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">新增避雷事项</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  取消
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  避雷类别
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  具体忌讳 / 不喜欢的内容 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="如：坚果严重过敏、不喜欢浓郁香精、不收特定粉色衣服..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  原因或补充说明 (选填)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="如：容易皮肤起疹子、气味敏感头晕"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              {/* Authorized viewers */}
              {boundUsers.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    指定已绑定伴侣可见此项
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {boundUsers.map((bu) => {
                      const isAllowed = allowedUserIds.includes(bu.id);
                      return (
                        <button
                          key={bu.id}
                          type="button"
                          onClick={() => {
                            if (isAllowed) {
                              setAllowedUserIds(allowedUserIds.filter((id) => id !== bu.id));
                            } else {
                              setAllowedUserIds([...allowedUserIds, bu.id]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                            isAllowed
                              ? 'bg-amber-100 text-amber-800 border-amber-300 font-medium'
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          {bu.nickname}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notify option */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="notifyAvoid"
                  checked={notifyUsers}
                  onChange={(e) => setNotifyUsers(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <label htmlFor="notifyAvoid" className="flex items-center gap-1 cursor-pointer">
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>更新后通知TA / 伴侣</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  保存避雷项
                </button>
              </div>
            </form>
          )}

          {/* List of my items */}
          <div className="space-y-2.5">
            {myAvoidItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                尚未记录任何避雷事项，添加一些让伴侣了解你的喜好与忌讳吧~
              </p>
            ) : (
              myAvoidItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <button
                      onClick={() => deleteAvoidItem(item.id)}
                      className="text-slate-300 hover:text-rose-500 p-1"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {item.content}
                  </p>

                  {item.reason && (
                    <p className="text-[11px] text-slate-400">
                      理由：{item.reason}
                    </p>
                  )}

                  <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                    <span>
                      授权可见：
                      {item.allowedUserIds.length === 0
                        ? '已绑定伴侣'
                        : `${item.allowedUserIds.length} 位伴侣`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
