import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    updateUserProfile,
    deactivateAccount,
    reactivateAccount,
    exportUserData,
    resetAllDemoData,
  } = useApp();

  const [searchEnabled, setSearchEnabled] = useState(currentUser.searchEnabled);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  if (!isOpen) return null;

  const handleToggleSearch = (val: boolean) => {
    setSearchEnabled(val);
    updateUserProfile({ searchEnabled: val });
  };

  const handleExport = () => {
    exportUserData();
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleDeactivate = () => {
    deactivateAccount();
    setShowDeactivateConfirm(false);
  };

  const handleReactivate = () => {
    reactivateAccount();
  };

  const handleResetData = () => {
    resetAllDemoData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                隐私与账号设置
              </h3>
              <p className="text-xs text-slate-400">
                管理个人隐私、备份与停用状态
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Deactivation Banner if deactivated */}
          {currentUser.deactivatedAt ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>账号处于 30 天停用期</span>
                </span>
                <span className="text-[11px] text-rose-600">
                  {new Date(currentUser.deactivatedAt).toLocaleDateString()} 申请
                </span>
              </div>
              <p className="text-rose-700 leading-relaxed">
                停用期间，你的所有心愿已被隐藏且不可被抽选。期满后账号将自动删除。在 30 天内你可以随时点击下方按钮一键恢复。
              </p>
              <button
                onClick={handleReactivate}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
              >
                立即恢复正常账号
              </button>
            </div>
          ) : null}

          {/* Privacy Switch: Searchability */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>允许通过用户名搜索我</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                开启后，其他用户可通过输入 @{currentUser.username} 向你发送绑定邀请
              </p>
            </div>
            <button
              onClick={() => handleToggleSearch(!searchEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                searchEnabled ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  searchEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Data Export */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>数据完整导出备份</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                将你的心愿清单、避雷项目与送礼历史打包为 JSON 格式下载保存
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors shrink-0"
            >
              立即导出
            </button>
          </div>
          {exportNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>数据导出文件已开始下载！</span>
            </div>
          )}

          {/* Reset Demo Data */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>重置演示数据</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                恢复系统最初的演示用户 (小桃/阿澈/星辰) 及示例心愿
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 transition-colors shrink-0"
            >
              重置
            </button>
          </div>

          {/* Account Deactivation / Cancellation */}
          {!currentUser.deactivatedAt && (
            <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-rose-600">注销账号 / 申请停用</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  设置 30 天停用缓冲期，期间可随时重新登录恢复
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateConfirm(true)}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium px-3 py-1.5 rounded-xl hover:bg-rose-100/60 transition-colors shrink-0"
              >
                申请注销
              </button>
            </div>
          )}
        </div>

        {/* Deactivate confirmation modal */}
        {showDeactivateConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 rounded-2xl bg-rose-50">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">确认申请注销账号？</h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                按照产品规则，账号注销将设置 <strong>30 天停用缓冲期</strong>。停用期间，你的所有心愿将立即对伴侣隐藏并不再参与抽选。30 天内重新登录即可无损恢复。
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  再想想
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  确认进入停用期
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
              <h4 className="text-sm font-bold text-slate-800">确认重置所有体验数据？</h4>
              <p className="text-xs text-slate-500">
                重置后将清除你在本次会话中新增的心愿、抽选进度与通知，恢复为初始默认演示数据。
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  取消
                </button>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl"
                >
                  确定重置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
