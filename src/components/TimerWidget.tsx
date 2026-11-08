import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Clock, Flag, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TimerWidgetProps {
  onTimeOut?: () => void;
  initialMode?: 'stopwatch' | 'countdown';
  countdownSeconds?: number;
  compact?: boolean;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  onTimeOut,
  initialMode = 'stopwatch',
  countdownSeconds = 60,
  compact = false,
}) => {
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>(initialMode);
  const [seconds, setSeconds] = useState<number>(initialMode === 'countdown' ? countdownSeconds : 0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(countdownSeconds);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'stopwatch') {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(interval);
              setIsRunning(false);
              soundManager.playFanfare();
              soundManager.speak('¡Tiempo completado! ¡Excelente esfuerzo!');
              if (onTimeOut) onTimeOut();
              return 0;
            }
            if (prev === 6) {
              soundManager.playEncouragement();
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode, onTimeOut]);

  const handleStart = () => {
    soundManager.playPop();
    setIsRunning(true);
  };

  const handlePause = () => {
    soundManager.playPop();
    setIsRunning(false);
  };

  const handleReset = () => {
    soundManager.playPop();
    setIsRunning(false);
    setSeconds(mode === 'countdown' ? selectedDuration : 0);
  };

  const switchMode = (newMode: 'stopwatch' | 'countdown', newDuration?: number) => {
    soundManager.playPop();
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'stopwatch') {
      setSeconds(0);
    } else {
      const dur = newDuration || selectedDuration;
      setSelectedDuration(dur);
      setSeconds(dur);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = mode === 'countdown' 
    ? Math.max(0, Math.min(100, ((selectedDuration - seconds) / selectedDuration) * 100))
    : 0;

  if (compact || isMinimized) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <Clock className={`w-4 h-4 ${isRunning ? 'text-blue-500 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '4s' }} />
        <span className="font-mono text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
          {formatTime(seconds)}
        </span>
        <button
          onClick={isRunning ? handlePause : handleStart}
          aria-label={isRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro'}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1"
        >
          Expandir
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
              {mode === 'stopwatch' ? 'Cronómetro de Práctica' : 'Desafío con Tiempo'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {mode === 'stopwatch' ? 'Mide tu concentración y velocidad' : '¡Compite contra el reloj!'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Minimizar
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-3 text-xs font-semibold">
        <button
          onClick={() => switchMode('stopwatch')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
            mode === 'stopwatch'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Cronómetro
        </button>
        <button
          onClick={() => switchMode('countdown', 60)}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
            mode === 'countdown'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Temporizador
        </button>
      </div>

      {/* Preset countdown buttons if in countdown mode */}
      {mode === 'countdown' && (
        <div className="flex items-center gap-1.5 mb-3 justify-center">
          {[30, 60, 120, 180].map((duration) => (
            <button
              key={duration}
              onClick={() => {
                setSelectedDuration(duration);
                setSeconds(duration);
                setIsRunning(false);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedDuration === duration
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {duration < 60 ? `${duration}s` : `${duration / 60} min`}
            </button>
          ))}
        </div>
      )}

      {/* Big Digital Display */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className={`text-4xl sm:text-5xl font-mono font-black tabular-nums tracking-wider ${
          mode === 'countdown' && seconds <= 5 && isRunning
            ? 'text-rose-500 animate-pulse'
            : 'text-slate-800 dark:text-slate-100'
        }`}>
          {formatTime(seconds)}
        </div>

        {mode === 'countdown' && (
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                seconds <= 5 ? 'bg-rose-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Iniciar
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            Pausar
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar
        </button>
      </div>
    </div>
  );
};
