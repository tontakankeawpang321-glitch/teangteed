import React from 'react';
import { CandlestickPattern } from '../types';
import { CandleVisualizer } from './CandleVisualizer';
import {
  X,
  Sparkles,
  Bookmark,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Target,
  ShieldAlert,
  Award,
  Lightbulb,
  BrainCircuit,
  MessageSquareShare,
  CheckCircle2,
} from 'lucide-react';

interface PatternDetailModalProps {
  pattern: CandlestickPattern | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onAskAi: (patternName: string) => void;
}

export const PatternDetailModal: React.FC<PatternDetailModalProps> = ({
  pattern,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onAskAi,
}) => {
  if (!pattern) return null;

  const getSideBadge = (side: CandlestickPattern['side']) => {
    switch (side) {
      case 'Bullish':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: <TrendingUp className="w-3.5 h-3.5 mr-1" />,
          label: 'Bullish (สัญญาณขาขึ้น)',
        };
      case 'Bearish':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          icon: <TrendingDown className="w-3.5 h-3.5 mr-1" />,
          label: 'Bearish (สัญญาณขาลง)',
        };
      case 'Continuation':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-700',
          icon: <RefreshCw className="w-3.5 h-3.5 mr-1" />,
          label: 'Continuation (ไปต่อตามเทรนด์เดิม)',
        };
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: <Zap className="w-3.5 h-3.5 mr-1" />,
          label: 'Neutral (ผันผวน/รอดู)',
        };
    }
  };

  const sideInfo = getSideBadge(pattern.side);

  return (
    <div
      id="pattern-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain"
      onClick={onClose}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl overflow-hidden my-auto max-h-[88vh] overflow-y-auto overscroll-contain text-slate-800 space-y-3 select-text"
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header bar */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${sideInfo.bg}`}
              >
                {sideInfo.icon}
                {sideInfo.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 truncate">
                {pattern.grouping}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug break-words">
              {pattern.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-teal-700 font-mono font-medium truncate">
              {pattern.englishName}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => onToggleBookmark(pattern.id, e)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer active:scale-95 ${
                isBookmarked
                  ? 'text-amber-600 bg-amber-50 border-amber-200'
                  : 'text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
              title={isBookmarked ? 'ลบบุ๊กมาร์ก' : 'บันทึกรายการโปรด'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              type="button"
              id="close-pattern-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Large Visualizer */}
        <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-inner w-full">
          <CandleVisualizer candles={pattern.candles} height={120} width={240} />
          <div className="flex items-center justify-between w-full px-2 pt-1.5 text-[11px] text-slate-500 border-t border-slate-200/80 mt-1.5">
            <span className="flex items-center gap-1 text-amber-700 font-semibold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Win Rate: {pattern.winRate}
            </span>
            <span className="font-mono text-[10px] text-slate-600">TF: {pattern.timeframe}</span>
          </div>
        </div>

        {/* Overview Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
            <Award className="w-4 h-4 text-teal-600 shrink-0" />
            สรุปรูปแบบและพฤติกรรมราคา
          </p>
          <p className="text-slate-700">{pattern.summary}</p>
        </div>

        {/* Market Psychology */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-xs sm:text-sm">
            <BrainCircuit className="w-4 h-4 text-indigo-600 shrink-0" />
            จิตวิทยาตลาดเบื้องหลัง (Market Psychology)
          </div>
          <p className="text-slate-700 leading-relaxed font-normal">{pattern.psychology}</p>
        </div>

        {/* Confirmation & Rules */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            เงื่อนไขการยืนยัน (Confirmation Trigger)
          </div>
          <p className="text-slate-700 leading-relaxed">{pattern.confirmation}</p>
        </div>

        {/* Entry / SL / TP Box */}
        {pattern.entrySLTP && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-teal-600 shrink-0" />
                แผนการเทรด (Trading Plan)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-mono font-bold">
                RR {pattern.entrySLTP.riskReward}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-slate-200 shadow-xs">
                <p className="text-[9px] text-slate-500 uppercase font-mono">จุดเข้า (Entry)</p>
                <p className="text-teal-700 font-bold text-[10.5px] mt-0.5 break-words font-mono">
                  {pattern.entrySLTP.entry}
                </p>
              </div>

              <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-rose-200 shadow-xs">
                <p className="text-[9px] text-rose-600 uppercase font-mono flex items-center justify-center gap-0.5">
                  <ShieldAlert className="w-2.5 h-2.5 inline shrink-0" /> Cut Loss
                </p>
                <p className="text-rose-700 font-bold text-[10.5px] mt-0.5 break-words font-mono">
                  {pattern.entrySLTP.stopLoss}
                </p>
              </div>

              <div className="bg-white p-1.5 sm:p-2 rounded-lg border border-emerald-200 shadow-xs">
                <p className="text-[9px] text-emerald-600 uppercase font-mono">เป้า (TP)</p>
                <p className="text-emerald-700 font-bold text-[10.5px] mt-0.5 break-words font-mono">
                  {pattern.entrySLTP.takeProfit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs flex items-start gap-2 text-amber-900">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11.5px] leading-relaxed">
            <span className="font-semibold text-amber-900">ทริคเซียน: </span>
            <span className="text-slate-700">{pattern.tip}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {pattern.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Ask AI Action Button */}
        <button
          type="button"
          id="ask-ai-detail-btn"
          onClick={() => {
            onClose();
            onAskAi(`ช่วยวิเคราะห์และแนะนำกลยุทธ์การเทรดแบบละเอียดสำหรับรูปแบบ "${pattern.name}" (${pattern.englishName}) พร้อมตัวอย่างการประยุกต์ใช้ในตลาด Forex, Crypto, หุ้นไทย`);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <MessageSquareShare className="w-4 h-4" />
          ปรึกษา AI Analyst เกี่ยวกับแท่งนี้
        </button>
      </div>
    </div>
  );
};
