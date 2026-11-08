import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, ArrowRight, HelpCircle, Plus, Minus } from 'lucide-react';
import { ProblemasQuestion } from '../types/math';
import { PROBLEMAS_QUESTIONS } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { VoiceControl } from './VoiceControl';
import { NumberPad } from './NumberPad';
import confetti from 'canvas-confetti';

interface ProblemasGameProps {
  onCompleteExercise: (correct: boolean) => void;
}

export const ProblemasGame: React.FC<ProblemasGameProps> = ({ onCompleteExercise }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<'+' | '-' | null>(null);
  const [userResult, setUserResult] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentQ: ProblemasQuestion = PROBLEMAS_QUESTIONS[currentIndex % PROBLEMAS_QUESTIONS.length];

  useEffect(() => {
    setSelectedOperation(null);
    setUserResult('');
    setFeedback('idle');
    setShowHint(false);
    const timer = setTimeout(() => {
      soundManager.speak(currentQ.audioText);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentIndex, currentQ]);

  const handleCheckAnswer = (resultVal = userResult, opVal = selectedOperation) => {
    const num = parseInt(resultVal.trim(), 10);
    if (isNaN(num)) return;

    const opMatches = opVal ? opVal === currentQ.operation : true;

    if (num === currentQ.result && opMatches) {
      setFeedback('correct');
      soundManager.playSuccess();
      soundManager.speak(`¡Excelente razonamiento! La respuesta es ${currentQ.result} ${currentQ.itemName}.`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onCompleteExercise(true);
    } else {
      setFeedback('incorrect');
      soundManager.playEncouragement();
      soundManager.speak(`Revisa si debes sumar o restar, y calcula con calma.`);
      onCompleteExercise(false);
    }
  };

  const handleVoiceNumber = (num: number) => {
    setUserResult(num.toString());
    handleCheckAnswer(num.toString(), selectedOperation || currentQ.operation);
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd === 'repetir') soundManager.speak(currentQ.audioText);
    if (cmd === 'sumar') setSelectedOperation('+');
    if (cmd === 'restar') setSelectedOperation('-');
    if (cmd === 'ayuda') setShowHint(true);
    if (cmd === 'siguiente' && feedback === 'correct') handleNext();
  };

  const handleNext = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 rounded-full text-xs font-bold">
            Resolución de Problemas · Problema { (currentIndex % PROBLEMAS_QUESTIONS.length) + 1 } / { PROBLEMAS_QUESTIONS.length }
          </span>
          <AudioButton textToRead={currentQ.audioText} size="sm" />
        </div>

        {/* Story Box with prominent autonomous reading */}
        <div className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-900/80 dark:to-violet-950/30 rounded-2xl border border-violet-100 dark:border-slate-700 mb-5 relative">
          <div className="flex items-start gap-3">
            <span className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-violet-200 dark:border-slate-700">
              {currentQ.itemEmoji}
            </span>
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {currentQ.storyText}
              </p>
              <p className="text-sm font-bold text-violet-900 dark:text-violet-300">
                ❓ {currentQ.questionPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Token Helper (Concrete items) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Fichas de ayuda visual:</span>
            <span>
              {currentQ.dataNum1} {currentQ.operation === '+' ? 'más (+)' : 'menos (-)'} {currentQ.dataNum2}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {/* First group */}
            {Array.from({ length: currentQ.dataNum1 }).map((_, i) => (
              <span
                key={`g1-${i}`}
                title={`Elemento ${i + 1}`}
                className="w-7 h-7 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-sm shadow-2xs"
              >
                {currentQ.itemEmoji}
              </span>
            ))}

            {/* Separator badge */}
            <div className="flex items-center px-2 font-bold text-sm text-violet-600">
              {currentQ.operation}
            </div>

            {/* Second group */}
            {Array.from({ length: currentQ.dataNum2 }).map((_, i) => (
              <span
                key={`g2-${i}`}
                title={`Elemento ${i + 1}`}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-2xs ${
                  currentQ.operation === '-'
                    ? 'bg-rose-50 border border-rose-300 opacity-40 line-through'
                    : 'bg-emerald-50 border border-emerald-300'
                }`}
              >
                {currentQ.itemEmoji}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Operation Selection */}
        <div className="mb-5">
          <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2 text-center">
            Paso 1: ¿Qué operación debemos hacer?
          </label>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              disabled={feedback === 'correct'}
              onClick={() => {
                soundManager.playPop();
                setSelectedOperation('+');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${
                selectedOperation === '+'
                  ? 'bg-violet-600 text-white border-violet-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Sumar (+)</span>
            </button>

            <button
              type="button"
              disabled={feedback === 'correct'}
              onClick={() => {
                soundManager.playPop();
                setSelectedOperation('-');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${
                selectedOperation === '-'
                  ? 'bg-violet-600 text-white border-violet-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Minus className="w-4 h-4 stroke-[3]" />
              <span>Restar (-)</span>
            </button>
          </div>
        </div>

        {/* Hint button */}
        {currentQ.hint && (
          <div className="text-center mb-4">
            {!showHint ? (
              <button
                type="button"
                onClick={() => {
                  setShowHint(true);
                  soundManager.speak(currentQ.hint || '');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-violet-700 dark:text-violet-400 font-semibold hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>¿Cómo pensar este problema? (Pista)</span>
              </button>
            ) : (
              <div className="p-3 bg-violet-50 dark:bg-slate-900 rounded-xl text-xs text-violet-900 dark:text-violet-200 border border-violet-200 text-left">
                💡 <strong>Pista del problema:</strong> {currentQ.hint}
              </div>
            )}
          </div>
        )}

        {/* Voice control assistant */}
        <div className="my-4">
          <VoiceControl
            onNumberDetected={handleVoiceNumber}
            onCommandDetected={handleVoiceCommand}
            targetHint="Di el resultado o los comandos 'sumar' / 'restar'"
          />
        </div>

        {/* Number Pad for Step 2 Result */}
        {feedback === 'idle' && (
          <div className="mt-3">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 text-center">
              Paso 2: Escribe la respuesta final:
            </p>
            <NumberPad
              value={userResult}
              onChange={setUserResult}
              onSubmit={() => handleCheckAnswer()}
            />
          </div>
        )}

        {/* Feedback celebration */}
        {feedback === 'correct' && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-center text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-lg font-bold">¡Problema Resuelto! 💡</p>
            <p className="text-sm mt-1 text-emerald-700 dark:text-emerald-300">
              Operación: {currentQ.dataNum1} {currentQ.operation} {currentQ.dataNum2} = <strong className="font-mono text-base">{currentQ.result}</strong> {currentQ.itemName}.
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 text-sm"
            >
              <span>¡Siguiente Problema!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-xs text-rose-700 dark:text-rose-300 font-semibold text-center">
            Revisa el cálculo con la ayuda visual de las fichas. ¡Tú puedes!
          </div>
        )}
      </div>
    </div>
  );
};
