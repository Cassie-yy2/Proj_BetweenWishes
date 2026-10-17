import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { avatarXiaotao, avatarYiche, avatarXingchen } from '../../data/mockData';
import { X, UserCheck } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [nickname, setNickname] = useState(currentUser.nickname);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [birthday, setBirthday] = useState(currentUser.birthday || '');

  if (!isOpen) return null;

  const AVATAR_PRESETS = [
    { label: '小桃', url: avatarXiaotao },
    { label: '阿澈', url: avatarYiche },
    { label: '星辰', url: avatarXingchen },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    updateUserProfile({
      nickname: nickname.trim(),
      username: username.trim(),
      bio: bio.trim(),
      avatar: customAvatarUrl.trim() || avatar,
      birthday: birthday.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
          <h3 className="text-base font-bold text-slate-800">编辑个人资料</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              选择头像
            </label>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={customAvatarUrl.trim() || avatar}
                alt="当前头像"
                className="w-16 h-16 rounded-full object-cover border-2 border-rose-300 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="flex items-center gap-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatar(preset.url);
                      setCustomAvatarUrl('');
                    }}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === preset.url && !customAvatarUrl
                        ? 'border-rose-500 ring-2 ring-rose-200'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={customAvatarUrl}
              onChange={(e) => setCustomAvatarUrl(e.target.value)}
              placeholder="或粘贴自定义头像图片网址..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              昵称 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              用户名 (用于邀请搜索)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              你的生日 <span className="text-slate-400 font-normal">（选填，仅供送礼提醒）</span>
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              选填生日将自动同步到情侣纪念日历，并在生日前向伴侣发送准备礼物提醒。
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              个性签名 / 简介
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
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
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs"
            >
              保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
