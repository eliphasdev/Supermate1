import React, { useState } from 'react';
import { Volume2, Sparkles, Sliders, Play, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const VoiceSettingsBar: React.FC = () => {
  const [currentRate, setCurrentRate] = useState<number>(soundManager.getSpeechRate());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);

  const handleRateChange = (rate: number) => {
    setCurrentRate(rate);
    soundManager.setSpeechRate(rate);
    soundManager.playPop();
  };

  const handleTestVoice = () => {
    setIsPlayingTest(true);
    soundManager.speak(
      '¡Hola! Vamos a aprender matemáticas con calma, paso a pasito.',
      () => setIsPlayingTest(false)
    );
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-rose-200/80 dark:border-slate-800 p-3 sm:px-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator of gentle female voice */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm shadow-2xs">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Voz de Profesora (Suave y Pausada)
              </span>
              <span className="text-[10px] bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                7 Años
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Lectura tranquila para comprender sin apuro
            </p>
          </div>
        </div>

        {/* Right: Quick actions: Test voice and adjust speed */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestVoice}
            disabled={isPlayingTest}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 ${
              isPlayingTest
                ? 'bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingTest ? 'Hablando suavemente...' : 'Escuchar Voz'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Ajustar velocidad de lectura"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible speed selector */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">Velocidad de habla:</span>
          <div className="flex items-center gap-1.5">
            {[
              { val: 0.72, label: 'Muy tranquila (0.7x)' },
              { val: 0.80, label: 'Recomendada (0.8x)' },
              { val: 0.90, label: 'Normal (0.9x)' },
            ].map((option) => (
              <button
                key={option.val}
                type="button"
                onClick={() => handleRateChange(option.val)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  Math.abs(currentRate - option.val) < 0.04
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
