import React, { useState } from 'react';
import { Wish } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface WishCardProps {
  wish: Wish;
  viewMode: 'grid' | 'list';
  onEdit: (wish: Wish) => void;
}

export const WishCard: React.FC<WishCardProps> = ({ wish, viewMode, onEdit }) => {
  const { deleteWish, isWishLocked } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isDrawn = isWishLocked(wish.id);

  const priorityLabels = {
    high: { label: '高优先', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
    medium: { label: '中优先', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
    low: { label: '随缘', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  };

  const priorityConfig = priorityLabels[wish.priority] || priorityLabels.medium;

  const handleDelete = () => {
    deleteWish(wish.id);
    setShowDeleteConfirm(false);
  };

  // Image fallback
  const mainImage =
    wish.images && wish.images.length > 0
      ? wish.images[0]
      : 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80';

  if (viewMode === 'list') {
    return (
      <div className="relative p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-200 transition-all shadow-xs flex items-center justify-between gap-3 group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
            <img
              src={mainImage}
              alt={wish.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${priorityConfig.bg}`}>
                {priorityConfig.label}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{wish.category}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 truncate mt-0.5">
              {wish.title}
            </h4>
            <div className="flex items-center gap-2 text-xs mt-1 text-slate-500">
              {wish.price !== undefined && (
                <span className="font-semibold text-rose-600 tabular-nums">
                  ¥{wish.price}
                </span>
              )}
              {wish.specs && (
                <span className="text-slate-400 truncate max-w-[140px]">
                  {wish.specs}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(wish);
                }}
                className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                <span>编辑心愿</span>
              </button>
              {wish.url && (
                <a
                  href={wish.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>查看原链接</span>
                </a>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteConfirm(true);
                }}
                className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>删除心愿</span>
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmationDialog
            isDrawn={isDrawn}
            wishTitle={wish.title}
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    );
  }

  // Card Grid View
  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/80 hover:border-rose-200 transition-all shadow-xs overflow-hidden flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={mainImage}
          alt={wish.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Priority & Category tags */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-xs ${priorityConfig.bg} bg-white/90`}>
            {priorityConfig.label}
          </span>
          <span className="text-[10px] text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
            {wish.category}
          </span>
        </div>

        {/* Actions Button */}
        <div className="absolute top-2.5 right-2.5">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-xs flex items-center justify-center transition-all"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(wish);
                }}
                className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                <span>编辑心愿</span>
              </button>
              {wish.url && (
                <a
                  href={wish.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>查看链接</span>
                </a>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteConfirm(true);
                }}
                className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>删除心愿</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
              {wish.title}
            </h4>
          </div>

          {/* Price & specs */}
          <div className="flex items-center gap-2 text-xs mt-1">
            {wish.price !== undefined ? (
              <span className="font-bold text-rose-600 text-sm tabular-nums">
                ¥{wish.price}
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">价格待定</span>
            )}
            {wish.specs && (
              <span className="text-slate-400 text-[11px] truncate">
                · {wish.specs}
              </span>
            )}
          </div>

          {/* Note preview */}
          {wish.note && (
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              {wish.note}
            </p>
          )}
        </div>

        {/* Footer info: deadline & quantity */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>{wish.quantity > 1 ? `希望收到: ${wish.quantity}件` : '数量: 1'}</span>
          {wish.deadline && (
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{wish.deadline.slice(5, 10)} 截止</span>
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationDialog
          isDrawn={isDrawn}
          wishTitle={wish.title}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

interface DeleteDialogProps {
  isDrawn: boolean;
  wishTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteDialogProps> = ({
  isDrawn,
  wishTitle,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-rose-600 mb-3">
          <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">确认删除该心愿？</h4>
            <p className="text-xs text-slate-400 truncate max-w-[200px]">{wishTitle}</p>
          </div>
        </div>

        {isDrawn ? (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-800 mb-4 leading-relaxed">
            <span className="font-semibold">⚠️ 关联影响提示：</span>
            <p className="mt-1">
              该心愿正处于送礼者的抽选或购买流程中。确认删除后，系统将提前结束送礼流程并通知相关送礼者，以防对方重复准备。
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-4">
            删除后该心愿将从你的清单中移除，且不再参与伴侣的抽选。该操作无法撤回。
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-md shadow-rose-200"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};
