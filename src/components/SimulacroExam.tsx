import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight, 
  Printer, 
  Sparkles, 
  Timer as TimerIcon,
  Smile
} from 'lucide-react';
import { 
  DICTADO_QUESTIONS, 
  PATRONES_QUESTIONS, 
  UNIDADES_DECENAS_QUESTIONS, 
  CONTEO_QUESTIONS, 
  ORDEN_QUESTIONS, 
  PROBLEMAS_QUESTIONS 
} from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { TimerWidget } from './TimerWidget';
import confetti from 'canvas-confetti';

interface SimulacroExamProps {
  onExamFinished: (score: number, total: number, studentName: string) => void;
  onExit: () => void;
}

export const SimulacroExam: React.FC<SimulacroExamProps> = ({ onExamFinished, onExit }) => {
  const [studentName, setStudentName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // We curate 6 questions exactly mapping the 6 contents
  const examQuestions = [
    {
      topic: '1. Dictado de números hasta el 30',
      instruction: 'Escucha el audio y selecciona el número que se dictó:',
      audioText: '¡Hola! Primer ejercicio: escucha con calma... el número es veinticuatro. Te lo repito despacito: veinticuatro.',
      options: [14, 24, 20, 29],
      correct: 24,
      displayNumber: 'Veinticuatro',
    },
    {
      topic: '2. Patrones / Secuencias',
      instruction: '¿Qué número continúa la serie de 2 en 2?',
      audioText: 'Segundo ejercicio: vamos dando saltitos de dos en dos... cuatro... seis... ocho... diez... ¿Qué número sigue ahora?',
      sequence: [4, 6, 8, 10, '¿?'],
      options: [11, 12, 14, 16],
      correct: 12,
    },
    {
      topic: '3. Unidades y decenas',
      instruction: 'Observa: 2 Decenas y 7 Unidades forman el número...',
      audioText: 'Tercer ejercicio: observa con tus ojitos... dos decenas... y siete unidades... ¿Qué número formamos juntos?',
      tens: 2,
      units: 7,
      options: [20, 27, 72, 17],
      correct: 27,
    },
    {
      topic: '4. Conteo de números',
      instruction: 'Cuenta cuántas estrellitas brillantes hay en la caja:',
      audioText: 'Cuarto ejercicio: cuenta con calma las estrellitas brillantes... una por una... ¿Cuántas hay en la caja?',
      count: 16,
      emoji: '⭐',
      options: [14, 15, 16, 18],
      correct: 16,
    },
    {
      topic: '5. Orden de números mayor a menor',
      instruction: '¿Cuál de estos números es el MAYOR de todos?',
      audioText: 'Quinto ejercicio: entre el doce... el veintiocho... el siete... y el diecinueve... ¿cuál es el número mayor de todos?',
      numbers: [12, 28, 7, 19],
      options: [12, 28, 7, 19],
      correct: 28,
    },
    {
      topic: '6. Resolución de problemas',
      instruction: 'En un árbol había 18 pajaritos. Llegaron 6 pajaritos más. ¿Cuántos hay ahora?',
      audioText: 'Último ejercicio: en un árbol cantaban dieciocho pajaritos... luego llegaron seis pajaritos más... ¿Cuántos pajaritos cantan ahora en total?',
      story: 'Había 18 pajaritos 🐦. Llegaron 6 pajaritos más 🐦.',
      options: [22, 24, 20, 26],
      correct: 24,
    },
  ];

  const currentQ = examQuestions[stepIndex];

  const handleStartExam = () => {
    if (!studentName.trim()) {
      soundManager.speak('Por favor escribe tu nombre en la cajita para comenzar la prueba.');
      return;
    }
    soundManager.playSuccess();
    soundManager.speak(`¡Mucho éxito en tu simulacro, ${studentName}! Recuerda escuchar con calma cada pregunta.`);
    setIsStarted(true);
  };

  const handleSelectOption = (optionVal: any) => {
    soundManager.playPop();
    const updated = { ...answers, [stepIndex]: optionVal };
    setAnswers(updated);
  };

  const handleNextStep = () => {
    soundManager.playPop();
    if (stepIndex < examQuestions.length - 1) {
      setStepIndex((prev) => prev + 1);
      setTimeout(() => {
        soundManager.speak(examQuestions[stepIndex + 1].audioText);
      }, 200);
    } else {
      // Calculate score
      let calculatedScore = 0;
      examQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
          calculatedScore += 1;
        }
      });

      setScore(calculatedScore);
      setIsFinished(true);
      soundManager.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      soundManager.speak(`¡Felicitaciones ${studentName}! Terminaste tu prueba con ${calculatedScore} de 6 puntos. ¡Hiciste un esfuerzo maravilloso, estoy muy orgullosa de ti!`);
      onExamFinished(calculatedScore, examQuestions.length, studentName);
    }
  };

  // Pre-Exam Screen
  if (!isStarted) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
            📝
          </div>
          <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
            Simulacro Oficial · Fecha de Evaluación: 10/11
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Prueba de Matemática: 6 Desafíos
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Esta prueba tiene exactamente los mismos 6 contenidos que evaluará la profesora Sandra. 
            ¡Está diseñada para que la leas y escuches de forma autónoma!
          </p>
        </div>

        {/* Contents Checklist */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-6 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">✓ 1. Dictado de números hasta el 30</div>
          <div className="flex items-center gap-2">✓ 2. Patrones / Secuencias</div>
          <div className="flex items-center gap-2">✓ 3. Unidades y decenas (Base 10)</div>
          <div className="flex items-center gap-2">✓ 4. Conteo de números</div>
          <div className="flex items-center gap-2">✓ 5. Orden de mayor a menor y menor a mayor</div>
          <div className="flex items-center gap-2">✓ 6. Resolución de problemas cotidianos</div>
        </div>

        {/* Student name input */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            ¿Cómo te llamas? (Para tu Diploma Final)
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Escribe tu nombre aquí..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-base shadow-xs"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Volver a la Práctica
          </button>
          <button
            type="button"
            onClick={handleStartExam}
            className="flex-1 sm:flex-none px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>¡Comenzar Evaluación!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Final Results & Diploma Screen
  if (isFinished) {
    const percentage = Math.round((score / examQuestions.length) * 100);
    const simulatedGrade = (1.0 + (score / 6) * 6.0).toFixed(1); // Chilean standard school grading scale 1.0 to 7.0

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Printable/Displayable Diploma */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl border-4 border-amber-300 dark:border-amber-600 p-8 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 text-2xl opacity-40">⭐</div>
          <div className="absolute top-2 right-2 text-2xl opacity-40">⭐</div>
          <div className="absolute bottom-2 left-2 text-2xl opacity-40">⭐</div>
          <div className="absolute bottom-2 right-2 text-2xl opacity-40">⭐</div>

          <div className="w-20 h-20 bg-amber-400 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-md mb-3 ring-4 ring-amber-200">
            🏆
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            Diploma de Mérito y Preparación
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 font-display">
            ¡SÚPER MATEMÁTICO/A!
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Este diploma certifica que el estudiante:
          </p>

          <div className="my-4 py-2 border-b-2 border-t-2 border-amber-200 dark:border-slate-700 inline-block px-8">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {studentName || 'Gran Estudiante'}
            </span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-200 max-w-md mx-auto">
            Ha completado con éxito la preparación autónoma para la Evaluación de Matemática del 10/11.
          </p>

          {/* Stats Box */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto my-6 p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Puntaje</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">{score} / 6</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Nota Simulada</span>
              <p className="text-2xl font-black text-blue-600 font-mono">{simulatedGrade}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir o Guardar Diploma</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsStarted(false);
                setIsFinished(false);
                setStepIndex(0);
                setAnswers({});
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Dar la Prueba de Nuevo</span>
            </button>
          </div>
        </div>

        {/* Question Review Checklist */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
            Revisión de Respuestas Pregunta por Pregunta:
          </h3>
          <div className="space-y-2 text-xs">
            {examQuestions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correct;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-300'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-semibold">{q.topic}</span>
                  </div>
                  <span className="font-mono font-bold">
                    {isCorrect ? 'Correcto (+1)' : `Respuesta correcta: ${q.correct}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Volver al Menú Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Step
  const isAnswered = answers[stepIndex] !== undefined;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top status bar with timer */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">
          Pregunta {stepIndex + 1} de {examQuestions.length}
        </span>
        <TimerWidget compact={true} />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / examQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold">
            {currentQ.topic}
          </span>
          <AudioButton textToRead={currentQ.audioText} size="sm" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          {currentQ.instruction}
        </h3>

        {/* Special visuals depending on question */}
        {currentQ.sequence && (
          <div className="flex justify-center gap-2 my-4">
            {currentQ.sequence.map((item, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-sky-50 dark:bg-slate-900 border-2 border-sky-200 rounded-xl flex items-center justify-center font-mono font-black text-lg"
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {currentQ.tens !== undefined && (
          <div className="flex justify-center items-center gap-4 my-4 p-3 bg-emerald-50/50 rounded-xl">
            <span className="font-bold text-blue-600 text-sm">{currentQ.tens} Decenas (D)</span>
            <span className="text-slate-400">+</span>
            <span className="font-bold text-amber-600 text-sm">{currentQ.units} Unidades (U)</span>
          </div>
        )}

        {currentQ.count && (
          <div className="p-3 bg-rose-50/50 rounded-xl flex flex-wrap gap-2 justify-center max-w-xs mx-auto my-3">
            {Array.from({ length: currentQ.count }).map((_, i) => (
              <span key={i} className="text-xl">
                {currentQ.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {currentQ.options.map((opt) => {
            const isSelected = answers[stepIndex] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`py-4 px-3 rounded-2xl text-2xl font-black font-mono transition-all active:scale-95 border-2 shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-200 dark:ring-blue-900'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Salir del simulacro
          </button>

          <button
            type="button"
            disabled={!isAnswered}
            onClick={handleNextStep}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm"
          >
            <span>{stepIndex === examQuestions.length - 1 ? 'Finalizar Examen' : 'Siguiente Pregunta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
