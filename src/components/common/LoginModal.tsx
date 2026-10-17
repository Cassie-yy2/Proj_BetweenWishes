import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  UserCheck,
  Calendar,
  Heart,
  Sparkles,
  LogIn,
  CheckCircle,
  Bell,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, loginUser, registerOrSwitchUser, giftReminderDays, setGiftReminderDays } = useApp();

  const [activeTab, setActiveTab] = useState<'switch' | 'new'>('switch');
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [birthday, setBirthday] = useState<string>(currentUser.birthday || '');
  const [reminderDays, setReminderDays] = useState<number>(giftReminderDays || 5);

  // New user form state
  const [newNickname, setNewNickname] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newBirthday, setNewBirthday] = useState('');

  if (!isOpen) return null;

  const handleSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(selectedUserId, { birthday: birthday.trim() || undefined });
    setGiftReminderDays(reminderDays);
    onClose();
  };

  const handleNewUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname.trim() || !newUsername.trim()) return;

    registerOrSwitchUser({
      nickname: newNickname.trim(),
      username: newUsername.trim(),
      birthday: newBirthday.trim() || undefined,
    });
    setGiftReminderDays(reminderDays);
    onClose();
  };

  const handleSelectUser = (uId: string) => {
    setSelectedUserId(uId);
    const target = users.find((u) => u.id === uId);
    if (target) {
      setBirthday(target.birthday || '');
      setReminderDays(target.giftReminderDays || 5);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">情侣登录 / 切换账号</h3>
              <p className="text-[11px] text-slate-400">心愿之间 · 专属情侣送礼与心愿守护</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'switch'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            体验账号快速登录
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'new'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            新账号注册 / 登入
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'switch' ? (
            <form onSubmit={handleSwitchSubmit} className="space-y-4">
              {/* Account list selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  选择登录的账号视角
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {users.map((u) => {
                    const isSelected = u.id === selectedUserId;
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleSelectUser(u.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.nickname}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800 truncate">{u.nickname}</span>
                              <span className="text-[10px] text-slate-400 font-mono">@{u.username}</span>
                              {u.id === 'u_xiaotao' && (
                                <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.2 rounded-full font-semibold">
                                  主人设
                                </span>
                              )}
                              {u.id === 'u_yiche' && (
                                <span className="text-[9px] bg-sky-100 text-sky-600 px-1.5 py-0.2 rounded-full font-semibold">
                                  送礼伴侣
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {u.birthday ? `🎂 生日: ${u.birthday}` : '尚未填写生日'}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Birthday Input Field (User Requirement: 选填生日（备注仅供送礼提醒）) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>你的生日</span>
                    <span className="text-[11px] font-normal text-rose-500">
                      （选填，仅供送礼提醒）
                    </span>
                  </label>
                  {birthday && (
                    <button
                      type="button"
                      onClick={() => setBirthday('')}
                      className="text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      清空
                    </button>
                  )}
                </div>

                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  💡 填写生日后，系统会在每年生日前自动向伴侣发出准备礼物弹窗提醒，并严格对礼物抽选内容保密。
                </p>
              </div>

              {/* Reminder Advance Days Setting */}
              <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-rose-500" />
                  <span>节日 / 生日备礼提醒时机</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[3, 5, 7, 10, 15].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setReminderDays(d)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        reminderDays === d
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      {d === 5 ? '提前 5 天 (默认)' : `提前 ${d} 天`}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">
                  当节日或伴侣生日进入设定天数倒计时时，首页将自动弹窗提醒备礼。
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs transition-colors"
                >
                  确认登录
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNewUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  昵称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="例如: 暖暖、阿哲"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  账号用户名 (英文字符) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="例如: nuannuan (用于伴侣搜索绑定)"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                />
              </div>

              {/* Birthday Input Field */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>你的生日</span>
                  <span className="text-[11px] font-normal text-rose-500">
                    （选填，仅供送礼提醒）
                  </span>
                </label>
                <input
                  type="date"
                  value={newBirthday}
                  onChange={(e) => setNewBirthday(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  选填生日仅用于为绑定的伴侣提供送礼节点提醒，保密你的心愿礼物内容。
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs transition-colors"
                >
                  创建并登录
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
