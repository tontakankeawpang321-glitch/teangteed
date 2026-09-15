import React, { useState, useRef, useEffect } from 'react';
import { ChartScanResult } from '../types';
import {
  scanChartWithWorker,
  checkWorkerHealth,
  CLOUDFLARE_WORKER_URL,
  WorkerStatus,
} from '../services/aiWorkerService';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldAlert,
  BrainCircuit,
  MessageSquareShare,
  CheckCircle,
  FileImage,
  Zap,
  Globe,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface ImageScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithAnalysis: (prompt: string) => void;
}

export const ImageScannerModal: React.FC<ImageScannerModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithAnalysis,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ChartScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Check Cloudflare Worker connectivity
  useEffect(() => {
    if (isOpen) {
      checkWorkerHealth().then((status) => {
        setWorkerStatus(status);
      });
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setIsCameraActive(false);
      setErrorMsg('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตสิทธิ์กล้อง หรือใช้การอัปโหลดรูปภาพ');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setErrorMsg(null);
      setScanResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScanImage = async () => {
    if (!selectedImage || isScanning) return;

    setIsScanning(true);
    setErrorMsg(null);
    setScanResult(null);

    try {
      const result = await scanChartWithWorker(selectedImage);
      setScanResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการวิเคราะห์กราฟด้วย Cloudflare Worker AI');
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    stopCamera();
    setSelectedImage(null);
    setScanResult(null);
    setErrorMsg(null);
  };

  return (
    <div
      id="image-scanner-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain"
      onClick={() => {
        stopCamera();
        onClose();
      }}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden my-auto max-h-[88vh] overflow-y-auto overscroll-contain text-slate-800 p-4 sm:p-5 space-y-3"
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center shadow-xs text-white shrink-0">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">AI Chart Scanner</h3>
              <p className="text-[10.5px] text-teal-700 font-mono font-medium">สแกนแท่งเทียน & วิเคราะห์กราฟ</p>
            </div>
          </div>

          <button
            type="button"
            id="close-image-scanner-btn"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worker API Status Badge (GitHub-Ready) */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                workerStatus?.online ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'
              }`}
            ></span>
            <span className="font-semibold text-slate-800 shrink-0">Worker API:</span>
            <span className="font-mono text-[10.5px] text-teal-700 truncate max-w-[190px] sm:max-w-none">
              tengteed.tontakankeawpang321.workers.dev
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-600" /> ฝังลง GitHub ได้
          </span>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Camera / Upload Section */}
        {!selectedImage && !isCameraActive && (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-teal-50/30 transition-all flex flex-col items-center justify-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 group-hover:scale-110 transition-transform flex items-center justify-center border border-teal-200">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">อัปโหลดภาพกราฟหรือแคปหน้าจอ</p>
                <p className="text-xs text-slate-500 mt-0.5">รองรับไฟล์ PNG, JPG, WebP หรือกราฟ MT4/TradingView</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 uppercase font-mono">หรือ</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button
              type="button"
              id="start-camera-btn"
              onClick={startCamera}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Camera className="w-4 h-4 text-teal-600" />
              เปิดกล้องถ่ายรูปกราฟแบบเรียลไทม์
            </button>
          </div>
        )}

        {/* Active Camera View */}
        {isCameraActive && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-300 flex items-center justify-center">
              <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
              {/* Scan overlay grid */}
              <div className="absolute inset-0 pointer-events-none border-2 border-teal-500/40 rounded-2xl m-2">
                <div className="w-full h-full flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-teal-400"></div>
                    <div className="w-4 h-4 border-t-2 border-r-2 border-teal-400"></div>
                  </div>
                  <p className="text-center text-[11px] text-teal-200 bg-slate-900/80 py-0.5 px-2 rounded-full mx-auto backdrop-blur-xs">
                    เล็งกรอบให้ตรงกับแท่งเทียนที่ต้องการสแกน
                  </p>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-teal-400"></div>
                    <div className="w-4 h-4 border-b-2 border-r-2 border-teal-400"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                id="capture-photo-btn"
                onClick={capturePhoto}
                className="flex-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                ถ่ายภาพ & นำไปวิเคราะห์
              </button>
            </div>
          </div>
        )}

        {/* Selected Image Preview & Scan Action */}
        {selectedImage && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 max-h-56 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected chart"
                className="max-h-56 w-full object-contain"
              />
              <button
                type="button"
                onClick={handleReset}
                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg backdrop-blur-xs border border-slate-200 shadow-xs cursor-pointer"
                title="เปลี่ยนรูปภาพ"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {!scanResult && !isScanning && (
              <button
                type="button"
                id="run-ai-scan-btn"
                onClick={handleScanImage}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                เริ่มวิเคราะห์แท่งเทียนด้วย AI (Scan Chart)
              </button>
            )}

            {isScanning && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-teal-200 flex flex-col items-center justify-center space-y-2 text-center">
                <div className="w-10 h-10 rounded-full border-3 border-teal-200 border-t-teal-600 animate-spin"></div>
                <p className="text-xs font-semibold text-slate-800">AI กำลังอ่านพฤติกรรมแท่งเทียนและโครงสร้างราคา...</p>
                <p className="text-[11px] text-slate-500 font-mono">กำลังประมวลผลด้วย Gemini Vision Engine</p>
              </div>
            )}
          </div>
        )}

        {/* Scan Result Card */}
        {scanResult && (
          <div className="space-y-3 bg-slate-50 border border-teal-200 rounded-2xl p-4 text-xs animate-fade-in shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[11px] text-slate-500 font-mono">ผลการตรวจจับ</span>
                <h4 className="text-base font-bold text-teal-800">{scanResult.patternName}</h4>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  แม่นยำ {scanResult.confidence}%
                </span>
                <div className="text-[11px] mt-0.5">
                  {scanResult.sentiment === 'Bullish' ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3" /> ขาขึ้น (Bullish)
                    </span>
                  ) : scanResult.sentiment === 'Bearish' ? (
                    <span className="text-rose-700 font-semibold flex items-center gap-1 justify-end">
                      <TrendingDown className="w-3 h-3" /> ขาลง (Bearish)
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">ไซด์เวย์ (Neutral)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis & Details */}
            <div className="text-slate-700 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-900 flex items-center gap-1">
                <BrainCircuit className="w-4 h-4 text-teal-600" />
                บทวิเคราะห์พฤติกรรมราคา:
              </p>
              <div className="prose prose-xs text-slate-700">
                <Markdown>{scanResult.analysis}</Markdown>
              </div>
            </div>

            {/* Trading Signals Box */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-teal-600" /> คำแนะนำจุดเข้าและ Stop Loss
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-teal-700 font-mono font-semibold block">จุดเข้า (Entry):</span>
                  <span className="text-slate-800">{scanResult.entrySuggestion || 'รอสัญญาณแท่งเทียนคอนเฟิร์ม'}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-rose-200">
                  <span className="text-rose-700 font-mono font-semibold block">Stop Loss (SL):</span>
                  <span className="text-slate-800">{scanResult.stopLossSuggestion || 'ตั้งใต้ Low/เหนือ High ของแท่ง'}</span>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            {scanResult.advice && (
              <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                💡 <strong>คำแนะนำเสริม:</strong> {scanResult.advice}
              </p>
            )}

            {/* Action to chat with AI about this result */}
            <button
              type="button"
              id="chat-about-scan-btn"
              onClick={() => {
                const prompt = `ช่วยอธิบายและวางแผนการเทรดอย่างละเอียดจากผลการสแกนกราฟนี้: รูปแบบที่ตรวจพบคือ "${scanResult.patternName}" (${scanResult.sentiment}) ความแม่นยำ ${scanResult.confidence}% \n\nบทวิเคราะห์: ${scanResult.analysis}`;
                onClose();
                onOpenChatWithAnalysis(prompt);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageSquareShare className="w-4 h-4" />
              ปรึกษา AI Analyst ต่อเนื่องจากภาพนี้
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
