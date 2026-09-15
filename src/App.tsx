import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CANDLESTICK_PATTERNS } from './data/candlesticks';
import { CandlestickPattern } from './types';
import { VideoClip, fetchSheetVideos, DEFAULT_SHORTS_CLIPS } from './services/sheetService';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { PatternCard } from './components/PatternCard';
import { PatternDetailModal } from './components/PatternDetailModal';
import { ShortsVideoHub } from './components/ShortsVideoHub';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AiChatModal } from './components/AiChatModal';
import { ImageScannerModal } from './components/ImageScannerModal';
import { QuizGameModal } from './components/QuizGameModal';
import { TradingGlossaryModal } from './components/TradingGlossaryModal';
import { CategoryDrawerModal } from './components/CategoryDrawerModal';
import { scanChartWithWorker, chatWithWorker } from './services/aiWorkerService';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  Bot,
  Award,
  Upload,
  Send,
  Loader2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ShieldCheck,
  Zap,
  Bookmark,
  Home,
  BookOpen,
  SlidersHorizontal,
  Layers,
  Film,
  BarChart3,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function App() {
  // Main Tab State: default is 'shorts' (หน้าแรกเป็นคลิป short ตามที่ขอ)
  const [activeTab, setActiveTab] = useState<'shorts' | 'candlestick'>('shorts');

  // Google Sheet Shorts State - only display data that exists in the sheet
  const [sheetClips, setSheetClips] = useState<VideoClip[]>([]);
  const [isSheetLoading, setIsSheetLoading] = useState(true);
  const [activeVideoClip, setActiveVideoClip] = useState<VideoClip | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);

  // Candlestick Library State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'winrate' | 'name' | 'signal'>('default');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [activeDetailPattern, setActiveDetailPattern] = useState<CandlestickPattern | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Background scroll lock when ANY modal is open
  const isAnyModalOpen = Boolean(
    activeDetailPattern ||
    activeVideoClip ||
    isChatOpen ||
    isScannerOpen ||
    isQuizOpen ||
    isGlossaryOpen ||
    isCategoryDrawerOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isAnyModalOpen]);

  // Load Google Sheet CSV immediately on app start ("แสดงเฉพาะข้อมูลที่ในชีตเท่านั้น")
  const loadSheetData = async () => {
    setIsSheetLoading(true);
    try {
      const fetched = await fetchSheetVideos();
      setSheetClips(fetched || []);
    } catch (e) {
      console.warn('Could not load sheet clips:', e);
      setSheetClips([]);
    } finally {
      setIsSheetLoading(false);
    }
  };

  useEffect(() => {
    loadSheetData();
  }, []);

  // Touch swipe support for Candlestick patterns section
  const candleTouchStartX = useRef<number | null>(null);
  const candleTouchStartY = useRef<number | null>(null);

  const handleCandleTouchStart = (e: React.TouchEvent) => {
    candleTouchStartX.current = e.touches[0].clientX;
    candleTouchStartY.current = e.touches[0].clientY;
  };

  const handleCandleTouchEnd = (e: React.TouchEvent) => {
    if (candleTouchStartX.current === null || candleTouchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - candleTouchStartX.current;
    const deltaY = e.changedTouches[0].clientY - candleTouchStartY.current;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped Left -> Next page
        if (currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Swiped Right -> Prev page
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
    candleTouchStartX.current = null;
    candleTouchStartY.current = null;
  };

  // Right-Panel Workbench Live Chat & Quick Scanner state
  const [workbenchInput, setWorkbenchInput] = useState('');
  const [workbenchChat, setWorkbenchChat] = useState<
    Array<{ role: 'user' | 'model'; text: string; time: string }>
  >([
    {
      role: 'model',
      text: 'สวัสดีครับ! ยินดีต้อนรับสู่ Trading AI พร้อมวิเคราะห์คลิปสอนเทรดและรูปแบบแท่งเทียน Price Action ครับ',
      time: '12:00',
    },
  ]);
  const [isWorkbenchLoading, setIsWorkbenchLoading] = useState(false);
  const [workbenchScanResult, setWorkbenchScanResult] = useState<any>(null);
  const [isWorkbenchScanning, setIsWorkbenchScanning] = useState(false);
  const workbenchChatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bookmarks persistence for Candlesticks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('candlestick_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarks persistence for Shorts Clips
  const [bookmarkedClipIds, setBookmarkedClipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shorts_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('candlestick_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('shorts_bookmarks', JSON.stringify(bookmarkedClipIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedClipIds]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBookmarkClip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedClipIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetToHome = () => {
    setActiveTab('shorts');
    setSearchQuery('');
    setSelectedCategory('all');
    setShowBookmarksOnly(false);
    setSortBy('default');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort Candlestick patterns
  const filteredPatterns = useMemo(() => {
    let result = [...CANDLESTICK_PATTERNS];

    // Bookmark filter
    if (showBookmarksOnly) {
      result = result.filter((p) => bookmarkedIds.includes(p.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'bullish') {
        result = result.filter((p) => p.side === 'Bullish');
      } else if (selectedCategory === 'bearish') {
        result = result.filter((p) => p.side === 'Bearish');
      } else if (selectedCategory === 'continuation') {
        result = result.filter((p) => p.side === 'Continuation');
      } else if (selectedCategory === 'single') {
        result = result.filter((p) => p.count === 1 || p.grouping.includes('แท่งเดี่ยว'));
      } else if (selectedCategory === 'dual') {
        result = result.filter((p) => p.count === 2 || p.grouping.includes('สองแท่ง'));
      } else if (selectedCategory === 'triple') {
        result = result.filter((p) => p.count === 3 || p.grouping.includes('สามแท่ง'));
      } else if (selectedCategory === 'chart') {
        result = result.filter((p) => p.grouping.includes('รูปแบบชาร์ต'));
      } else if (selectedCategory === 'smc') {
        result = result.filter(
          (p) =>
            p.grouping.includes('SMC') ||
            p.tags.some((t) => t.includes('smc') || t.includes('fvg'))
        );
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.englishName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'winrate') {
      result.sort((a, b) => {
        const rateA = parseInt(a.winRate.replace(/[^0-9]/g, '').slice(0, 2)) || 70;
        const rateB = parseInt(b.winRate.replace(/[^0-9]/g, '').slice(0, 2)) || 70;
        return rateB - rateA;
      });
    } else if (sortBy === 'signal') {
      result.sort((a, b) => b.signalStrength - a.signalStrength);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, showBookmarksOnly, bookmarkedIds]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, showBookmarksOnly]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatterns.length / ITEMS_PER_PAGE) || 1;
  const paginatedPatterns = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPatterns.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPatterns, currentPage]);

  const handleOpenChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  // Video Navigation in Modal
  const handleSelectClip = (clip: VideoClip, index: number) => {
    setActiveVideoClip(clip);
    setActiveVideoIndex(index);
  };

  const handleNextClip = () => {
    if (activeVideoIndex < sheetClips.length - 1) {
      const nextIdx = activeVideoIndex + 1;
      setActiveVideoIndex(nextIdx);
      setActiveVideoClip(sheetClips[nextIdx]);
    }
  };

  const handlePrevClip = () => {
    if (activeVideoIndex > 0) {
      const prevIdx = activeVideoIndex - 1;
      setActiveVideoIndex(prevIdx);
      setActiveVideoClip(sheetClips[prevIdx]);
    }
  };

  // Workbench Direct Send
  const handleWorkbenchSend = async (customText?: string) => {
    const textToSend = customText || workbenchInput.trim();
    if (!textToSend || isWorkbenchLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user' as const, text: textToSend, time };
    setWorkbenchChat((prev) => [...prev, userMsg]);
    setWorkbenchInput('');
    setIsWorkbenchLoading(true);

    try {
      const history = workbenchChat.map((c) => ({ role: c.role, text: c.text }));
      const reply = await chatWithWorker(textToSend, history);
      setWorkbenchChat((prev) => [
        ...prev,
        {
          role: 'model',
          text: reply || 'ขออภัย ไม่สามารถประมวลผลคำตอบได้ในขณะนี้',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e: any) {
      setWorkbenchChat((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsWorkbenchLoading(false);
      setTimeout(() => {
        workbenchChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Quick file scan in workbench
  const handleWorkbenchFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setIsWorkbenchScanning(true);
      try {
        const result = await scanChartWithWorker(base64);
        if (result) {
          setWorkbenchScanResult(result);
          // Add to chat
          setWorkbenchChat((prev) => [
            ...prev,
            {
              role: 'model',
              text: `🔍 ตรวจพบ: ${result.patternName}\n• ทิศทาง: ${result.sentiment || result.signal}\n• ความแม่นยำ: ${result.confidence}%\n• การวิเคราะห์: ${result.analysis || result.summary}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsWorkbenchScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const totalBookmarkedCount =
    activeTab === 'shorts' ? bookmarkedClipIds.length : bookmarkedIds.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      {/* High Density Header with Tab Switcher */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalPatterns={CANDLESTICK_PATTERNS.length}
        totalClips={sheetClips.length}
        bookmarkedCount={totalBookmarkedCount}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksOnly={() => setShowBookmarksOnly((prev) => !prev)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenChat={() => handleOpenChat()}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row overflow-hidden pb-20 lg:pb-6 px-2.5 sm:px-4 md:px-6 pt-3">
        {/* VIEW 1: Shorts Video Hub (Default Home Page) */}
        {activeTab === 'shorts' ? (
          <div className="flex-1 w-full flex flex-col">
            <ShortsVideoHub
              clips={sheetClips}
              isLoading={isSheetLoading}
              onRefresh={loadSheetData}
              onSelectClip={handleSelectClip}
              bookmarkedClipIds={bookmarkedClipIds}
              onToggleBookmarkClip={toggleBookmarkClip}
              onAskAi={handleOpenChat}
            />
          </div>
        ) : (
          /* VIEW 2: Candlestick Pattern Browser + Workbench */
          <div className="flex-1 w-full flex flex-col lg:flex-row gap-4">
            {/* Left Section: Candlestick Pattern Browser */}
            <section
              className="flex-1 lg:w-[60%] xl:w-[62%] flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs touch-pan-y"
              onTouchStart={handleCandleTouchStart}
              onTouchEnd={handleCandleTouchEnd}
            >
              {/* Sub-header Controls: Search & Category Filter */}
              <div className="p-3 sm:p-4 bg-white border-b border-slate-200/80 space-y-3">
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                {/* Results Count & Current View info */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5 uppercase text-[11px] tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    <span>
                      พบ <strong className="text-teal-700 font-bold">{filteredPatterns.length}</strong>{' '}
                      รูปแบบ
                    </span>
                    {showBookmarksOnly && (
                      <span className="text-amber-600 font-bold">(ที่บันทึกไว้)</span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    หน้า {currentPage}/{totalPages} (10 / หน้า)
                  </span>
                </div>
              </div>

              {/* Pattern Cards List - Lightweight & Fast */}
              <div className="flex-1 p-3 sm:p-4 space-y-2.5 overflow-y-auto">
                {paginatedPatterns.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {paginatedPatterns.map((pattern) => (
                      <PatternCard
                        key={pattern.id}
                        pattern={pattern}
                        onClick={setActiveDetailPattern}
                        isBookmarked={bookmarkedIds.includes(pattern.id)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 px-4 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">ไม่พบรูปแบบแท่งเทียนที่ค้นหา</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      ลองเปลี่ยนคำค้นหา หรือคลิกปุ่มรีเซ็ตเพื่อแสดงรูปแบบแท่งเทียนทั้งหมด
                    </p>
                    <button
                      type="button"
                      onClick={handleResetToHome}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      ล้างตัวกรองทั้งหมด
                    </button>
                  </div>
                )}
              </div>

              {/* Candlestick Pagination Footer */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700">
                    <span>หน้า {currentPage}</span>
                    <span className="text-slate-400 font-normal">/ {totalPages}</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400">สไลด์ซ้าย/ขวาเพื่อเปลี่ยนหน้า</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-white shadow-xs shadow-teal-600/20 transition-colors cursor-pointer active:scale-95"
                >
                  <span>ถัดไป</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Right Section: AI Workbench & Live Chat (Desktop) */}
            <section className="hidden lg:flex lg:w-[40%] xl:w-[38%] flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-none">
                      AI Technical Analyst
                    </h3>
                    <p className="text-[10px] text-teal-700 font-mono mt-0.5">Price Action Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold border border-teal-200 transition-colors cursor-pointer"
                    title="อัปโหลดภาพกราฟเพื่อสแกน"
                  >
                    <Upload className="w-3 h-3" />
                    <span>สแกนภาพ</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleWorkbenchFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/40 max-h-[560px]">
                {workbenchChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-teal-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9.5px] text-slate-400 font-mono mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
                {isWorkbenchLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    <span>AI กำลังวิเคราะห์ข้อมูล...</span>
                  </div>
                )}
                <div ref={workbenchChatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-2.5 border-t border-slate-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleWorkbenchSend();
                  }}
                  className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-teal-600 rounded-xl p-1 transition-colors"
                >
                  <input
                    type="text"
                    value={workbenchInput}
                    onChange={(e) => setWorkbenchInput(e.target.value)}
                    placeholder="พิมพ์คำถาม Price Action, แท่งเทียน, เทรดเดอร์..."
                    className="flex-1 bg-transparent px-2.5 py-1.5 text-xs outline-none text-slate-800 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!workbenchInput.trim() || isWorkbenchLoading}
                    className="w-7 h-7 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-lg flex items-center justify-center text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Floating Action Buttons Group - ปุ่มทดสอบความรู้แท่งเทียนอยู่บนปุ่มบันทึกรายการโปรด */}
      <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        {/* 1. ปุ่มทดสอบความรู้แท่งเทียน (Floating Quiz Game FAB) - อยู่จุดเดียวบนปุ่มบันทึกรายการโปรด */}
        <button
          type="button"
          id="floating-quiz-fab"
          onClick={() => setIsQuizOpen(true)}
          className="p-3 sm:p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-xl shadow-amber-500/30 border border-amber-400 flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
          title="แบบทดสอบความรู้แท่งเทียน (Quiz)"
        >
          <div className="flex items-center gap-1.5">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold font-sans hidden sm:inline">
              ทดสอบความรู้แท่งเทียน
            </span>
          </div>
        </button>

        {/* 2. ปุ่มบันทึกรายการโปรด (Floating Bookmarks FAB) - อยู่ล่างปุ่มทดสอบความรู้แท่งเทียน */}
        <button
          type="button"
          id="floating-bookmark-fab"
          onClick={() => {
            setShowBookmarksOnly((prev) => !prev);
            if (activeTab === 'candlestick') {
              setCurrentPage(1);
            }
          }}
          className={`p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
            showBookmarksOnly
              ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/30 ring-4 ring-amber-500/20'
              : 'bg-white text-amber-600 border-slate-200 hover:border-amber-400 shadow-slate-900/10'
          }`}
          title="รายการที่บันทึกไว้ (Bookmarks)"
        >
          <div className="relative flex items-center gap-1.5">
            <Bookmark
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                showBookmarksOnly ? 'fill-white' : 'fill-amber-500 text-amber-600'
              }`}
            />
            <span className="text-xs font-bold font-sans hidden sm:inline">
              {showBookmarksOnly ? 'แสดงทั้งหมด' : 'ที่บันทึก'}
            </span>
            {totalBookmarkedCount > 0 && (
              <span className="absolute -top-3 -right-3 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[9.5px] font-mono shadow-xs">
                {totalBookmarkedCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Floating Bottom Navigation Bar for Mobile Devices - 3 Core Buttons */}
      <div className="lg:hidden fixed bottom-3 left-0 right-0 z-30 flex items-center justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-1.5 shadow-xl w-full max-w-[360px] grid grid-cols-3 gap-1.5">
          {/* 1. ปุ่มหน้าแรก / คลิปสอน */}
          <button
            type="button"
            id="mobile-nav-shorts-btn"
            onClick={() => {
              setActiveTab('shorts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl font-bold text-[11px] border active:scale-95 cursor-pointer transition-all shadow-xs ${
              activeTab === 'shorts'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="หน้าแรก คลิปสอนเทรด"
          >
            <Film className={`w-4 h-4 mb-0.5 ${activeTab === 'shorts' ? 'text-white' : 'text-teal-600'}`} />
            <span className="truncate">คลิปสอน</span>
          </button>

          {/* 2. ปุ่มแท่งเทียน */}
          <button
            type="button"
            id="mobile-nav-candlestick-btn"
            onClick={() => {
              setActiveTab('candlestick');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl font-bold text-[11px] border active:scale-95 cursor-pointer transition-all shadow-xs ${
              activeTab === 'candlestick'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="รูปแบบแท่งเทียน"
          >
            <BarChart3 className={`w-4 h-4 mb-0.5 ${activeTab === 'candlestick' ? 'text-white' : 'text-teal-600'}`} />
            <span className="truncate">แท่งเทียน</span>
          </button>

          {/* 3. เมนูสไลด์แสดงหมวดหมู่ */}
          <button
            type="button"
            id="floating-category-drawer-btn"
            onClick={() => setIsCategoryDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] active:scale-95 cursor-pointer transition-all shadow-xs"
            title="เมนูสไลด์แสดงหมวดหมู่"
          >
            <Layers className="w-4 h-4 mb-0.5 text-slate-500" />
            <span className="truncate">หมวดหมู่</span>
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        clip={activeVideoClip}
        onClose={() => setActiveVideoClip(null)}
        onPrev={handlePrevClip}
        onNext={handleNextClip}
        hasPrev={activeVideoIndex > 0}
        hasNext={activeVideoIndex < sheetClips.length - 1}
        onAskAi={handleOpenChat}
        isBookmarked={activeVideoClip ? bookmarkedClipIds.includes(activeVideoClip.id) : false}
        onToggleBookmark={(clipId) => toggleBookmarkClip(clipId)}
      />

      {/* Pattern Detail Modal */}
      <PatternDetailModal
        pattern={activeDetailPattern}
        onClose={() => setActiveDetailPattern(null)}
        isBookmarked={activeDetailPattern ? bookmarkedIds.includes(activeDetailPattern.id) : false}
        onToggleBookmark={toggleBookmark}
        onAskAi={handleOpenChat}
      />

      {/* Category Drawer Modal */}
      <CategoryDrawerModal
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setActiveTab('candlestick');
          setSelectedCategory(catId);
          setCurrentPage(1);
          setShowBookmarksOnly(false);
        }}
        patterns={CANDLESTICK_PATTERNS}
      />

      {/* AI Chat Modal */}
      <AiChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialPrompt(undefined);
        }}
        initialPrompt={chatInitialPrompt}
      />

      {/* Image Scanner Modal */}
      <ImageScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onOpenChatWithAnalysis={handleOpenChat}
      />

      {/* Quiz Game Modal */}
      <QuizGameModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        patterns={CANDLESTICK_PATTERNS}
      />

      {/* Trading Glossary Modal */}
      <TradingGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        onAskAi={handleOpenChat}
      />
    </div>
  );
}
