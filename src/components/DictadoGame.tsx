import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, HelpCircle, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { DictadoQuestion } from '../types/math';
import { DICTADO_QUESTIONS } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { NumberPad } from './NumberPad';
import { VoiceControl } from './VoiceControl';
import confetti from 'canvas-confetti';

interface DictadoGameProps {
  onCompleteExercise: (correct: boolean) => void;
}

export const DictadoGame: React.FC<DictadoGameProps> = ({ onCompleteExercise }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);

  const currentQ: DictadoQuestion = DICTADO_QUESTIONS[currentIndex % DICTADO_QUESTIONS.length];

  // Auto-play the spoken number on question change
  useEffect(() => {
    setUserInput('');
    setFeedback('idle');
    setShowHint(false);

    const timer = setTimeout(() => {
      soundManager.speak(currentQ.audioText);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentQ]);

  const handlePlayAudio = () => {
    soundManager.speak(currentQ.audioText);
  };

  const checkAnswer = (inputValue = userInput) => {
    const num = parseInt(inputValue.trim(), 10);
    if (isNaN(num)) return;

    if (num === currentQ.targetNumber) {
      setFeedback('correct');
      soundManager.playSuccess();
      soundManager.speak(`¡Muy bien, excelente trabajo! Escribiste perfecto el número ${currentQ.numberInWords}.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Estuviste muy cerquita, no te preocupes. Escuchemos el audio de nuevo con calma.`);
      onCompleteExercise(false);
    }
  };

  const handleVoiceNumber = (num: number) => {
    setUserInput(num.toString());
    checkAnswer(num.toString());
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd === 'repetir') handlePlayAudio();
    if (cmd === 'siguiente' && feedback === 'correct') handleNext();
    if (cmd === 'ayuda') setShowHint(true);
  };

  const handleNext = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Question header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold mb-3">
          <span>Dictado de Números hasta el 30</span>
          <span>·</span>
          <span>Pregunta { (currentIndex % DICTADO_QUESTIONS.length) + 1 } de { DICTADO_QUESTIONS.length }</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Escucha con mucha atención:
        </h2>

        {/* Central Audio Play Button */}
        <div className="flex flex-col items-center justify-center my-4">
          <button
            type="button"
            onClick={handlePlayAudio}
            className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white rounded-3xl shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Volume2 className="w-7 h-7 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wider text-amber-100 font-semibold">Toca para escuchar</span>
              <span className="text-lg font-bold">Repetir audio 🔊</span>
            </div>
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            ¿No lo escuchaste bien? Puedes presionar las veces que quieras.
          </span>
        </div>

        {/* Hint toggle */}
        {currentQ.hint && (
          <div className="mt-3">
            {!showHint ? (
              <button
                type="button"
                onClick={() => {
                  setShowHint(true);
                  soundManager.speak(currentQ.hint || '');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>¿Necesitas una pista?</span>
              </button>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-slate-700/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-slate-600">
                💡 <strong>Pista:</strong> {currentQ.hint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Control Assistant */}
      <VoiceControl
        onNumberDetected={handleVoiceNumber}
        onCommandDetected={handleVoiceCommand}
        targetHint="Di el número en voz alta (ej: 'catorce') o usa el teclado"
      />

      {/* Number pad or next step */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        {feedback === 'idle' && (
          <NumberPad
            value={userInput}
            onChange={setUserInput}
            onSubmit={() => checkAnswer()}
          />
        )}

        {feedback === 'correct' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ¡CORRECTO! 🎉
              </h3>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                Escribiste el número <strong className="text-xl font-mono text-emerald-600">{currentQ.targetNumber}</strong> ({currentQ.numberInWords})
              </p>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95"
            >
              <span>¡Siguiente Número!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="text-center py-4 space-y-4">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-300">
              <p className="text-base font-bold">¡Casi lo logras! Inténtalo otra vez 💪</p>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                Escucha el audio de nuevo con calma.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setUserInput('');
                  setFeedback('idle');
                  handlePlayAudio();
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
