import React, { useState, useEffect } from 'react';
import { Layers, Plus, Minus, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { UnidadesDecenasQuestion } from '../types/math';
import { UNIDADES_DECENAS_QUESTIONS } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { VoiceControl } from './VoiceControl';
import { NumberPad } from './NumberPad';
import confetti from 'canvas-confetti';

interface UnidadesDecenasGameProps {
  onCompleteExercise: (correct: boolean) => void;
}

export const UnidadesDecenasGame: React.FC<UnidadesDecenasGameProps> = ({ onCompleteExercise }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [builtTens, setBuiltTens] = useState(0);
  const [builtUnits, setBuiltUnits] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const currentQ: UnidadesDecenasQuestion = UNIDADES_DECENAS_QUESTIONS[currentIndex % UNIDADES_DECENAS_QUESTIONS.length];

  useEffect(() => {
    setUserInput('');
    setBuiltTens(0);
    setBuiltUnits(0);
    setFeedback('idle');
    const timer = setTimeout(() => {
      soundManager.speak(currentQ.audioText);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentIndex, currentQ]);

  // Mode identify check
  const handleCheckIdentify = (val = userInput) => {
    const num = parseInt(val.trim(), 10);
    if (isNaN(num)) return;

    if (num === currentQ.targetNumber) {
      setFeedback('correct');
      soundManager.playSuccess();
      soundManager.speak(`¡Excelente! ${currentQ.tens} decenas y ${currentQ.units} unidades son ${currentQ.targetNumber}.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Cuenta bien las barritas de diez y los cubitos sueltos.`);
      onCompleteExercise(false);
    }
  };

  // Mode build check
  const handleCheckBuild = () => {
    const total = builtTens * 10 + builtUnits;
    if (total === currentQ.targetNumber) {
      setFeedback('correct');
      soundManager.playSuccess();
      soundManager.speak(`¡Perfecto! Construiste el número ${currentQ.targetNumber} con ${builtTens} decenas y ${builtUnits} unidades.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Llevas ${total}. Necesitamos llegar al ${currentQ.targetNumber}.`);
      onCompleteExercise(false);
    }
  };

  const handleVoiceNumber = (num: number) => {
    if (currentQ.mode === 'identify') {
      setUserInput(num.toString());
      handleCheckIdentify(num.toString());
    } else {
      // In build mode, saying number can auto-adjust
      const tens = Math.floor(num / 10);
      const units = num % 10;
      setBuiltTens(tens);
      setBuiltUnits(units);
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

  // Render Multibase 10 Blocks
  const renderBlocks = (tensCount: number, unitsCount: number) => (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900/60 dark:to-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-slate-700">
      {/* Tens column */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
          <span>Decenas (D) = {tensCount}</span>
          <span className="text-slate-400">({tensCount * 10})</span>
        </div>
        <div className="flex items-end gap-2 min-h-[140px] p-2 bg-white/70 dark:bg-slate-800/80 rounded-xl border border-blue-200 dark:border-slate-700">
          {tensCount === 0 ? (
            <span className="text-xs text-slate-400 italic px-4 py-8">0 decenas</span>
          ) : (
            Array.from({ length: tensCount }).map((_, i) => (
              <div
                key={`ten-${i}`}
                title="1 Decena = 10 unidades"
                className="w-8 h-32 bg-blue-500 rounded-lg border-2 border-blue-600 flex flex-col justify-between p-0.5 shadow-sm overflow-hidden"
              >
                {Array.from({ length: 10 }).map((_, cubeIdx) => (
                  <div
                    key={cubeIdx}
                    className="w-full h-2.5 bg-blue-400/90 border-b border-blue-600/40 last:border-b-0 rounded-[1px]"
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Units column */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wide">
          <span>Unidades (U) = {unitsCount}</span>
        </div>
        <div className="flex items-end flex-wrap max-w-[150px] gap-1.5 min-h-[140px] p-2 bg-white/70 dark:bg-slate-800/80 rounded-xl border border-amber-200 dark:border-slate-700 justify-center content-end">
          {unitsCount === 0 ? (
            <span className="text-xs text-slate-400 italic px-4 py-8">0 unidades</span>
          ) : (
            Array.from({ length: unitsCount }).map((_, i) => (
              <div
                key={`unit-${i}`}
                title="1 Unidad"
                className="w-6 h-6 bg-amber-400 border-2 border-amber-500 rounded-md shadow-xs flex items-center justify-center text-[10px] font-bold text-amber-900"
              >
                1
              </div>
            ))
          )}
        </div>
      </div>

      {/* Table of Positional Value (Tabla de Valor Posicional) */}
      <div className="flex flex-col items-center pl-2 sm:border-l sm:border-slate-200 dark:sm:border-slate-700">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Tabla D | U
        </span>
        <div className="grid grid-cols-2 text-center rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-600 shadow-xs">
          <div className="bg-blue-600 text-white font-black px-3 py-1 text-sm">D</div>
          <div className="bg-amber-500 text-white font-black px-3 py-1 text-sm">U</div>
          <div className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-black text-xl py-2">
            {tensCount}
          </div>
          <div className="bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-mono font-black text-xl py-2">
            {unitsCount}
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">
          = {tensCount * 10 + unitsCount}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold">
            Unidades y Decenas (Base 10) · Ejercicio { (currentIndex % UNIDADES_DECENAS_QUESTIONS.length) + 1 } / { UNIDADES_DECENAS_QUESTIONS.length }
          </span>
          <AudioButton textToRead={currentQ.audioText} size="sm" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
          {currentQ.instruction}
        </h2>

        {/* Display blocks */}
        {currentQ.mode === 'identify' ? (
          renderBlocks(currentQ.tens, currentQ.units)
        ) : (
          <div>
            <div className="text-center mb-3">
              <span className="text-xs text-slate-500">Objetivo a construir:</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {currentQ.targetNumber}
              </div>
            </div>
            {renderBlocks(builtTens, builtUnits)}

            {/* Interactive Builder Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 p-1.5 rounded-xl border border-blue-200">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setBuiltTens(Math.max(0, builtTens - 1));
                  }}
                  disabled={builtTens === 0}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 font-bold text-blue-600 disabled:opacity-40 flex items-center justify-center shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold px-2 text-blue-700">Decena (+10)</span>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setBuiltTens(Math.min(3, builtTens + 1));
                  }}
                  disabled={builtTens >= 3}
                  className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-40 flex items-center justify-center shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-xl border border-amber-200">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setBuiltUnits(Math.max(0, builtUnits - 1));
                  }}
                  disabled={builtUnits === 0}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 font-bold text-amber-600 disabled:opacity-40 flex items-center justify-center shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold px-2 text-amber-700">Unidad (+1)</span>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setBuiltUnits(Math.min(9, builtUnits + 1));
                  }}
                  disabled={builtUnits >= 9}
                  className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold disabled:opacity-40 flex items-center justify-center shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleCheckBuild}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                Comprobar Número
              </button>
            </div>
          </div>
        )}

        {/* Voice control */}
        <div className="my-4">
          <VoiceControl
            onNumberDetected={handleVoiceNumber}
            onCommandDetected={handleVoiceCommand}
            targetHint="Di el número total o usa el teclado numérico"
          />
        </div>

        {/* Number pad for identify mode */}
        {currentQ.mode === 'identify' && feedback === 'idle' && (
          <div className="mt-4">
            <NumberPad
              value={userInput}
              onChange={setUserInput}
              onSubmit={() => handleCheckIdentify()}
            />
          </div>
        )}

        {/* Correct feedback */}
        {feedback === 'correct' && (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ¡CORRECTO! 🧱
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {currentQ.questionText}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95"
            >
              <span>¡Siguiente Ejercicio!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-center text-xs text-rose-700 dark:text-rose-300 font-semibold">
            ¡Revisa cuántas barritas de 10 hay y cuántos cubitos sueltos!
          </div>
        )}
      </div>
    </div>
  );
};
