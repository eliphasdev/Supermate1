import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConteoQuestion } from '../types/math';
import { CONTEO_QUESTIONS } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { VoiceControl } from './VoiceControl';
import confetti from 'canvas-confetti';

interface ConteoGameProps {
  onCompleteExercise: (correct: boolean) => void;
}

const ITEM_EMOJIS: Record<string, string> = {
  manzana: '🍎',
  estrella: '⭐',
  cohete: '🚀',
  lapiz: '✏️',
  gatito: '🐱',
  pelota: '⚽',
};

export const ConteoGame: React.FC<ConteoGameProps> = ({ onCompleteExercise }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countedItems, setCountedItems] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const currentQ: ConteoQuestion = CONTEO_QUESTIONS[currentIndex % CONTEO_QUESTIONS.length];
  const emoji = ITEM_EMOJIS[currentQ.itemType] || '🍎';

  useEffect(() => {
    setCountedItems([]);
    setSelectedAnswer(null);
    setFeedback('idle');
    const timer = setTimeout(() => {
      soundManager.speak(currentQ.audioText);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentIndex, currentQ]);

  const handleTapItem = (itemIndex: number) => {
    if (feedback === 'correct') return;
    soundManager.playPop();

    if (countedItems.includes(itemIndex)) {
      // un-tap if already counted
      setCountedItems((prev) => prev.filter((i) => i !== itemIndex));
    } else {
      setCountedItems((prev) => [...prev, itemIndex]);
    }
  };

  const handleCheckAnswer = (answer: number) => {
    setSelectedAnswer(answer);

    if (answer === currentQ.count) {
      setFeedback('correct');
      soundManager.playSuccess();
      soundManager.speak(`¡Excelente conteo! Hay exactamente ${currentQ.count} elementos.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Cuenta despacio tocando cada uno para no repetir.`);
      onCompleteExercise(false);
    }
  };

  const handleVoiceNumber = (num: number) => {
    if (currentQ.options.includes(num)) {
      handleCheckAnswer(num);
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd === 'repetir') soundManager.speak(currentQ.audioText);
    if (cmd === 'siguiente' && feedback === 'correct') handleNext();
    if (cmd === 'reiniciar') setCountedItems([]);
  };

  const handleNext = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-full text-xs font-bold">
            Conteo de Números hasta el 30 · Ejercicio { (currentIndex % CONTEO_QUESTIONS.length) + 1 } / { CONTEO_QUESTIONS.length }
          </span>
          <AudioButton textToRead={currentQ.audioText} size="sm" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">
          {currentQ.prompt}
        </h2>

        {/* Counter status ticker */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4 px-2">
          <span>Llevas contados: <strong className="text-rose-600 font-mono text-base">{countedItems.length}</strong></span>
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setCountedItems([]);
            }}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Volver a contar</span>
          </button>
        </div>

        {/* Interactive Counting Grid */}
        <div className="p-4 sm:p-6 bg-rose-50/50 dark:bg-slate-900/60 rounded-2xl border border-rose-100 dark:border-slate-700">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 sm:gap-3 justify-items-center">
            {Array.from({ length: currentQ.count }).map((_, idx) => {
              const isCounted = countedItems.includes(idx);
              const countOrder = countedItems.indexOf(idx) + 1;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTapItem(idx)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center transition-all transform active:scale-90 ${
                    isCounted
                      ? 'bg-rose-500/20 dark:bg-rose-950/60 border-2 border-rose-500 shadow-inner'
                      : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs hover:border-rose-300'
                  }`}
                >
                  <span className={isCounted ? 'opacity-40 filter grayscale' : ''}>{emoji}</span>
                  {isCounted && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                      {countOrder}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-center text-slate-400 mt-3">
            💡 Consejo: Toca cada {currentQ.itemType} para tacharla y no perder la cuenta.
          </p>
        </div>

        {/* Voice control assistant */}
        <div className="my-4">
          <VoiceControl
            onNumberDetected={handleVoiceNumber}
            onCommandDetected={handleVoiceCommand}
            targetHint="Di cuántos hay en voz alta o selecciona abajo"
          />
        </div>

        {/* Answer Options */}
        <div className="mt-5">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center">
            ¿Cuántos hay en total?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.count;

              let btnClass = 'bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';

              if (feedback === 'correct' && isCorrect) {
                btnClass = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200';
              } else if (feedback === 'incorrect' && isSelected) {
                btnClass = 'bg-rose-100 text-rose-800 border-2 border-rose-300';
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={feedback === 'correct'}
                  onClick={() => handleCheckAnswer(option)}
                  className={`h-16 rounded-2xl text-2xl font-black shadow-xs transition-all active:scale-95 flex items-center justify-center font-mono ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback celebration */}
        {feedback === 'correct' && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-center text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <p className="text-lg font-bold">¡Excelente contador! 🍎</p>
            <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400">
              Contaste exactamente los {currentQ.count} elementos sin equivocarte.
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 text-sm"
            >
              <span>¡Siguiente Colección!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-xs text-rose-700 dark:text-rose-300 font-semibold text-center">
            ¡Casi! Toca cada figura despacio para no contar dos veces la misma.
          </div>
        )}
      </div>
    </div>
  );
};
