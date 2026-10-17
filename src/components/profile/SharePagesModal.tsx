import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Plus, Copy, Check, Trash2, Eye, EyeOff, X, Sparkles } from 'lucide-react';

interface SharePagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePagesModal: React.FC<SharePagesModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    sharePages,
    wishes,
    createSharePage,
    updateSharePage,
    deleteSharePage,
    getBoundUsers,
  } = useApp();

  const boundUsers = getBoundUsers();
  const myWishes = wishes.filter((w) => w.userId === currentUser.id);
  const myPages = sharePages.filter((p) => p.userId === currentUser.id);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWishIds, setSelectedWishIds] = useState<string[]>(myWishes.map((w) => w.id));
  const [authorizedUserIds, setAuthorizedUserIds] = useState<string[]>(boundUsers.map((u) => u.id));
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createSharePage(title.trim(), description.trim(), selectedWishIds, authorizedUserIds);
    setTitle('');
    setDescription('');
    setIsCreating(false);
  };

  const handleCopyLink = (code: string) => {
    const url = `https://wishes.me/share/${code}`;
    navigator.clipboard?.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                心愿分享单管理
              </h3>
              <p className="text-xs text-slate-400">
                按场景打包心愿，分享给伴侣/TA
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/40 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>创建新的专属心愿分享单</span>
            </button>
          )}

          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">新建分享专页</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  取消
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  清单专页名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：小桃的秋冬温暖心愿、2026生日心愿单..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  寄语说明 (选填)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="如：挑选了一些想要的小物件，供挑礼物参考~"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              {/* Select which wishes to include */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  挑选纳入本分享页的心愿 ({selectedWishIds.length}/{myWishes.length})
                </label>
                <div className="space-y-1 max-h-36 overflow-y-auto bg-white p-2 rounded-xl border border-slate-200">
                  {myWishes.map((w) => {
                    const isChecked = selectedWishIds.includes(w.id);
                    return (
                      <label
                        key={w.id}
                        className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedWishIds(selectedWishIds.filter((id) => id !== w.id));
                            } else {
                              setSelectedWishIds([...selectedWishIds, w.id]);
                            }
                          }}
                          className="rounded text-rose-500"
                        />
                        <span className="truncate flex-1 font-medium text-slate-700">{w.title}</span>
                        {w.price !== undefined && (
                          <span className="text-[11px] text-rose-600 tabular-nums">¥{w.price}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs"
                >
                  确认生成分享页
                </button>
              </div>
            </form>
          )}

          {/* List of my share pages */}
          <div className="space-y-3">
            {myPages.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                暂未创建独立分享页，可点击上方按钮创建
              </p>
            ) : (
              myPages.map((page) => (
                <div
                  key={page.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{page.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full border ${
                          page.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {page.isActive ? '开放中' : '已关闭'}
                      </span>
                    </h4>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateSharePage(page.id, { isActive: !page.isActive })
                        }
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        title={page.isActive ? '关闭此分享页' : '重新开启'}
                      >
                        {page.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => deleteSharePage(page.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-slate-100"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {page.description && (
                    <p className="text-xs text-slate-500">{page.description}</p>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>包含 {page.wishIds.length} 个精选心愿</span>
                    <button
                      onClick={() => handleCopyLink(page.shareCode)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      {copiedCode === page.shareCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>已复制分享链接</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制分享卡片链接</span>
                        </>
                      )}
                    </button>
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
