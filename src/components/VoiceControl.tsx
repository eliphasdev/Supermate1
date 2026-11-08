import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { isSpeechRecognitionSupported, parseVoiceInput, VoiceCommandResult } from '../utils/speechRecognition';
import { soundManager } from '../utils/audio';

interface VoiceControlProps {
  onNumberDetected?: (num: number) => void;
  onCommandDetected?: (cmd: string) => void;
  targetHint?: string;
  autoListen?: boolean;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  onNumberDetected,
  onCommandDetected,
  targetHint,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const supported = isSpeechRecognitionSupported();
    setIsSupported(supported);

    if (supported && typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'es-CL'; // Spanish locale suitable for Latin America / Chile

        recognition.onstart = () => {
          setIsListening(true);
          soundManager.playPop();
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          const result: VoiceCommandResult = parseVoiceInput(currentTranscript);

          if (result.detectedNumber !== undefined) {
            setLastDetected(`Número: ${result.detectedNumber}`);
            if (onNumberDetected) {
              onNumberDetected(result.detectedNumber);
            }
          } else if (result.detectedCommand) {
            setLastDetected(`Comando: ${result.detectedCommand}`);
            if (onCommandDetected) {
              onCommandDetected(result.detectedCommand);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onNumberDetected, onCommandDetected]);

  const toggleListening = () => {
    if (!isSupported) {
      soundManager.speak('Tu navegador no tiene activado el micrófono para comandos de voz. Puedes usar los botones de la pantalla.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setLastDetected(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-amber-200/80 dark:border-slate-700 shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? 'Detener micrófono' : 'Hablar con micrófono'}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full font-bold shadow-md transition-all transform active:scale-95 ${
            isListening
              ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse'
              : 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300'
          }`}
        >
          {isListening ? (
            <span className="flex items-center justify-center">
              <Mic className="w-6 h-6 animate-bounce" />
            </span>
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              {isListening ? '¡Escuchando tu voz!...' : 'Comando de Voz'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isListening
              ? 'Di tu respuesta en voz alta (ej: "quince", "sumar", "repetir")'
              : targetHint || 'Toca el micrófono y dí el número o respuesta'}
          </p>
        </div>
      </div>

      {/* Voice feedback badge */}
      <div className="flex items-center gap-2">
        {transcript && (
          <div className="px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-amber-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="truncate max-w-[150px]">"{transcript}"</span>
          </div>
        )}

        {lastDetected && (
          <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-xs">
            ✓ {lastDetected}
          </div>
        )}

        {!isSupported && (
          <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Voz disponible en Chrome / Edge</span>
          </div>
        )}
      </div>
    </div>
  );
};
