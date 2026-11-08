import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';
import { PatronesQuestion } from '../types/math';
import { PATRONES_QUESTIONS } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { VoiceControl } from './VoiceControl';
import confetti from 'canvas-confetti';

interface PatronesGameProps {
  onCompleteExercise: (correct: boolean) => void;
}

export const PatronesGame: React.FC<PatronesGameProps> = ({ onCompleteExercise }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const currentQ: PatronesQuestion = PATRONES_QUESTIONS[currentIndex % PATRONES_QUESTIONS.length];

  useEffect(() => {
    setSelectedOption(null);
    setFeedback('idle');
    const timer = setTimeout(() => {
      soundManager.speak(currentQ.audioText);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentIndex, currentQ]);

  const handleSelect = (option: number | string) => {
    if (feedback === 'correct') return;
    setSelectedOption(option);

    if (option === currentQ.correctAnswer) {
      setFeedback('correct');
      soundManager.playSuccess();
      soundManager.speak(`¡Excelente! La respuesta correcta es ${option}. ${currentQ.explanation}`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Casi, observa el patrón que se repite.`);
      onCompleteExercise(false);
    }
  };

  const handleVoiceNumber = (num: number) => {
    if (currentQ.options.includes(num)) {
      handleSelect(num);
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd === 'repetir') soundManager.speak(currentQ.audioText);
    if (cmd === 'siguiente' && feedback === 'correct') handleNext();
  };

  const handleNext = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Exercise card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm text-center">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 rounded-full text-xs font-bold">
            Patrones y Secuencias · Pregunta { (currentIndex % PATRONES_QUESTIONS.length) + 1 } / { PATRONES_QUESTIONS.length }
          </span>
          <AudioButton textToRead={currentQ.audioText} size="sm" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          {currentQ.instruction}
        </h2>

        {/* Visual sequence slots */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap my-6 py-4 px-2 bg-sky-50/50 dark:bg-slate-900/60 rounded-2xl border border-sky-100 dark:border-slate-700">
          {currentQ.sequence.map((item, idx) => {
            const isMissing = item === null;
            return (
              <div
                key={idx}
                className={`flex items-center justify-center rounded-2xl font-black text-2xl sm:text-3xl transition-all ${
                  isMissing
                    ? 'w-14 h-14 sm:w-16 sm:h-16 border-3 border-dashed border-sky-400 bg-white dark:bg-slate-800 text-sky-600 shadow-md animate-pulse'
                    : 'w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                }`}
              >
                {isMissing ? (
                  feedback === 'correct' ? (
                    <span className="text-emerald-600 dark:text-emerald-400">{currentQ.correctAnswer}</span>
                  ) : (
                    <span className="text-sky-500 font-mono font-bold">?</span>
                  )
                ) : (
                  <span>{item}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Voice control assistant */}
        <div className="my-4">
          <VoiceControl
            onNumberDetected={handleVoiceNumber}
            onCommandDetected={handleVoiceCommand}
            targetHint="Di el número o figura que falta"
          />
        </div>

        {/* Options to pick from */}
        <div className="mt-6">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Elige la respuesta correcta:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isThisCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';

              if (feedback === 'correct' && isThisCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200';
              } else if (feedback === 'incorrect' && isSelected) {
                btnStyle = 'bg-rose-100 text-rose-800 border-2 border-rose-300';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={feedback === 'correct'}
                  onClick={() => handleSelect(opt)}
                  className={`h-16 sm:h-20 rounded-2xl text-2xl sm:text-3xl font-black shadow-sm transition-all active:scale-95 flex items-center justify-center ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Next */}
        {feedback === 'correct' && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <p className="text-base font-bold">¡Bien pensado! 🌟</p>
            <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400 font-medium">
              {currentQ.explanation}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 text-sm"
            >
              <span>¡Siguiente Patrón!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-xs text-rose-700 dark:text-rose-300 font-semibold">
            ¡Intenta de nuevo! Fíjate cuánto aumenta o qué figura va antes.
          </div>
        )}
      </div>
    </div>
  );
};
