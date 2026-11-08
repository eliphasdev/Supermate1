import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Play, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Volume2, 
  Mic, 
  RotateCcw,
  Star,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { TopicId, UserProgress } from './types/math';
import { TOPICS } from './data/mathCurriculum';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { TimerWidget } from './components/TimerWidget';
import { DictadoGame } from './components/DictadoGame';
import { PatronesGame } from './components/PatronesGame';
import { UnidadesDecenasGame } from './components/UnidadesDecenasGame';
import { ConteoGame } from './components/ConteoGame';
import { OrdenGame } from './components/OrdenGame';
import { ProblemasGame } from './components/ProblemasGame';
import { SimulacroExam } from './components/SimulacroExam';
import { StickerAlbum } from './components/StickerAlbum';
import { ParentsGuide } from './components/ParentsGuide';
import { VoiceSettingsBar } from './components/VoiceSettingsBar';

const LOCAL_STORAGE_KEY = 'supermate_progress_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'practice' | 'exam' | 'stickers' | 'guide'>('practice');
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('dictado');
  const [showFloatingTimer, setShowFloatingTimer] = useState<boolean>(true);

  // User progress persisted in localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {
      totalStars: 3,
      completedExercises: 0,
      topicStats: {
        dictado: { completed: 0, correct: 0 },
        patrones: { completed: 0, correct: 0 },
        'unidades-decenas': { completed: 0, correct: 0 },
        conteo: { completed: 0, correct: 0 },
        orden: { completed: 0, correct: 0 },
        problemas: { completed: 0, correct: 0 },
      },
      stickersUnlocked: ['stk-1'],
    };
  });

  // Save progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  // Handle completion of an exercise
  const handleCompleteExercise = (correct: boolean) => {
    setProgress((prev) => {
      const currentStats = prev.topicStats[selectedTopic] || { completed: 0, correct: 0 };
      const newTopicStats = {
        ...prev.topicStats,
        [selectedTopic]: {
          completed: currentStats.completed + 1,
          correct: currentStats.correct + (correct ? 1 : 0),
        },
      };

      const addedStars = correct ? 1 : 0;
      return {
        ...prev,
        totalStars: prev.totalStars + addedStars,
        completedExercises: prev.completedExercises + 1,
        topicStats: newTopicStats,
      };
    });
  };

  const handleExamFinished = (score: number, total: number, studentName: string) => {
    setProgress((prev) => ({
      ...prev,
      totalStars: prev.totalStars + score * 2,
      lastExamScore: {
        score,
        total,
        date: new Date().toLocaleDateString('es-ES'),
        studentName,
      },
    }));
  };

  const currentTopicInfo = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        totalStars={progress.totalStars}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Practice Mode */}
        {currentTab === 'practice' && (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-white mb-3">
                  <span>📅 Evaluación Escolar: 10/11</span>
                  <span>·</span>
                  <span>Lectura Autónoma & Comandos de Voz</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white mb-2 leading-tight">
                  ¡Aprende y Juega con las Matemáticas!
                </h1>
                <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
                  Escucha las preguntas con el botón 🔊 o responde hablando con el micrófono 🎙️. 
                  ¡Usa el cronómetro para medir tu concentración!
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('exam')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Hacer Simulacro de Prueba (10/11)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.speak('¡Hola! Elige cualquiera de los 6 temas para practicar antes de tu evaluación.');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Escuchar Saludo</span>
                  </button>
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute right-4 -bottom-6 text-8xl opacity-15 select-none pointer-events-none hidden sm:block">
                📐
              </div>
            </div>

            {/* Voice Control & Speed Controller for 7yo learners */}
            <VoiceSettingsBar />

            {/* Layout: Sidebar Topic Selector + Main Game Stage + Stopwatch Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 6 Topics corresponding to the exam contents (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Contenidos de Matemática
                    </h3>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      6 Temas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {TOPICS.map((topic, index) => {
                      const isSelected = selectedTopic === topic.id;
                      const stat = progress.topicStats[topic.id] || { completed: 0, correct: 0 };

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            soundManager.playPop();
                            setSelectedTopic(topic.id);
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between group border-2 ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                              {topic.emoji}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-400">0{index + 1}.</span>
                                <h4 className={`text-sm font-bold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {topic.shortTitle}
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {topic.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {stat.correct > 0 ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                ✓ {stat.correct}
                              </span>
                            ) : (
                              <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-blue-500 ${isSelected ? 'text-blue-600' : ''}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Floating/Side Timer Widget (Cronómetro y Temporizador) */}
                {showFloatingTimer && (
                  <TimerWidget initialMode="stopwatch" />
                )}
              </div>

              {/* Right Column: Game Stage (lg:col-span-8) */}
              <div className="lg:col-span-8">
                {selectedTopic === 'dictado' && (
                  <DictadoGame onCompleteExercise={handleCompleteExercise} />
                )}
                {selectedTopic === 'patrones' && (
                  <PatronesGame onCompleteExercise={handleCompleteExercise} />
                )}
                {selectedTopic === 'unidades-decenas' && (
                  <UnidadesDecenasGame onCompleteExercise={handleCompleteExercise} />
                )}
                {selectedTopic === 'conteo' && (
                  <ConteoGame onCompleteExercise={handleCompleteExercise} />
                )}
                {selectedTopic === 'orden' && (
                  <OrdenGame onCompleteExercise={handleCompleteExercise} />
                )}
                {selectedTopic === 'problemas' && (
                  <ProblemasGame onCompleteExercise={handleCompleteExercise} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exam Mode: Simulacro 10/11 */}
        {currentTab === 'exam' && (
          <SimulacroExam
            onExamFinished={handleExamFinished}
            onExit={() => setCurrentTab('practice')}
          />
        )}

        {/* Stickers & Trophy Album */}
        {currentTab === 'stickers' && (
          <StickerAlbum
            progress={progress}
            onClose={() => setCurrentTab('practice')}
          />
        )}

        {/* Parents and Families Guide */}
        {currentTab === 'guide' && (
          <ParentsGuide
            onClose={() => setCurrentTab('practice')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            SuperMate 7 · Preparación para la Evaluación de Matemática (10/11)
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span>Lectura Autónoma</span>
            <span aria-hidden="true">·</span>
            <span>Comandos de Voz</span>
            <span aria-hidden="true">·</span>
            <span>Cronómetro Integrado</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
