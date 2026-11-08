import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AudioButtonProps {
  textToRead: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  autoPlay?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToRead,
  label = 'Escuchar',
  size = 'md',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (isPlaying) {
      soundManager.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundManager.speak(textToRead, () => {
        setIsPlaying(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center font-bold rounded-xl transition-all shadow-xs active:scale-95 ${
        isPlaying
          ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800'
      } ${sizeClasses[size]}`}
      title="Leer en voz alta para practicar lectura autónoma"
    >
      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
      <span>{isPlaying ? 'Leyendo...' : label}</span>
    </button>
  );
};
