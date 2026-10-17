import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Gift, HeartHandshake, X, Calendar, Sparkles } from 'lucide-react';

interface GiftHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftHistoryModal: React.FC<GiftHistoryModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, getSentGiftHistory, getReceivedGiftHistory } = useApp();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  if (!isOpen) return null;

  const sentGifts = getSentGiftHistory(currentUser.id);
  const receivedGifts = getReceivedGiftHistory(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-teal-50/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                送礼历史与温情回忆
              </h3>
              <p className="text-xs text-slate-400">
                记录每一次惊喜揭晓的美好心意
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

        {/* Tab switch */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'received'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>我收到的心愿礼物 ({receivedGifts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sent'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-teal-400" />
            <span>我送出的惊喜心意 ({sentGifts.length})</span>
          </button>
        </div>

        {/* Records list */}
        <div className="p-6 space-y-3 overflow-y-auto flex-1">
          {activeTab === 'received' ? (
            receivedGifts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                暂无收礼记录。当伴侣送出为你抽中的心愿时，这里会揭晓TA的心意~
              </div>
            ) : (
              receivedGifts.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-500" />
                      <span>由 {record.giverNickname} 揭晓送出</span>
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(record.sentAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    {record.wishImage && (
                      <img
                        src={record.wishImage}
                        alt={record.wishTitle}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {record.wishTitle}
                      </h4>
                      {record.price !== undefined && (
                        <p className="text-xs font-semibold text-rose-600 mt-0.5 tabular-nums">
                          ¥{record.price}
                        </p>
                      )}
                      {record.wishSpecs && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {record.wishSpecs}
                        </p>
                      )}
                    </div>
                  </div>

                  {record.purchaseNote && (
                    <p className="text-xs text-slate-600 bg-rose-50/60 p-2 rounded-xl border border-rose-100/80">
                      💌 TA的寄语备忘：{record.purchaseNote}
                    </p>
                  )}
                </div>
              ))
            )
          ) : (
            sentGifts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                暂无送礼记录。在「为TA送礼」中为伴侣完成心愿并确认送出后，将在此沉淀。
              </div>
            ) : (
              sentGifts.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      送给：{record.receiverNickname}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(record.sentAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    {record.wishImage && (
                      <img
                        src={record.wishImage}
                        alt={record.wishTitle}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {record.wishTitle}
                      </h4>
                      {record.price !== undefined && (
                        <p className="text-xs font-semibold text-rose-600 mt-0.5 tabular-nums">
                          ¥{record.price}
                        </p>
                      )}
                      {record.wishSpecs && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {record.wishSpecs}
                        </p>
                      )}
                    </div>
                  </div>

                  {record.purchaseNote && (
                    <p className="text-xs text-slate-500 bg-slate-100/80 p-2 rounded-xl">
                      当时的备忘：{record.purchaseNote}
                    </p>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
