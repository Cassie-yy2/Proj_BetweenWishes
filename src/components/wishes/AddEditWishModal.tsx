import React, { useState, useEffect } from 'react';
import { Wish, Priority } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Link as LinkIcon, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface AddEditWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishToEdit?: Wish | null;
}

const PRESET_CATEGORIES = [
  '生活好物',
  '穿搭饰品',
  '数码潮玩',
  '浪漫体验',
  '美妆护肤',
  '美食饮品',
  '书影文具',
  '其他心愿',
];

const PRESET_IMAGES = [
  { label: '手冲咖啡', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80' },
  { label: '羊绒围巾', url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&auto=format&fit=crop&q=80' },
  { label: '复古相机', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80' },
  { label: '手作陶艺', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80' },
  { label: '机械键盘', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { label: '户外保温杯', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80' },
  { label: '艺术画材', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80' },
  { label: '首饰收纳', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80' },
];

export const AddEditWishModal: React.FC<AddEditWishModalProps> = ({
  isOpen,
  onClose,
  wishToEdit,
}) => {
  const { addWish, updateWish, isWishLocked, getBoundUsers } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('生活好物');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [specs, setSpecs] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [deadline, setDeadline] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedAllowedUsers, setSelectedAllowedUsers] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSmartLinkTip, setShowSmartLinkTip] = useState(false);

  const boundUsers = getBoundUsers();
  const isEditing = !!wishToEdit;
  const isDrawn = wishToEdit ? isWishLocked(wishToEdit.id) : false;

  useEffect(() => {
    if (wishToEdit) {
      setTitle(wishToEdit.title);
      if (PRESET_CATEGORIES.includes(wishToEdit.category)) {
        setCategory(wishToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setCustomCategory(wishToEdit.category);
      }
      setPrice(wishToEdit.price !== undefined ? String(wishToEdit.price) : '');
      setQuantity(wishToEdit.quantity || 1);
      setSpecs(wishToEdit.specs || '');
      setPriority(wishToEdit.priority || 'medium');
      setUrl(wishToEdit.url || '');
      setNote(wishToEdit.note || '');
      setDeadline(wishToEdit.deadline ? wishToEdit.deadline.slice(0, 10) : '');
      setImages(wishToEdit.images || []);
      setSelectedAllowedUsers(wishToEdit.allowedUserIds || []);
    } else {
      // Reset form
      setTitle('');
      setCategory('生活好物');
      setCustomCategory('');
      setPrice('');
      setQuantity(1);
      setSpecs('');
      setPriority('medium');
      setUrl('');
      setNote('');
      setDeadline('');
      setImages([PRESET_IMAGES[0].url]);
      setSelectedAllowedUsers([]);
    }
    setErrorMessage('');
  }, [wishToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSimulateSmartLink = () => {
    // Smart link simulation
    if (!url.trim()) {
      setShowSmartLinkTip(true);
      return;
    }
    // Simulate auto-parsing based on url content
    if (url.includes('coffee') || url.includes('kafei') || url.includes('jd')) {
      setTitle('精品咖啡手冲套装 (含滤杯+电子秤)');
      setPrice('369');
      setSpecs('哑光黑 / 400ml / 附赠滤纸100张');
      setCategory('生活好物');
      setImages([PRESET_IMAGES[0].url]);
    } else if (url.includes('camera') || url.includes('fuji')) {
      setTitle('经典复古胶片拍立得相机');
      setPrice('899');
      setSpecs('原色银白 / 双快门 / 赠两盒相纸');
      setCategory('数码潮玩');
      setImages([PRESET_IMAGES[2].url]);
    } else {
      // General recognition
      setTitle('精选手作礼品 (已自动解析商品)');
      setPrice('299');
      setSpecs('标准定制款');
      setImages([PRESET_IMAGES[3].url]);
    }
    setShowSmartLinkTip(false);
  };

  const handleAddPresetImage = (imgUrl: string) => {
    if (images.includes(imgUrl)) {
      setImages(images.filter((i) => i !== imgUrl));
    } else {
      if (images.length >= 5) {
        alert('最多支持添加 5 张商品图片');
        return;
      }
      setImages([...images, imgUrl]);
    }
  };

  const handleAddCustomImage = () => {
    if (!customImageUrl.trim()) return;
    if (images.length >= 5) {
      alert('最多支持添加 5 张商品图片');
      return;
    }
    setImages([...images, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('请填写心愿名称');
      return;
    }

    const finalCategory = category === 'custom' ? (customCategory.trim() || '未分类') : category;
    const finalPrice = price.trim() !== '' ? parseFloat(price) : undefined;

    const payload = {
      title: title.trim(),
      category: finalCategory,
      price: finalPrice,
      quantity: quantity > 0 ? quantity : 1,
      specs: specs.trim() || undefined,
      priority,
      url: url.trim() || undefined,
      note: note.trim() || undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      images: images.length > 0 ? images : [PRESET_IMAGES[0].url],
      allowedUserIds: selectedAllowedUsers.length > 0 ? selectedAllowedUsers : undefined,
    };

    if (isEditing && wishToEdit) {
      const res = updateWish(wishToEdit.id, payload);
      if (!res.success) {
        setErrorMessage(res.message || '更新心愿失败');
        return;
      }
    } else {
      addWish(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {isEditing ? '编辑心愿' : '写下新心愿'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              记录你中意的好物与体验，让送礼人不再抓瞎
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawn Warning if locked */}
        {isDrawn && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">特别提示：此心愿已被某位送礼者抽中锁定！</span>
              <p className="text-amber-700 mt-0.5">
                根据规则，已被抽中的心愿仅支持修改补充备注或排序。若需更换商品、规格或价格，请先删除本条心愿后再重新添加。
              </p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Smart Link Recognition Simulator */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>商品链接 (选填 · 支持一键智能识别)</span>
              </label>
              <button
                type="button"
                onClick={handleSimulateSmartLink}
                className="text-[11px] font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>一键识别模拟</span>
              </button>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="可粘贴淘宝/京东/天猫/得物等商品链接 (如 https://item.jd.com/...)"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              disabled={isDrawn}
            />
            {showSmartLinkTip && (
              <p className="text-[11px] text-amber-600">
                请先在输入框粘贴任意商品链接，或直接输入 demo 关键词（如 coffee / camera）。
              </p>
            )}
          </div>

          {/* Wish Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              心愿名称 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：复古咖啡手冲壶套装、羊绒围巾..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              disabled={isDrawn}
              required
            />
          </div>

          {/* Category & Priority in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                分类
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="custom">+ 自定义分类</option>
              </select>
              {category === 'custom' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="输入自定义分类名称"
                  className="w-full mt-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                优先级 (影响抽选概率)
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => {
                  const labelMap = { high: '🔥 高', medium: '✨ 中', low: '🌱 低' };
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {labelMap[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                参考价格 (¥ 选填)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="例如：388 (用于预算筛选)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                disabled={isDrawn}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                不填价格则不参与送礼人的特定预算抽选
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                数量
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Specs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              规格参数 (选填)
            </label>
            <input
              type="text"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="如：颜色、尺寸、型号、容量（如：燕麦米色 / M码）"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              disabled={isDrawn}
            />
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>商品图片 (选填，已选 {images.length}/5)</span>
              </span>
              <span className="text-[10px] text-slate-400">点击下方预设图可快速选用</span>
            </label>

            {/* Selected images preview */}
            {images.length > 0 && (
              <div className="flex items-center gap-2 mb-2 overflow-x-auto py-1">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 group">
                    <img src={imgUrl} alt="已选图片" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick preset selector */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/60">
              {PRESET_IMAGES.map((preset, idx) => {
                const isSelected = images.includes(preset.url);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      isSelected ? 'border-rose-500 ring-2 ring-rose-200' : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/50 text-[10px] text-white py-0.5 text-center truncate">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Image URL input */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="或粘贴自定义图片网址..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="button"
                onClick={handleAddCustomImage}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
              >
                添加图片
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              心愿备注与期许 (选填)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="写写你为什么喜欢它、或者对它的期待..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              截止期望日期 (选填)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              逾期后此心愿将自动暂停参与新的送礼抽选
            </p>
          </div>

          {/* Permissions / Authorized Viewers */}
          {boundUsers.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                指定伴侣可见与抽选权限
              </label>
              <p className="text-[10px] text-slate-400 mb-2">
                默认绑定的伴侣皆可查看与抽选；也可指定特定伴侣。
              </p>
              <div className="flex flex-wrap gap-2">
                {boundUsers.map((bu) => {
                  const isChecked = selectedAllowedUsers.includes(bu.id);
                  return (
                    <button
                      key={bu.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedAllowedUsers(selectedAllowedUsers.filter((id) => id !== bu.id));
                        } else {
                          setSelectedAllowedUsers([...selectedAllowedUsers, bu.id]);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors border ${
                        isChecked
                          ? 'bg-rose-50 text-rose-600 border-rose-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={bu.avatar}
                        alt={bu.nickname}
                        className="w-4 h-4 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span>{bu.nickname}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-md shadow-rose-200"
          >
            {isEditing ? '保存修改' : '放入心愿清单'}
          </button>
        </div>
      </div>
    </div>
  );
};
