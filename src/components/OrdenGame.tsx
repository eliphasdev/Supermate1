import React, { useState, useEffect } from 'react';
import { ArrowUpDown, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { OrdenQuestion } from '../types/math';
import { ORDEN_QUESTIONS } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { VoiceControl } from './VoiceControl';
import confetti from 'canvas-confetti';

interface OrdenGameProps {
  onCompleteExercise: (correct: boolean) => void;
}

export const OrdenGame: React.FC<OrdenGameProps> = ({ onCompleteExercise }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [orderedSlots, setOrderedSlots] = useState<number[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<'<' | '>' | '=' | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const currentQ: OrdenQuestion = ORDEN_QUESTIONS[currentIndex % ORDEN_QUESTIONS.length];

  useEffect(() => {
    setOrderedSlots([]);
    setSelectedSymbol(null);
    setFeedback('idle');
    const timer = setTimeout(() => {
      soundManager.speak(currentQ.audioText);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentIndex, currentQ]);

  // Tap a number card to place into the order slots
  const handleTapNumber = (num: number) => {
    if (feedback === 'correct') return;
    soundManager.playPop();

    if (orderedSlots.includes(num)) {
      // Remove
      setOrderedSlots((prev) => prev.filter((n) => n !== num));
    } else {
      const nextSlots = [...orderedSlots, num];
      setOrderedSlots(nextSlots);

      // Check if all placed
      if (currentQ.correctOrder && nextSlots.length === currentQ.correctOrder.length) {
        checkOrder(nextSlots);
      }
    }
  };

  const checkOrder = (slotsToCheck: number[]) => {
    if (!currentQ.correctOrder) return;
    const isExact = slotsToCheck.every((val, idx) => val === currentQ.correctOrder![idx]);

    if (isExact) {
      setFeedback('correct');
      soundManager.playSuccess();
      const orderTypeSpanish = currentQ.orderType === 'asc' ? 'menor a mayor' : 'mayor a menor';
      soundManager.speak(`¡Excelente! Los ordenaste correctamente de ${orderTypeSpanish}: ${slotsToCheck.join(', ')}.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Casi. Revisa bien cuál número es más grande.`);
      onCompleteExercise(false);
    }
  };

  // Check symbol compare (<, >, =)
  const handleCheckSymbol = (sym: '<' | '>' | '=') => {
    setSelectedSymbol(sym);

    if (sym === currentQ.comparisonSymbol) {
      setFeedback('correct');
      soundManager.playSuccess();
      const explanation = sym === '>'
        ? `${currentQ.firstNumber} es mayor que ${currentQ.secondNumber}`
        : `${currentQ.firstNumber} es menor que ${currentQ.secondNumber}`;
      soundManager.speak(`¡Muy bien! ${explanation}.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Recuerda que la boca del cocodrilo siempre se come al número más grande.`);
      onCompleteExercise(false);
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd === 'repetir') soundManager.speak(currentQ.audioText);
    if (cmd === 'siguiente' && feedback === 'correct') handleNext();
    if (cmd === 'reiniciar') setOrderedSlots([]);
  };

  const handleNext = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => prev + 1);
  };

  const remainingNumbers = currentQ.numbers.filter((n) => !orderedSlots.includes(n));

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-bold">
            Orden de Números · Ejercicio { (currentIndex % ORDEN_QUESTIONS.length) + 1 } / { ORDEN_QUESTIONS.length }
          </span>
          <AudioButton textToRead={currentQ.audioText} size="sm" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
          {currentQ.instruction}
        </h2>

        {/* Sorting mode */}
        {currentQ.orderType !== 'compare' && (
          <div>
            {/* Target Slots */}
            <div className="p-4 bg-indigo-50/50 dark:bg-slate-900/60 rounded-2xl border border-indigo-100 dark:border-slate-700 mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-3 px-1">
                <span>
                  {currentQ.orderType === 'asc' ? '1° Más Pequeño (Menor) ➔ 4° Más Grande (Mayor)' : '1° Más Grande (Mayor) ➔ 4° Más Pequeño (Menor)'}
                </span>
                {orderedSlots.length > 0 && feedback !== 'correct' && (
                  <button
                    type="button"
                    onClick={() => setOrderedSlots([])}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpiar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {Array.from({ length: currentQ.numbers.length }).map((_, idx) => {
                  const val = orderedSlots[idx];
                  return (
                    <div
                      key={idx}
                      className={`h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        val !== undefined
                          ? 'bg-indigo-600 text-white font-mono font-black text-2xl sm:text-3xl shadow-md border-2 border-indigo-700'
                          : 'bg-white dark:bg-slate-800 border-2 border-dashed border-indigo-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                        {idx + 1}° Lugar
                      </span>
                      <span className="mt-1">{val !== undefined ? val : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Number Cards to Tap */}
            <div className="mb-4">
              <p className="text-xs font-bold text-center uppercase tracking-wider text-slate-400 mb-3">
                Toca los números en el orden que corresponden:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {currentQ.numbers.map((num) => {
                  const isUsed = orderedSlots.includes(num);
                  return (
                    <button
                      key={num}
                      type="button"
                      disabled={isUsed || feedback === 'correct'}
                      onClick={() => handleTapNumber(num)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-2xl sm:text-3xl font-black font-mono shadow-sm transition-all transform active:scale-90 flex items-center justify-center ${
                        isUsed
                          ? 'opacity-25 bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-400'
                          : 'bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-slate-600 hover:border-indigo-500 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Comparison mode (<, >, =) */}
        {currentQ.orderType === 'compare' && (
          <div className="py-4">
            <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
              {/* Number 1 */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-slate-600 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-mono font-black text-indigo-700 dark:text-indigo-400 shadow-sm">
                {currentQ.firstNumber}
              </div>

              {/* Symbol Slot */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 dark:bg-slate-900 border-2 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-600">
                {selectedSymbol ? (
                  <span>{selectedSymbol}</span>
                ) : (
                  <span className="text-indigo-300 font-normal">?</span>
                )}
              </div>

              {/* Number 2 */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-slate-600 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-mono font-black text-indigo-700 dark:text-indigo-400 shadow-sm">
                {currentQ.secondNumber}
              </div>
            </div>

            {/* Crocodile Symbol choices */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-6">
              {[
                { sym: '>' as const, label: 'Mayor que (>)' },
                { sym: '<' as const, label: 'Menor que (<)' },
                { sym: '=' as const, label: 'Igual (=)' },
              ].map((item) => (
                <button
                  key={item.sym}
                  type="button"
                  disabled={feedback === 'correct'}
                  onClick={() => handleCheckSymbol(item.sym)}
                  className={`py-3 rounded-2xl text-2xl font-black transition-all active:scale-95 border-2 shadow-xs flex flex-col items-center justify-center ${
                    selectedSymbol === item.sym && feedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-800 hover:bg-indigo-50 border-indigo-200 dark:border-slate-700 text-indigo-900 dark:text-indigo-200'
                  }`}
                >
                  <span className="text-3xl font-mono">{item.sym}</span>
                  <span className="text-[10px] font-semibold opacity-75">{item.sym === '>' ? 'Mayor' : item.sym === '<' ? 'Menor' : 'Igual'}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-center text-slate-400 mt-3">
              🐊 <strong>Mnemotecnia:</strong> ¡El cocodrilo abre la boca grande hacia el número mayor!
            </p>
          </div>
        )}

        {/* Voice control assistant */}
        <div className="my-4">
          <VoiceControl
            onCommandDetected={handleVoiceCommand}
            targetHint="Comandos: 'repetir', 'siguiente', 'reiniciar'"
          />
        </div>

        {/* Feedback celebration */}
        {feedback === 'correct' && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-center text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <p className="text-lg font-bold">¡Excelente orden! 📊</p>
            <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400">
              ¡Dominas muy bien el orden y comparación de números!
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 text-sm"
            >
              <span>¡Siguiente Desafío!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-xs text-rose-700 dark:text-rose-300 font-semibold text-center">
            ¡Casi! Toca "Limpiar" para volver a intentar con tranquilidad.
          </div>
        )}
      </div>
    </div>
  );
};
