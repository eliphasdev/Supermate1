import React from 'react';
import { Delete, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NumberPadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  maxLength?: number;
  disabled?: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  value,
  onChange,
  onSubmit,
  maxLength = 2,
  disabled = false,
}) => {
  const handleDigit = (digit: string) => {
    if (disabled) return;
    if (value.length < maxLength) {
      soundManager.playPop();
      onChange(value + digit);
    }
  };

  const handleDelete = () => {
    if (disabled) return;
    soundManager.playPop();
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    soundManager.playPop();
    onChange('');
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Display box */}
      <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 rounded-2xl shadow-inner mb-3">
        <span className="text-xs font-semibold text-slate-400">Tu respuesta:</span>
        <div className="text-3xl font-mono font-black tabular-nums text-slate-900 dark:text-amber-400 min-h-[38px] flex items-center justify-end">
          {value || <span className="text-slate-300 dark:text-slate-600 font-normal">_</span>}
        </div>
      </div>

      {/* Grid of digits */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(digit)}
            className="h-13 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 active:bg-amber-100 border border-slate-200 dark:border-slate-700 rounded-xl text-xl font-bold text-slate-800 dark:text-slate-100 shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: Delete, 0, Confirm */}
        <button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={handleDelete}
          aria-label="Borrar último número"
          className="h-13 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 font-semibold transition-all active:scale-95 disabled:opacity-40"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit('0')}
          className="h-13 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xl font-bold text-slate-800 dark:text-slate-100 shadow-xs transition-all active:scale-95 disabled:opacity-50"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={onSubmit}
          aria-label="Confirmar respuesta"
          className="h-13 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold shadow-md transition-all active:scale-95 disabled:opacity-40"
        >
          <Check className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
