import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HeartHandshake, Dices, EyeOff, X, ArrowRight, Calendar } from 'lucide-react';
import heroGiftImg from '../../assets/images/app_hero_gift_1791739407131.jpg';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
            aria-label="关闭引导"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Banner Image */}
          <div className="relative h-44 w-full overflow-hidden bg-rose-50">
            <img
              src={heroGiftImg}
              alt="心愿之间概念"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            <div className="absolute bottom-3 left-6">
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                双向惊喜 · 贴心守护
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">
                欢迎来到「心愿之间」
              </h2>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-sm text-slate-600 leading-relaxed">
              这里是专为你与伴侣打造的情侣送礼空间。不必再为节日/纪念日挑礼物纠结，也不必为索要礼物感到拘谨：
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/60 border border-rose-100/80">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">1. 随心记录心愿单</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    添加你的心仪好物、价格、规格与优先级。还可以设置避雷清单，告诉TA你的忌讳与过敏。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">2. 绑定情侣关系</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    通过邀请链接或账号绑定你的另一半。专属二人空间与独立授权，保护你们的惊喜与默契。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50/60 border border-teal-100/80">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-600 shrink-0">
                  <Dices className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">3. 预算抽选与绝对保密</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    设置预算后由系统智能随机抽选！抽中、购买全流程对心愿主人严格保密，直到送出的瞬间惊喜揭晓。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/60 border border-purple-100/80">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">4. 节日与生日自动提前提醒</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    日历自动标注圣诞节、七夕、情人节、520、妇女节与伴侣生日，默认提前 5 天自动弹窗提醒备礼，也可随心自定义提前天数！
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />
              <span>可随时使用顶部角色切换按钮，体验情侣双方的送礼与心愿互动。</span>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-1.5"
            >
              <span>开始体验心愿之旅</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
