import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Flame,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Bookmark,
  Share2,
  Check,
  Bot
} from 'lucide-react';
import { TRADING_GLOSSARY_100, GLOSSARY_CATEGORIES, TradingGlossaryItem } from '../data/glossary';

interface TradingGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi: (termPrompt: string) => void;
}

export const TradingGlossaryModal: React.FC<TradingGlossaryModalProps> = ({
  isOpen,
  onClose,
  onAskAi,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return TRADING_GLOSSARY_100.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.termTh.toLowerCase().includes(q) ||
        item.termEn.toLowerCase().includes(q) ||
        item.shortDef.toLowerCase().includes(q) ||
        item.fullExplanation.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleCopyTerm = (item: TradingGlossaryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `📖 ${item.termTh} (${item.termEn})\nความหมาย: ${item.shortDef}\nคำอธิบาย: ${item.fullExplanation}\nตัวอย่าง: ${item.example}\n💡 ทริค: ${item.practicalTip}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'CandleStructure':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'SupportResistance':
        return <Layers className="w-4 h-4 text-blue-600" />;
      case 'PriceAction':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'SMC_ICT':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'RiskManagement':
        return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'VolumeIndicators':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-teal-600" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'CandleStructure':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SupportResistance':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PriceAction':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SMC_ICT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'RiskManagement':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'VolumeIndicators':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  return (
    <div
      id="trading-glossary-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain"
      onClick={onClose}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden my-auto max-h-[88vh] flex flex-col text-slate-800 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                  คลังศัพท์ภาษาเทรด (100 ศัพท์)
                </h3>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  {TRADING_GLOSSARY_100.length} ศัพท์
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 truncate hidden xs:block">
                ศัพท์แท่งเทียน, แนวรับ-แนวต้าน, SMC, ICT, Risk Management
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-glossary-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer active:scale-95 shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-2.5 sm:p-3 border-b border-slate-100 bg-white space-y-2 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="glossary-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา เช่น ไส้ปิด, แนวรับ, FVG, Stop Loss..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {GLOSSARY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Glossary Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">ไม่พบคำศัพท์ที่ตรงกับ "{searchQuery}"</p>
              <p className="text-xs text-slate-400">ลองค้นหาด้วยคำอื่น หรือกดถาม AI Analyst ได้โดยตรง</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskAi(`ช่วยอธิบายคำศัพท์การเทรดคำว่า "${searchQuery}" พร้อมยกตัวอย่างพฤติกรรมแท่งเทียนให้หน่อยครับ`);
                }}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <Bot className="w-4 h-4" /> ถาม AI เกี่ยวกับ "{searchQuery}"
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item, idx) => {
                const isExpanded = expandedId === item.id;
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-sm ${
                      isExpanded
                        ? 'border-teal-400 ring-2 ring-teal-500/10 col-span-1 md:col-span-2'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Index, Terms, Category Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            <h4 className="font-bold text-sm sm:text-base text-slate-900">
                              {item.termTh}
                            </h4>
                            <span className="text-xs font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                              {item.termEn}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleCopyTerm(item, e)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="คัดลอกความหมาย"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {GLOSSARY_CATEGORIES.find((c) => c.id === item.category)?.label.split(' ')[0] || item.category}
                        </span>
                      </div>
                    </div>

                    {/* Short Definition */}
                    <p className="text-xs sm:text-[13px] text-slate-700 mt-2 font-medium leading-relaxed">
                      {item.shortDef}
                    </p>

                    {/* Detailed Accordion Section */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 text-xs animate-fade-in">
                        {/* Full Explanation */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <span className="font-bold text-slate-900 block text-xs">
                            📖 คำอธิบายอย่างละเอียด:
                          </span>
                          <p className="text-slate-600 leading-relaxed text-xs">
                            {item.fullExplanation}
                          </p>
                        </div>

                        {/* Practical Example */}
                        <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100 space-y-1">
                          <span className="font-bold text-teal-900 block text-xs">
                            🎯 ตัวอย่างสถานการณ์ในกราฟจริง:
                          </span>
                          <p className="text-teal-800 leading-relaxed text-xs font-mono">
                            {item.example}
                          </p>
                        </div>

                        {/* Practical Tip */}
                        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-900 block text-xs">
                              ทริคการเทรดแบบมืออาชีพ (Pro Tip):
                            </span>
                            <p className="text-amber-800 leading-relaxed text-xs">
                              {item.practicalTip}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center flex-wrap gap-1 pt-1">
                          {item.tags.map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'ย่อรายละเอียด' : 'ดูคำอธิบาย & ทริคการเทรด'}</span>
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isExpanded ? '-rotate-90' : 'rotate-0'
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onAskAi(
                            `ช่วยวิเคราะห์และเจาะลึกคำว่า "${item.termTh} (${item.termEn})" ในการเทรด Price Action แท่งเทียน พร้อมบอกจุดเข้า จุด Stop Loss และข้อควรระวังให้หน่อยครับ`
                          );
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-[11px] font-semibold transition-all border border-slate-200 hover:border-teal-200 cursor-pointer"
                        title="ถาม AI Analyst เพิ่มเติม"
                      >
                        <Bot className="w-3 h-3 text-teal-600" />
                        <span>ถาม AI เพิ่มเติม</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>แสดง {filteredItems.length} จาก 100 คำศัพท์</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
