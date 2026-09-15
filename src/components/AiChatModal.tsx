import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithWorker } from '../services/aiWorkerService';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Zap,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  '⚡ 3 แท่งเทียนกลับตัวที่แม่นยำที่สุด',
  '🎯 วิธีตั้ง Stop Loss ไม่ให้โดน Stop Hunt',
  '📊 สอนดู FVG ร่วมกับแท่งเทียน',
  '🔥 ความลับของ Pin Bar และ Liquidity Sweep',
  '💡 จิตวิทยาแท่งเทียน Doji ในแนวรับต้าน',
];

export const AiChatModal: React.FC<AiChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'สวัสดีครับ! ผมคือ **AI Candlestick & Technical Analyst** 📈 ผู้ช่วยวิเคราะห์กราฟและพฤติกรรมราคา (Price Action) \n\nคุณสามารถพิมพ์ถามเกี่ยวกับรูปแบบแท่งเทียน, จิตวิทยาตลาด, จุดเข้า Entry/SL/TP, หรือกลยุทธ์ SMC ได้เลยครับ!',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history format
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.content,
        }));

      const reply = await chatWithWorker(query, history);

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: reply || 'ขออภัย ไม่สามารถประมวลผลคำตอบได้',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: `⚠️ ขออภัยครับ: ${err.message || 'ไม่สามารถติดต่อ AI Analyst ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'เริ่มการสนทนาใหม่แล้วครับ! คุณสามารถถามคำถามเกี่ยวกับแท่งเทียนและการวิเคราะห์ทางเทคนิคได้เลยครับ 📈',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div
      id="ai-chat-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-hidden overscroll-contain"
      onClick={onClose}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative w-full max-w-lg h-[90vh] max-h-[720px] bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col overflow-hidden text-slate-800 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center shadow-xs text-white font-bold shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">AI Trading Analyst</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                </span>
              </div>
              <p className="text-[10px] text-teal-700 font-mono font-medium">Gemini Technical Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              title="ล้างแชท"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="close-ai-chat-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 text-xs bg-slate-50/50 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isBot
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                    isBot
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-teal-600 text-white font-medium rounded-tr-xs'
                  }`}
                >
                  {isBot ? (
                    <div className="prose prose-xs max-w-none space-y-2 text-slate-800">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}

                  {/* Copy button for bot message */}
                  {isBot && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.id, m.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 right-2 p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-[10px] flex items-center gap-1 shadow-xs border border-slate-200 cursor-pointer"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> คัดลอกแล้ว
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> คัดลอก
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse text-teal-700" />
              </div>
              <div className="bg-white border border-slate-200 shadow-xs rounded-2xl px-4 py-3 text-slate-700 flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">AI กำลังวิเคราะห์กราฟ...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-slate-700 border border-slate-200 transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถาม หรือชื่อแท่งเทียนที่ต้องการวิเคราะห์..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
            <button
              type="submit"
              id="send-chat-btn"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-all shadow-sm shadow-teal-600/20 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
