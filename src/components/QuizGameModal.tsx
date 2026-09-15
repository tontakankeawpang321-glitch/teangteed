import React, { useState, useEffect } from 'react';
import { CandlestickPattern } from '../types';
import { CandleVisualizer } from './CandleVisualizer';
import { X, Award, CheckCircle, XCircle, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  patterns: CandlestickPattern[];
}

export const QuizGameModal: React.FC<QuizGameModalProps> = ({
  isOpen,
  onClose,
  patterns,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizPatterns, setQuizPatterns] = useState<
    { target: CandlestickPattern; options: string[] }[]
  >([]);

  useEffect(() => {
    if (isOpen && patterns.length > 4) {
      initQuiz();
    }
  }, [isOpen, patterns]);

  const initQuiz = () => {
    // Shuffle and pick 5 quiz questions
    const shuffled = [...patterns].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const questions = selected.map((target) => {
      // Pick 3 wrong options
      const otherPatterns = patterns.filter((p) => p.id !== target.id);
      const wrongOptions = otherPatterns
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((p) => p.name);
      const allOptions = [...wrongOptions, target.name].sort(() => 0.5 - Math.random());
      return { target, options: allOptions };
    });

    setQuizPatterns(questions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (!isOpen || quizPatterns.length === 0) return null;

  const currentQ = quizPatterns[currentIndex];
  const isFinished = currentIndex >= quizPatterns.length;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.target.name;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizPatterns.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCurrentIndex(quizPatterns.length);
      if (score + (selectedOption === currentQ.target.name ? 1 : 0) >= 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  return (
    <div
      id="quiz-game-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain"
      onClick={onClose}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden my-auto max-h-[88vh] overflow-y-auto overscroll-contain text-slate-800 p-4 sm:p-5 space-y-3"
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-xs text-white shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">ทดสอบความรู้แท่งเทียน</h3>
              <p className="text-[10.5px] text-amber-700 font-mono font-medium">
                {isFinished ? 'จบการทดสอบ' : `ข้อที่ ${currentIndex + 1} จาก 5 | คะแนน: ${score}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-4">
            {/* Candle Visualizer Question */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col items-center">
              <p className="text-xs text-slate-500 mb-2 font-mono">ภาพแท่งเทียนนี้คือรูปแบบใด?</p>
              <CandleVisualizer candles={currentQ.target.candles} height={130} width={240} />
            </div>

            {/* Multiple choices */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isCorrect = option === currentQ.target.name;
                const isSelected = selectedOption === option;

                let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-800 line-through';
                  } else {
                    btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 animate-fade-in">
                <p className="font-semibold text-teal-800">
                  {selectedOption === currentQ.target.name ? '🎉 ถูกต้อง!' : '❌ ยังไม่ถูกต้อง'}
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {currentQ.target.summary}
                </p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full mt-2 py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {currentIndex + 1 < quizPatterns.length ? 'ข้อถัดไป ➔' : 'ดูผลคะแนนรวม 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shadow-xs">
              <Award className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">สรุปผลการทดสอบ</h4>
              <p className="text-2xl font-black text-amber-600 mt-1 font-mono">
                {score} / 5 คะแนน
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {score === 5
                  ? '🔥 ยอดเยี่ยมมาก! คุณคือเซียนแท่งเทียนระดับปรมาจารย์'
                  : score >= 3
                  ? '👍 ทำได้ดีมาก! มีความรู้ความเข้าใจในแท่งเทียนอย่างดี'
                  : '💡 หมั่นทบทวนรูปแบบแท่งเทียนในคลังเพื่อเพิ่มความแม่นยำครับ'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={initQuiz}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> เล่นใหม่อีกรอบ
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
