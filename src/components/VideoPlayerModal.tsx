import React, { useRef } from 'react';
import { VideoClip } from '../services/sheetService';
import {
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Bookmark,
  Play,
  Film,
} from 'lucide-react';

interface VideoPlayerModalProps {
  clip: VideoClip | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onAskAi?: (prompt: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (clipId: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  clip,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  onAskAi,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  if (!clip) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && hasNext && onNext) {
        // Swiped left -> Next clip
        onNext();
      } else if (deltaX > 0 && hasPrev && onPrev) {
        // Swiped right -> Previous clip
        onPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleShare = async () => {
    if (navigator.share && clip.url) {
      try {
        await navigator.share({
          title: clip.title,
          text: clip.description,
          url: clip.url,
        });
      } catch (err) {
        // Fallback copy
        navigator.clipboard?.writeText(clip.url);
      }
    } else if (clip.url) {
      navigator.clipboard?.writeText(clip.url);
    }
  };

  return (
    <div
      id="video-player-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overscroll-contain"
      onClick={onClose}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 truncate">
              {clip.category || 'คลิปสอนเทรด'}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Shorts</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(clip.id)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer active:scale-95 ${
                  isBookmarked
                    ? 'text-amber-400 bg-amber-500/20 border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
                }`}
                title={isBookmarked ? 'ลบจากบุ๊กมาร์ก' : 'บันทึกคลิปนี้'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer active:scale-95"
              title="แชร์คลิป"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="close-video-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer active:scale-95"
              title="ปิดวิดีโอ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Container - 9:16 Aspect Ratio */}
        <div className="relative w-full aspect-[9/14] sm:aspect-[9/13] max-h-[58vh] bg-black flex items-center justify-center overflow-hidden">
          {clip.embedUrl ? (
            <iframe
              src={clip.embedUrl}
              title={clip.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Film className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">ไม่สามารถโหลดตัวเล่นวิดีโอได้</p>
              {clip.url && (
                <a
                  href={clip.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 px-4 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  เปิดดูบนเบราว์เซอร์
                </a>
              )}
            </div>
          )}

          {/* Quick Prev / Next overlay arrows for fast mobile flipping */}
          {hasPrev && onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer active:scale-90 z-10"
              title="คลิปก่อนหน้า (หรือสไลด์ขวา)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {hasNext && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer active:scale-90 z-10"
              title="คลิปถัดไป (หรือสไลด์ซ้าย)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Video Info and Actions Footer */}
        <div className="p-3 sm:p-4 bg-slate-900 space-y-2.5 shrink-0 overflow-y-auto max-h-[30vh]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
              {clip.title}
            </h3>
            {clip.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {clip.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-800 flex-wrap">
            {clip.url && (
              <a
                href={clip.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer active:scale-[0.98]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                เปิดลิงก์ต้นฉบับ
              </a>
            )}

            {onAskAi && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskAi(
                    `ช่วยอธิบายสรุปสาระสำคัญ และเทคนิคการเทรดจากหัวข้อ "${clip.title}" (${clip.category}): "${clip.description}" แบบนำไปใช้เทรดจริงได้ทันที`
                  );
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20 transition-colors cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                ถาม AI เกี่ยวกับคลิปนี้
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
