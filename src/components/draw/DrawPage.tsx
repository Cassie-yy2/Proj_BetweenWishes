import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wish, GiftRecord } from '../../types';
import { triggerGiftConfetti, triggerBigCelebration } from '../../utils/confetti';
import {
  Sparkles,
  Dices,
  ShieldAlert,
  Coins,
  CheckCircle2,
  Package,
  Gift,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Calendar,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DrawPage: React.FC = () => {
  const {
    currentUser,
    getBoundUsers,
    getEligibleWishesForDraw,
    lockWishAsDrawn,
    getActiveGiftTasks,
    markPurchased,
    markSent,
    cancelGiftRecord,
    getUpcomingAnniversaries,
  } = useApp();

  const boundUsers = getBoundUsers();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    boundUsers[0]?.id || ''
  );
  const [activeSubTab, setActiveSubTab] = useState<'draw' | 'tasks'>('draw');

  // Draw parameters
  const [budgetPreset, setBudgetPreset] = useState<number | null>(null);
  const [customBudget, setCustomBudget] = useState<string>('');
  const [showAvoidListDrawer, setShowAvoidListDrawer] = useState(false);

  // Draw execution state
  const [isDrawing, setIsDrawing] = useState(false);
  const [sessionSkippedIds, setSessionSkippedIds] = useState<string[]>([]);
  const [drawnResult, setDrawnResult] = useState<Wish | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Active Task Actions state
  const [taskToPurchase, setTaskToPurchase] = useState<GiftRecord | null>(null);
  const [purchaseNoteInput, setPurchaseNoteInput] = useState('');
  const [taskToSend, setTaskToSend] = useState<GiftRecord | null>(null);
  const [taskToCancel, setTaskToCancel] = useState<GiftRecord | null>(null);

  const activeTasks = getActiveGiftTasks();

  const selectedPartner = boundUsers.find((u) => u.id === selectedPartnerId);

  // Effective budget
  const effectiveBudget =
    customBudget.trim() !== ''
      ? parseFloat(customBudget)
      : budgetPreset !== null
      ? budgetPreset
      : undefined;

  // Check eligible wishes count
  const drawEligibility = selectedPartnerId
    ? getEligibleWishesForDraw(selectedPartnerId, effectiveBudget)
    : { eligible: [], totalWishesCount: 0, avoidItems: [] };

  // Filter out session skipped
  const currentAvailableCandidates = drawEligibility.eligible.filter(
    (w) => !sessionSkippedIds.includes(w.id)
  );

  // Upcoming milestone for selected partner or couple
  const allUpcoming = getUpcomingAnniversaries();
  const partnerUpcomingAnn =
    allUpcoming.find(
      (a) =>
        a.daysRemaining <= 60 &&
        (a.targetPerson === 'both' ||
          a.title.includes(selectedPartner?.nickname || '') ||
          a.type === 'birthday' ||
          a.type === 'holiday')
    ) || allUpcoming[0];

  const executeDraw = (excludedIds: string[]) => {
    if (!selectedPartnerId) {
      alert('请先选择要送礼的绑定伴侣');
      return;
    }

    const candidates = drawEligibility.eligible.filter(
      (w) => !excludedIds.includes(w.id)
    );

    if (candidates.length === 0) {
      alert('当前没有可抽选的心愿，请检查预算筛选或是否有未锁定的心愿。');
      return;
    }

    setShowResultModal(false);
    setIsDrawing(true);
    setDrawnResult(null);

    // Gacha wobble animation for 1.3s
    setTimeout(() => {
      setIsDrawing(false);

      // Priority-weighted lottery algorithm
      // High: weight 5, Medium: weight 2, Low: weight 1
      const pool: Wish[] = [];
      candidates.forEach((w) => {
        const weight = w.priority === 'high' ? 5 : w.priority === 'medium' ? 2 : 1;
        for (let i = 0; i < weight; i++) {
          pool.push(w);
        }
      });

      const picked = pool[Math.floor(Math.random() * pool.length)];
      setDrawnResult(picked);
      setShowResultModal(true);
      triggerGiftConfetti();
    }, 1300);
  };

  const handleStartDraw = () => {
    executeDraw(sessionSkippedIds);
  };

  const handleDrawAgain = () => {
    if (!drawnResult) return;
    const nextSkipped = [...sessionSkippedIds, drawnResult.id];
    setSessionSkippedIds(nextSkipped);

    const nextCandidates = drawEligibility.eligible.filter(
      (w) => !nextSkipped.includes(w.id)
    );

    if (nextCandidates.length === 0) {
      alert('已抽过所有符合条件的心愿。已为你重置排除记录，将重新开启新一轮抽选。');
      setSessionSkippedIds([]);
      executeDraw([]);
      return;
    }

    executeDraw(nextSkipped);
  };

  const handleConfirmLockWish = () => {
    if (!drawnResult) return;
    lockWishAsDrawn(drawnResult, currentUser.id);
    setShowResultModal(false);
    setDrawnResult(null);
    setSessionSkippedIds([]);
    setActiveSubTab('tasks');
  };

  const handleConfirmPurchase = () => {
    if (!taskToPurchase) return;
    markPurchased(taskToPurchase.id, purchaseNoteInput.trim() || undefined);
    setTaskToPurchase(null);
    setPurchaseNoteInput('');
  };

  const handleConfirmSend = () => {
    if (!taskToSend) return;
    markSent(taskToSend.id);
    triggerBigCelebration();
    setTaskToSend(null);
  };

  const handleConfirmCancelTask = () => {
    if (!taskToCancel) return;
    cancelGiftRecord(taskToCancel.id);
    setTaskToCancel(null);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-4">
      {/* Top Tab Switcher */}
      <div className="flex items-center justify-between p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('draw')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'draw'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Dices className="w-4 h-4 text-rose-500" />
          <span>随机抽取礼物</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 relative ${
            activeSubTab === 'tasks'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>正在准备的送礼 ({activeTasks.length})</span>
          {activeTasks.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {activeSubTab === 'draw' ? (
        <div className="space-y-4">
          {/* Secrecy Principle Banner (Concise) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 shadow-xs">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="leading-relaxed">
              <span className="font-bold text-slate-800">保密原则：</span>
              不可查看对方心愿明细，仅支持随机抽选；抽中与备礼全流程对 TA 严格保密。
            </p>
          </div>

          {/* Partner Selector */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>1. 选择要为TA挑选礼物的对象</span>
              </label>
              <span className="text-[10px] text-slate-400">仅限已绑定的伴侣</span>
            </div>

            {boundUsers.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                暂未绑定伴侣。请前往「我的」-「情侣绑定管理」发送邀请建立绑定。
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {boundUsers.map((partner) => {
                  const isSelected = selectedPartnerId === partner.id;
                  return (
                    <button
                      key={partner.id}
                      onClick={() => {
                        setSelectedPartnerId(partner.id);
                        setSessionSkippedIds([]);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-400 shadow-xs ring-1 ring-rose-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={partner.avatar}
                        alt={partner.nickname}
                        className="w-10 h-10 rounded-full object-cover border border-white shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {partner.nickname}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          @{partner.username}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Partner Status & Avoid List Quick Peek */}
          {selectedPartner && (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50/70 to-pink-50/40 border border-rose-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {selectedPartner.nickname} 的心愿状态
                  </span>
                  <span className="text-xs text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                    可抽选心愿：{currentAvailableCandidates.length} 个
                  </span>
                </div>

                {/* Avoid list button */}
                {drawEligibility.avoidItems.length > 0 && (
                  <button
                    onClick={() => setShowAvoidListDrawer(true)}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100/70 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>查看TA的避雷清单 ({drawEligibility.avoidItems.length})</span>
                  </button>
                )}
              </div>

              {/* Milestone & Holiday Reminder */}
              {partnerUpcomingAnn && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-semibold text-slate-800">备礼备忘：</span>
                    <span>距离【{partnerUpcomingAnn.title}】还有 </span>
                    <span className="font-extrabold text-rose-600 tabular-nums">
                      {partnerUpcomingAnn.daysRemaining === 0 ? '今天' : `${partnerUpcomingAnn.daysRemaining}天`}
                    </span>
                    {partnerUpcomingAnn.notes && (
                      <span className="text-slate-500 text-[11px] ml-1.5 hidden sm:inline">
                        · 💡 {partnerUpcomingAnn.notes}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Secrecy Assurance */}
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-white/80 border border-rose-100/80 text-[11px] text-slate-500">
                <EyeOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>绝对保密原则：</strong> 抽选、标记购买及取消流程对 {selectedPartner.nickname} 完全保密。只有在你主动点击「确认送出」后，TA才会收到惊喜通知。
                </span>
              </div>
            </div>
          )}

          {/* Budget Filter */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>2. 预算筛选 (选填 · 随心安排)</span>
              </label>
              <span className="text-[10px] text-slate-400">超出预算的心愿不会被抽中</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: '不限预算', val: null },
                { label: '¥200 以内', val: 200 },
                { label: '¥500 以内', val: 500 },
                { label: '¥1000 以内', val: 1000 },
              ].map((p, idx) => {
                const isSelected = budgetPreset === p.val && customBudget === '';
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setBudgetPreset(p.val);
                      setCustomBudget('');
                    }}
                    className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap transition-colors border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Custom input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">自定义最高预算：¥</span>
              <input
                type="number"
                min="0"
                value={customBudget}
                onChange={(e) => {
                  setCustomBudget(e.target.value);
                  setBudgetPreset(null);
                }}
                placeholder="例如：600"
                className="w-32 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              {effectiveBudget !== undefined && (
                <button
                  onClick={() => {
                    setCustomBudget('');
                    setBudgetPreset(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  清除
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400">
              * 规则：填写预算后，系统将仅抽选标有价格且未超过该金额的心愿；价格未知的心愿将自动不参与本次筛选。
            </p>
          </div>

          {/* Draw Trigger Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-50/80 via-stone-50/60 to-amber-50/50 border border-rose-200/70 text-slate-800 shadow-xs text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-800">
                {selectedPartner ? `为 ${selectedPartner.nickname} 抽取心愿礼物` : '请先选择送礼对象'}
              </h3>
              <p className="text-xs text-slate-500">
                高优先度的愿望会被赋予更高的命中权重，随机碰出彼此心仪的惊喜
              </p>
            </div>

            {/* Visual Box / Gacha Animation Area */}
            <div className="py-3 flex flex-col items-center justify-center">
              <motion.div
                animate={
                  isDrawing
                    ? {
                        rotate: [0, -10, 10, -10, 10, -5, 5, 0],
                        scale: [1, 1.15, 1.05, 1.2, 1],
                        y: [0, -8, 4, -12, 0],
                      }
                    : { y: [0, -4, 0] }
                }
                transition={
                  isDrawing
                    ? { duration: 1.5, repeat: Infinity }
                    : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }
                className="w-24 h-24 rounded-3xl bg-white border border-rose-200/80 shadow-xs flex items-center justify-center cursor-pointer hover:border-rose-300 transition-colors"
                onClick={handleStartDraw}
              >
                {isDrawing ? (
                  <Sparkles className="w-10 h-10 text-amber-500 animate-spin" />
                ) : (
                  <Package className="w-10 h-10 text-rose-400" />
                )}
              </motion.div>
            </div>

            {/* Action Button */}
            <button
              disabled={isDrawing || currentAvailableCandidates.length === 0}
              onClick={handleStartDraw}
              className={`w-full max-w-xs mx-auto py-3 px-6 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isDrawing || currentAvailableCandidates.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-sm'
              }`}
            >
              <Dices className="w-4 h-4 text-rose-300" />
              <span>{isDrawing ? '正在感知心愿能量...' : '开始随机抽选！'}</span>
            </button>

            {currentAvailableCandidates.length === 0 && (
              <p className="text-xs text-slate-500">
                {drawEligibility.reasonIfEmpty || '当前无符合条件的可抽选心愿'}
              </p>
            )}

            {sessionSkippedIds.length > 0 && (
              <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <span>本次已排除 {sessionSkippedIds.length} 个刚才抽过的心愿</span>
                <button
                  onClick={() => setSessionSkippedIds([])}
                  className="text-rose-600 hover:text-rose-700 underline ml-1 font-medium"
                >
                  重置候选池
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* My Active Tasks View */
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800">
              我的送礼任务清单
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              记录你抽中并正在准备的惊喜心愿。心愿主人无法查看本列表。
            </p>
          </div>

          {activeTasks.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">暂无进行中的送礼任务</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                切换至「随机抽取礼物」标签，为TA挑一份合心意的情侣礼物吧！
              </p>
              <button
                onClick={() => setActiveSubTab('draw')}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs"
              >
                立即抽选
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => {
                const wish = task.giftWishSnapshot;
                const isPurchased = task.status === 'purchased';
                const receiver = boundUsers.find((u) => u.id === task.receiverId);

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3"
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {receiver && (
                          <img
                            src={receiver.avatar}
                            alt={receiver.nickname}
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="text-xs font-bold text-slate-800">
                          给 {receiver?.nickname || 'TA'} 的心愿
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          isPurchased
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isPurchased ? '已购买 · 待送出' : '已锁定 · 准备中'}
                      </span>
                    </div>

                    {/* Wish details row */}
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <img
                        src={wish.images?.[0] || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'}
                        alt={wish.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                          {wish.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          {wish.price !== undefined && (
                            <span className="font-bold text-rose-600">¥{wish.price}</span>
                          )}
                          {wish.specs && (
                            <span className="text-slate-400 truncate">{wish.specs}</span>
                          )}
                        </div>
                        {task.purchaseNote && (
                          <p className="text-[11px] text-teal-700 bg-teal-50/80 p-1.5 rounded-lg border border-teal-100 mt-2">
                            备忘：{task.purchaseNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setTaskToCancel(task)}
                        className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        放弃送礼任务
                      </button>

                      <div className="flex items-center gap-2">
                        {!isPurchased ? (
                          <button
                            onClick={() => {
                              setTaskToPurchase(task);
                              setPurchaseNoteInput(task.purchaseNote || '');
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
                          >
                            标记已购买
                          </button>
                        ) : (
                          <button
                            onClick={() => setTaskToSend(task)}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 active:scale-95 transition-all flex items-center gap-1"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>确认已送出！(揭晓惊喜)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Avoid List Drawer / Modal */}
      {showAvoidListDrawer && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {selectedPartner.nickname} 的避雷清单
                  </h4>
                  <p className="text-[11px] text-slate-400">送礼前务必查看，避开不合心意的选项</p>
                </div>
              </div>
              <button
                onClick={() => setShowAvoidListDrawer(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3">
              {drawEligibility.avoidItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1"
                >
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <p className="text-xs font-medium text-slate-800 mt-1">
                    {item.content}
                  </p>
                  {item.reason && (
                    <p className="text-[11px] text-slate-500">
                      理由：{item.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Draw Result Modal */}
      {showResultModal && drawnResult && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {sessionSkippedIds.length > 0
                  ? `第 ${sessionSkippedIds.length + 1} 次抽选 · 已排除刚才抽过的物品`
                  : '抽选命中 · 命中惊喜'}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-1">
                抽中了 {selectedPartner.nickname} 的心愿！
              </h3>
            </div>

            {/* Revealed Card */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-200">
                <img
                  src={drawnResult.images?.[0] || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'}
                  alt={drawnResult.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                  {drawnResult.title}
                </h4>
                <div className="flex items-center gap-2 text-xs mt-1">
                  {drawnResult.price !== undefined && (
                    <span className="font-bold text-rose-600">¥{drawnResult.price}</span>
                  )}
                  {drawnResult.specs && (
                    <span className="text-slate-400 truncate">{drawnResult.specs}</span>
                  )}
                </div>
                {drawnResult.note && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    备注：{drawnResult.note}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmLockWish}
                className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>就选它了</span>
              </button>

              <button
                onClick={handleDrawAgain}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                <span>再抽一次</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Purchased Modal */}
      {taskToPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-800">
              标记为已购买
            </h4>
            <p className="text-xs text-slate-500">
              已下单购买？可填写购买凭证或物流备注，方便自己后续跟踪。（此信息对心愿主人严格保密）
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                购买备注 / 物流信息 (选填)
              </label>
              <textarea
                rows={2}
                value={purchaseNoteInput}
                onChange={(e) => setPurchaseNoteInput(e.target.value)}
                placeholder="例如：已在京东下单，顺丰单号 SF123456，预计周五送到"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTaskToPurchase(null)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                取消
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs"
              >
                确认标记
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Sent Modal */}
      {taskToSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-800">
                确认已将礼物送出？
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                点击确认后，你的送礼者身份将正式向对方揭晓，并触发惊喜通知！该心愿将正式沉淀至双方的共同「送礼历史」中。
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setTaskToSend(null)}
                className="px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                稍后再送
              </button>
              <button
                onClick={handleConfirmSend}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md shadow-rose-200"
              >
                确定送达，揭晓心意 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Task Modal */}
      {taskToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">放弃送礼任务？</h4>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              取消后将立即解除该心愿的锁定，重新放回对方的抽选池中。
              <p className="text-slate-400 mt-1">
                注：系统对取消操作严格保密，心愿主人不会收到任何取消通知。
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTaskToCancel(null)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                保留任务
              </button>
              <button
                onClick={handleConfirmCancelTask}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                确认放弃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
