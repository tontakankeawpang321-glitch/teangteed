import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, TrendingUp, TrendingDown, RefreshCw, BarChart2, Check, Sparkles, Grid } from 'lucide-react';
import { getCategories } from '../data/candlesticks';
import { CandlestickPattern } from '../types';

interface CategoryDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  patterns: CandlestickPattern[];
}

export const CategoryDrawerModal: React.FC<CategoryDrawerModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  patterns,
}) => {
  const categories = getCategories();

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-rose-600" />;
      case 'continuation':
        return <RefreshCw className="w-4 h-4 text-sky-600" />;
      case 'single':
      case 'dual':
      case 'triple':
        return <BarChart2 className="w-4 h-4 text-amber-600" />;
      case 'smc':
      case 'chart':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <Grid className="w-4 h-4 text-teal-600" />;
    }
  };

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return patterns.length;
    if (catId === 'bullish') return patterns.filter((p) => p.side === 'Bullish').length;
    if (catId === 'bearish') return patterns.filter((p) => p.side === 'Bearish').length;
    if (catId === 'continuation') return patterns.filter((p) => p.grouping === 'ต่อเนื่อง (Continuation)' || p.side === 'Continuation').length;
    if (catId === 'single') return patterns.filter((p) => p.grouping === 'แท่งเดี่ยว (Single)' || p.count === 1).length;
    if (catId === 'dual') return patterns.filter((p) => p.grouping === 'สองแท่ง (Dual)' || p.count === 2).length;
    if (catId === 'triple') return patterns.filter((p) => p.grouping === 'สามแท่ง (Triple)' || p.count === 3).length;
    if (catId === 'chart') return patterns.filter((p) => p.grouping === 'รูปแบบชาร์ต (Chart Patterns)').length;
    if (catId === 'smc') return patterns.filter((p) => p.grouping === 'Price Action & SMC' || p.tags?.some(t => t.includes('smc') || t.includes('fvg') || t.includes('sweep'))).length;
    return patterns.length;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs overscroll-contain"
          />

          {/* Slide-Up Bottom Sheet / Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[82vh] flex flex-col overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Header / Grab Handle */}
            <div className="pt-3 pb-2 px-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    เลือกหมวดหมู่แท่งเทียน
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-sans">
                    รวมกว่า {patterns.length} รูปแบบ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category List */}
            <div
              className="p-3 overflow-y-auto space-y-1.5 overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="grid grid-cols-1 gap-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = getCategoryCount(cat.id);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-colors cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {getCategoryIcon(cat.id)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm block truncate">{cat.label}</span>
                          <span className="text-[9.5px] text-slate-400 font-mono">
                            {count} รูปแบบ
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Dismiss Action */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                }}
                className="text-xs text-teal-700 font-semibold hover:underline cursor-pointer px-2"
              >
                ดูทั้งหมด ({patterns.length})
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer transition-colors active:scale-95"
              >
                ปิด
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
