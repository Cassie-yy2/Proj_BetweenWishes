import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  X,
  AlertTriangle,
  Link as LinkIcon,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface ManageBindingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageBindingsModal: React.FC<ManageBindingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    users,
    bindings,
    sendBindingInvite,
    unbind,
  } = useApp();

  const [searchAccount, setSearchAccount] = useState('');
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [bindingToUnbind, setBindingToUnbind] = useState<string | null>(null);
  const [retainHistoryChoice, setRetainHistoryChoice] = useState(true);

  if (!isOpen) return null;

  // Active bindings
  const myBindings = bindings.filter(
    (b) =>
      (b.requesterId === currentUser.id || b.targetId === currentUser.id) &&
      b.status === 'accepted'
  );

  const pendingSentInvites = bindings.filter(
    (b) => b.requesterId === currentUser.id && b.status === 'pending'
  );

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAccount.trim()) return;

    const res = sendBindingInvite(searchAccount.trim());
    setInviteResult(res);
    if (res.success) {
      setSearchAccount('');
    }
  };

  const handleCopyInviteLink = () => {
    const link = `https://wishes.me/invite?u=${currentUser.username}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmUnbind = () => {
    if (!bindingToUnbind) return;
    unbind(bindingToUnbind, retainHistoryChoice);
    setBindingToUnbind(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                情侣绑定管理
              </h3>
              <p className="text-xs text-slate-400">
                建立专属情侣心愿守护，各自独立授权与保密
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

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Send invite by username */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-rose-500" />
              <span>搜索伴侣账号发送情侣绑定邀请</span>
            </h4>
            {myBindings.length > 0 ? (
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-rose-700 flex items-center gap-1.5">
                  <span>已绑定伴侣</span>
                  <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-normal">情侣 1 对 1</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  每个人只能绑定 1 位伴侣。若需绑定新伴侣，请先在下方解除当前绑定关系。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="flex gap-2">
                <input
                  type="text"
                  value={searchAccount}
                  onChange={(e) => setSearchAccount(e.target.value)}
                  placeholder="输入伴侣用户名或昵称 (例如: yiche, xingchen)"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors shrink-0"
                >
                  发送邀请
                </button>
              </form>
            )}

            {inviteResult && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-1.5 ${
                  inviteResult.success
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span>{inviteResult.message}</span>
              </div>
            )}

            {/* Quick Share Link */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] text-slate-400">或直接分享你的专属邀请链接：</span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="text-[11px] font-medium text-rose-600 hover:underline flex items-center gap-1"
              >
                {copiedLink ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? '已复制邀请链接' : '复制专属邀请链接'}</span>
              </button>
            </div>
          </div>

          {/* Pending invites sent */}
          {pendingSentInvites.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">待对方接受的邀请 ({pendingSentInvites.length})</h4>
              <div className="space-y-1.5">
                {pendingSentInvites.map((inv) => {
                  const target = users.find((u) => u.id === inv.targetId);
                  return (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {target && (
                          <img
                            src={target.avatar}
                            alt={target.nickname}
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="font-semibold text-slate-800">{target?.nickname}</span>
                        <span className="text-slate-400 text-[10px]">(@{target?.username})</span>
                      </div>
                      <span className="text-amber-700 text-[11px] font-medium">等待确认中 (7天有效)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Bindings List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700">
                {myBindings.length > 0 ? '已绑定伴侣' : '未绑定伴侣'}
              </h4>
              <span className="text-[11px] text-slate-400">
                {myBindings.length > 0 ? '唯一情侣绑定中' : '暂无绑定伴侣'}
              </span>
            </div>
            {myBindings.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">暂未绑定伴侣</p>
            ) : (
              <div className="space-y-2">
                {myBindings.map((binding) => {
                  const partnerId =
                    binding.requesterId === currentUser.id ? binding.targetId : binding.requesterId;
                  const partner = users.find((u) => u.id === partnerId);
                  if (!partner) return null;

                  return (
                    <div
                      key={binding.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={partner.avatar}
                          alt={partner.nickname}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {partner.nickname}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            @{partner.username} · {partner.bio}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setBindingToUnbind(binding.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 font-medium"
                      >
                        解除绑定
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Unbind Consequences Confirmation Modal */}
        {bindingToUnbind && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 rounded-2xl bg-rose-50">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">确认解除绑定？</h4>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 space-y-1.5 leading-relaxed">
                <p className="font-semibold">⚠️ 关系解除须知（单方面生效）：</p>
                <ul className="list-disc list-inside space-y-1 text-amber-900">
                  <li>解除后将立即终止双方之间所有未完成的送礼流程；</li>
                  <li>对应已锁定的心愿将立即解除锁定，重回清单；</li>
                  <li>对方会收到解绑站内通知。</li>
                </ul>
              </div>

              {/* History retention option */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-700">
                <input
                  type="checkbox"
                  id="retainHist"
                  checked={retainHistoryChoice}
                  onChange={(e) => setRetainHistoryChoice(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <label htmlFor="retainHist" className="cursor-pointer">
                  在我的「送礼历史」中保留过往共同送礼记录
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setBindingToUnbind(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmUnbind}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  确定解除绑定
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
