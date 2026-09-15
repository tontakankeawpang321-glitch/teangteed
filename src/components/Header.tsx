import React from 'react';
import {
  Sparkles,
  Camera,
  Bot,
  Bookmark,
  BookOpen,
  Film,
  BarChart3,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'shorts' | 'candlestick';
  onSelectTab: (tab: 'shorts' | 'candlestick') => void;
  totalPatterns: number;
  totalClips: number;
  bookmarkedCount: number;
  showBookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  onOpenScanner: () => void;
  onOpenChat: () => void;
  onOpenGlossary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  totalPatterns,
  totalClips,
  bookmarkedCount,
  showBookmarksOnly,
  onToggleBookmarksOnly,
  onOpenScanner,
  onOpenChat,
  onOpenGlossary,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-2.5 sm:px-4 md:px-6 py-2 text-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & App Title & Tab Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <div
            onClick={() => onSelectTab('shorts')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-xs shadow-teal-600/20 shrink-0 text-white">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div className="min-w-0 hidden xs:block">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-tight tracking-wide uppercase truncate">
                  TRADING AI
                </h1>
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-teal-700 font-mono font-medium tracking-wide uppercase truncate">
                Shorts & Price Action
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Main Tab Selector */}
          <div className="flex items-center p-0.5 sm:p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              type="button"
              id="tab-btn-shorts"
              onClick={() => onSelectTab('shorts')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shorts'
                  ? 'bg-white text-teal-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film className={`w-3.5 h-3.5 ${activeTab === 'shorts' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>คลิปสอน</span>
              {totalClips > 0 && (
                <span className="hidden md:inline-block px-1 py-0.2 rounded text-[9px] font-mono bg-teal-100 text-teal-800">
                  {totalClips}
                </span>
              )}
            </button>

            <button
              type="button"
              id="tab-btn-candlestick"
              onClick={() => onSelectTab('candlestick')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'candlestick'
                  ? 'bg-white text-teal-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'candlestick' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>แท่งเทียน</span>
              <span className="hidden md:inline-block px-1 py-0.2 rounded text-[9px] font-mono bg-slate-200 text-slate-700">
                500+
              </span>
            </button>
          </div>
        </div>

        {/* Action Controls & Top Navigation Buttons - Compact & Responsive */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Button 1: กล้อง (Camera / Scan) */}
          <button
            type="button"
            id="header-camera-btn"
            onClick={onOpenScanner}
            className="flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] sm:text-xs shadow-xs shadow-teal-600/20 transition-all active:scale-95 border border-teal-600 cursor-pointer shrink-0"
            title="กล้องสแกนกราฟแท่งเทียนด้วย AI"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">กล้อง</span>
          </button>

          {/* Button 2: คำถาม (Questions / AI Chat) */}
          <button
            type="button"
            id="header-question-btn"
            onClick={onOpenChat}
            className="flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1.5 rounded-lg bg-white hover:bg-teal-50 text-slate-800 hover:text-teal-800 font-semibold text-[11px] sm:text-xs border border-slate-200 hover:border-teal-300 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="คำถาม & ปรึกษา AI Technical Analyst"
          >
            <Bot className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-bold">คำถาม</span>
          </button>

          {/* Button 3: เรียนรู้ภาษาเทรด แท่งเทียน (100 ศัพท์) */}
          <button
            type="button"
            id="header-glossary-btn"
            onClick={onOpenGlossary}
            className="flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] sm:text-xs border border-amber-300 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="คลังคำศัพท์ภาษาเทรด & แท่งเทียน 100 ศัพท์"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="hidden md:inline">เรียนรู้ภาษาเทรด</span>
            <span className="inline md:hidden">100 ศัพท์</span>
          </button>
        </div>
      </div>
    </header>
  );
};
