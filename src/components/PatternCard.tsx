import React from 'react';
import { CandlestickPattern } from '../types';
import { CandleVisualizer } from './CandleVisualizer';
import { Sparkles, Bookmark, TrendingUp, TrendingDown, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface PatternCardProps {
  pattern: CandlestickPattern;
  onClick: (pattern: CandlestickPattern) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const PatternCard: React.FC<PatternCardProps> = React.memo(({
  pattern,
  onClick,
  isBookmarked,
  onToggleBookmark,
}) => {
  const getSideInfo = (side: CandlestickPattern['side']) => {
    switch (side) {
      case 'Bullish':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          hoverBorder: 'hover:border-emerald-400',
          badgeText: 'BULLISH',
          icon: <TrendingUp className="w-3 h-3 mr-1" />,
        };
      case 'Bearish':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          hoverBorder: 'hover:border-rose-400',
          badgeText: 'BEARISH',
          icon: <TrendingDown className="w-3 h-3 mr-1" />,
        };
      case 'Continuation':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-700',
          hoverBorder: 'hover:border-teal-400',
          badgeText: 'CONTINUATION',
          icon: <RefreshCw className="w-3 h-3 mr-1" />,
        };
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          hoverBorder: 'hover:border-amber-400',
          badgeText: 'NEUTRAL',
          icon: <Zap className="w-3 h-3 mr-1" />,
        };
    }
  };

  const side = getSideInfo(pattern.side);

  return (
    <div
      id={`pattern-card-${pattern.id}`}
      onClick={() => onClick(pattern)}
      className={`group relative bg-white hover:bg-slate-50/90 border border-slate-200/90 ${side.hoverBorder} p-2.5 sm:p-3.5 rounded-xl transition-colors cursor-pointer flex flex-row items-center gap-2.5 sm:gap-3 active:scale-[0.99] select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md`}
    >
      {/* Visualizer Thumbnail Preview */}
      <div className="w-20 sm:w-28 h-18 sm:h-20 bg-slate-50 rounded-lg flex items-center justify-center p-0.5 sm:p-1 border border-slate-200 shrink-0 group-hover:border-slate-300 transition-colors shadow-inner overflow-hidden">
        <CandleVisualizer candles={pattern.candles} height={60} width={90} />
      </div>

      {/* Main Pattern Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <h3 className="text-slate-900 font-bold text-xs sm:text-base group-hover:text-teal-700 transition-colors truncate">
                {pattern.name}
              </h3>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate">
              {pattern.englishName}
            </p>
          </div>

          {/* Right badges & Bookmark */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider border flex items-center shrink-0 ${side.bg}`}
            >
              {side.icon}
              {side.badgeText}
            </span>

            <button
              type="button"
              id={`bookmark-btn-${pattern.id}`}
              onClick={(e) => onToggleBookmark(pattern.id, e)}
              className={`p-1 rounded-md transition-colors cursor-pointer active:scale-95 ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'ลบบุ๊กมาร์ก' : 'บันทึกรายการโปรด'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-1 leading-normal font-normal">
          {pattern.summary}
        </p>

        {/* Technical Data Bar: Win Rate, Structure, Strength */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] sm:text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-teal-700 font-semibold">
              <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
              WR: {pattern.winRate}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 font-mono text-[9.5px] hidden md:inline truncate max-w-[120px]">
              {pattern.grouping}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[9.5px] text-slate-400 font-mono uppercase">Sig:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-1 sm:w-1.5 h-2 sm:h-2.5 rounded-xs ${
                    star <= pattern.signalStrength
                      ? pattern.side === 'Bullish'
                        ? 'bg-emerald-600'
                        : pattern.side === 'Bearish'
                        ? 'bg-rose-600'
                        : 'bg-teal-600'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PatternCard.displayName = 'PatternCard';
