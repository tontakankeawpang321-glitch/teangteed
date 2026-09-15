import React, { useState, useMemo, useRef } from 'react';
import { VideoClip } from '../services/sheetService';
import {
  Play,
  Search,
  X,
  RefreshCw,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Film,
  Sparkles,
  ExternalLink,
  Layers,
  Share2,
  Loader2,
} from 'lucide-react';

interface ShortsVideoHubProps {
  clips: VideoClip[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectClip: (clip: VideoClip, index: number) => void;
  bookmarkedClipIds: string[];
  onToggleBookmarkClip: (id: string, e: React.MouseEvent) => void;
  onAskAi: (prompt: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const ShortsVideoHub: React.FC<ShortsVideoHubProps> = ({
  clips,
  isLoading,
  onRefresh,
  onSelectClip,
  bookmarkedClipIds,
  onToggleBookmarkClip,
  onAskAi,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Swipe gesture detection ref
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Check if horizontal swipe exceeds threshold and dominant over vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped Left -> Go Next
        if (validPage < totalPages) {
          handlePageChange(validPage + 1);
        }
      } else {
        // Swiped Right -> Go Prev
        if (validPage > 1) {
          handlePageChange(validPage - 1);
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Extract unique categories from sheet data
  const categories = useMemo(() => {
    const set = new Set<string>();
    clips.forEach((c) => {
      if (c.category && c.category.trim()) {
        set.add(c.category.trim());
      }
    });
    return Array.from(set);
  }, [clips]);

  // Filtered clips
  const filteredClips = useMemo(() => {
    return clips.filter((clip) => {
      // If bookmarks only
      if (showBookmarksOnly && !bookmarkedClipIds.includes(clip.id)) {
        return false;
      }

      // If category selected
      if (selectedCategory !== 'all' && clip.category !== selectedCategory) {
        return false;
      }

      // If search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = clip.title?.toLowerCase().includes(q);
        const matchDesc = clip.description?.toLowerCase().includes(q);
        const matchCat = clip.category?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat;
      }

      return true;
    });
  }, [clips, showBookmarksOnly, bookmarkedClipIds, selectedCategory, searchQuery]);

  // Pagination calculation: 10 clips per page
  const totalPages = Math.max(1, Math.ceil(filteredClips.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedClips = useMemo(() => {
    const start = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredClips.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClips, validPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="w-full space-y-3 sm:space-y-4 pb-20 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Search & Top Action Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3.5 shadow-xs space-y-2.5">
        {/* Search & Sync Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="shorts-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาคลิปสอนเทรด, แท่งเทียน, Price Action, SMC..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sync / Refresh Button */}
          <button
            type="button"
            id="refresh-sheet-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-teal-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer active:scale-95 shrink-0"
            title="ซิงค์ข้อมูลล่าสุดจาก Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">ซิงค์ชีต</span>
          </button>

          {/* Filter Bookmarks Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowBookmarksOnly((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer active:scale-95 shrink-0 ${
              showBookmarksOnly
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="ดูเฉพาะคลิปที่บันทึกไว้"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-amber-500 text-amber-600' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">ที่บันทึก</span>
            {bookmarkedClipIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold text-[9px] font-mono">
                {bookmarkedClipIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Category Chips from Sheet */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 text-xs ${
                selectedCategory === 'all'
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
              }`}
            >
              ทั้งหมด ({clips.length})
            </button>
            {categories.map((cat) => {
              const isSel = selectedCategory === cat;
              const count = clips.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 text-xs ${
                    isSel
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Header Info & Count */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-700 font-bold font-sans">คลิปสอนเทรดจากชีต</span>
          <span className="text-slate-400">•</span>
          <span>พบ {filteredClips.length} คลิป</span>
        </div>
        <div className="text-[11px] text-teal-700 font-medium">
          หน้า {validPage}/{totalPages} (สไลด์ข้างหรือกดปุ่มเพื่อเปลี่ยนหน้า)
        </div>
      </div>

      {/* Loading state */}
      {isLoading && clips.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">กำลังเชื่อมต่อและโหลดข้อมูลจาก Google Sheet...</p>
          <p className="text-xs text-slate-400">ดึงข้อมูลเฉพาะคลิปที่มีในชีต</p>
        </div>
      ) : paginatedClips.length > 0 ? (
        /* 2-Columns Shorts Grid Layout */
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          {paginatedClips.map((clip, index) => {
            const isBookmarked = bookmarkedClipIds.includes(clip.id);
            const globalIndex = (validPage - 1) * ITEMS_PER_PAGE + index;

            return (
              <div
                key={clip.id}
                id={`shorts-card-${clip.id}`}
                onClick={() => onSelectClip(clip, globalIndex)}
                className="group relative bg-white border border-slate-200/90 hover:border-teal-400 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col active:scale-[0.99] select-none"
              >
                {/* 9:14 Aspect Ratio Thumbnail Container */}
                <div className="relative w-full aspect-[9/13] bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={clip.thumbnailUrl}
                    alt={clip.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      // Fallback image if thumbnail fails
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Dark gradient overlay for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                  {/* Top Category Badge & Bookmark Button */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-xs text-teal-300 border border-teal-500/30 truncate max-w-[70%]">
                      {clip.category || 'สอนเทรด'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => onToggleBookmarkClip(clip.id, e)}
                      className={`p-1.5 rounded-lg backdrop-blur-xs transition-colors cursor-pointer active:scale-90 ${
                        isBookmarked
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
                      }`}
                      title={isBookmarked ? 'ลบจากบุ๊กมาร์ก' : 'บันทึกคลิป'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 group-hover:scale-110 group-active:scale-95 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Text Over Thumbnail */}
                  <div className="absolute bottom-2 left-2 right-2 z-10">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-sm group-hover:text-teal-200 transition-colors">
                      {clip.title}
                    </h4>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="p-2 sm:p-2.5 bg-white flex flex-col justify-between flex-1">
                  {clip.description ? (
                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal font-normal">
                      {clip.description}
                    </p>
                  ) : (
                    <p className="text-[11px] text-teal-700 font-medium">กดเพื่อเปิดดูคลิป Shorts</p>
                  )}

                  <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                    <span className="text-teal-700 font-semibold flex items-center gap-0.5">
                      <Play className="w-2.5 h-2.5 fill-teal-600 text-teal-600" />
                      เปิดดูคลิป
                    </span>
                    <span className="text-slate-400">Shorts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <Film className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h4 className="font-bold text-sm text-slate-800">
              {showBookmarksOnly
                ? 'ยังไม่มีคลิปที่บันทึกไว้'
                : searchQuery
                ? `ไม่พบคลิปที่ตรงกับ "${searchQuery}"`
                : 'ไม่พบข้อมูลคลิปในชีต'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {showBookmarksOnly
                ? 'กดที่ไอคอนรูปบุ๊กมาร์กบนการ์ดคลิป เพื่อบันทึกคลิปที่คุณสนใจ'
                : searchQuery
                ? 'ลองเปลี่ยนคำค้นหา หรือคลิกล้างตัวกรอง'
                : 'ระบบแสดงเฉพาะข้อมูลที่มีใน Google Sheet เท่านั้น หากเพิ่มข้อมูลในชีตแล้วให้กดปุ่ม "ซิงค์ชีต"'}
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'all' || showBookmarksOnly) ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowBookmarksOnly(false);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          ) : (
            <button
              type="button"
              onClick={onRefresh}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
            >
              ซิงค์ข้อมูลจากชีตอีกครั้ง
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls - 10 Clips Per Page with Swipe Indicator */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs">
          <button
            type="button"
            id="prev-page-shorts-btn"
            onClick={() => handlePageChange(validPage - 1)}
            disabled={validPage <= 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700">
              <span>หน้า {validPage}</span>
              <span className="text-slate-400 font-normal">/ {totalPages}</span>
            </div>
            <span className="text-[9.5px] text-slate-400">สไลด์ซ้าย/ขวาเพื่อเปลี่ยนหน้า</span>
          </div>

          <button
            type="button"
            id="next-page-shorts-btn"
            onClick={() => handlePageChange(validPage + 1)}
            disabled={validPage >= totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-xs shadow-xs shadow-teal-600/20 transition-colors cursor-pointer active:scale-95"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
