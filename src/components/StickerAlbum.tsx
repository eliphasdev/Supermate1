import React from 'react';
import { Award, Lock, Star, Sparkles } from 'lucide-react';
import { Sticker, UserProgress } from '../types/math';
import { STICKERS_CATALOG } from '../data/mathCurriculum';
import { soundManager } from '../utils/audio';

interface StickerAlbumProps {
  progress: UserProgress;
  onClose: () => void;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({ progress, onClose }) => {
  const stickers = STICKERS_CATALOG.map((stk) => {
    // Determine dynamic unlock
    let isUnlocked = progress.stickersUnlocked.includes(stk.id);

    if (stk.id === 'stk-1' && progress.completedExercises >= 1) isUnlocked = true;
    if (stk.id === 'stk-3' && (progress.topicStats.dictado?.correct || 0) >= 3) isUnlocked = true;
    if (stk.id === 'stk-4' && (progress.topicStats.patrones?.correct || 0) >= 3) isUnlocked = true;
    if (stk.id === 'stk-5' && (progress.topicStats['unidades-decenas']?.correct || 0) >= 3) isUnlocked = true;
    if (stk.id === 'stk-6' && (progress.topicStats.conteo?.correct || 0) >= 3) isUnlocked = true;
    if (stk.id === 'stk-7' && (progress.topicStats.orden?.correct || 0) >= 3) isUnlocked = true;
    if (stk.id === 'stk-8' && (progress.topicStats.problemas?.correct || 0) >= 3) isUnlocked = true;
    if (stk.id === 'stk-9' && progress.lastExamScore !== undefined) isUnlocked = true;
    if (stk.id === 'stk-10' && progress.lastExamScore?.score === 6) isUnlocked = true;
    if (stk.id === 'stk-11' && progress.totalStars >= 15) isUnlocked = true;
    if (stk.id === 'stk-12' && progress.totalStars >= 25) isUnlocked = true;

    return { ...stk, unlocked: isUnlocked };
  });

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  const handleTapSticker = (s: Sticker) => {
    soundManager.playPop();
    if (s.unlocked) {
      soundManager.speak(`¡Sticker desbloqueado! ${s.name}: ${s.requirement}`);
    } else {
      soundManager.speak(`Para ganar este sticker necesitas: ${s.requirement}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-xs">
            🌟
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              Álbum de Stickers y Medallas
            </h2>
            <p className="text-xs text-slate-500">
              Colecciona tus logros resolviendo ejercicios y simulacros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-slate-700/60 border border-amber-200 dark:border-slate-600 rounded-2xl text-amber-900 dark:text-amber-300 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{progress.totalStars} Estrellas</span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {unlockedCount} / {stickers.length} Desbloqueados
          </span>
        </div>
      </div>

      {/* Grid of stickers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {stickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => handleTapSticker(sticker)}
            className={`p-4 rounded-3xl border-2 transition-all transform active:scale-95 text-center flex flex-col items-center justify-between min-h-[170px] ${
              sticker.unlocked
                ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-600/60 shadow-md hover:shadow-lg'
                : 'bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
            }`}
          >
            {/* Sticker emoji or lock */}
            <div className="relative my-auto">
              <span className={`text-5xl block transition-transform ${sticker.unlocked ? 'hover:scale-110' : 'filter grayscale blur-[1px]'}`}>
                {sticker.emoji}
              </span>
              {!sticker.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 rounded-full">
                  <Lock className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="w-full mt-2">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                {sticker.name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                {sticker.requirement}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800"
        >
          Volver a Jugar
        </button>
      </div>
    </div>
  );
};
