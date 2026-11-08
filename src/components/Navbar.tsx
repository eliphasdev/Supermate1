import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, Mic } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentTab: 'practice' | 'exam' | 'stickers' | 'guide';
  onSelectTab: (tab: 'practice' | 'exam' | 'stickers' | 'guide') => void;
  totalStars: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, totalStars }) => {
  const [soundOn, setSoundOn] = React.useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setSoundEnabled(next);
    soundManager.setSpeechEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark, single line */}
        <button
          type="button"
          onClick={() => onSelectTab('practice')}
          className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 whitespace-nowrap shrink-0 font-display flex items-center gap-2 text-left"
        >
          <span>SuperMate</span>
          <span className="text-amber-500 text-sm font-black bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-lg">
            7 Años
          </span>
        </button>

        {/* Zone 2: 4 clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onSelectTab('practice')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'practice'
                ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Práctica de Contenidos
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('exam')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'exam'
                ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Simulacro 10/11</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('stickers')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'stickers'
                ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Álbum de Stickers</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'guide'
                ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Guía para Familias
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound & Speech toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? 'Silenciar sonidos y voz' : 'Activar sonidos y voz'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundOn ? 'Sonido y voz activados' : 'Sonido silenciado'}
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Quick stars badge */}
          <button
            type="button"
            onClick={() => onSelectTab('stickers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 shadow-2xs hover:bg-amber-100"
          >
            <span>⭐</span>
            <span className="font-mono">{totalStars}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs font-bold">
        <button
          onClick={() => onSelectTab('practice')}
          className={`py-1 px-2.5 rounded-lg ${currentTab === 'practice' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Práctica
        </button>
        <button
          onClick={() => onSelectTab('exam')}
          className={`py-1 px-2.5 rounded-lg ${currentTab === 'exam' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Simulacro 10/11
        </button>
        <button
          onClick={() => onSelectTab('stickers')}
          className={`py-1 px-2.5 rounded-lg ${currentTab === 'stickers' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Stickers
        </button>
        <button
          onClick={() => onSelectTab('guide')}
          className={`py-1 px-2.5 rounded-lg ${currentTab === 'guide' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Familias
        </button>
      </div>
    </header>
  );
};
