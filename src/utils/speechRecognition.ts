/**
 * Speech Recognition utility for voice commands and spoken answers in Spanish.
 * Uses Web Speech Recognition API (SpeechRecognition / webkitSpeechRecognition).
 */

// Mapping of Spanish words to numbers up to 30
const SPANISH_NUMBER_WORDS: Record<string, number> = {
  cero: 0,
  uno: 1,
  una: 1,
  un: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
  catorce: 14,
  quince: 15,
  dieciseis: 16,
  dieciséis: 16,
  diecisiete: 17,
  dieciocho: 18,
  diecinueve: 19,
  veinte: 20,
  veintiuno: 21,
  veintiun: 21,
  veintiún: 21,
  veintidos: 22,
  veintidós: 22,
  veintitres: 23,
  veintitrés: 23,
  veinticuatro: 24,
  veinticinco: 25,
  veintiseis: 26,
  veintiséis: 26,
  veintisiete: 27,
  veintiocho: 28,
  veintinueve: 29,
  treinta: 30,
};

export interface VoiceCommandResult {
  transcript: string;
  detectedNumber?: number;
  detectedCommand?: 'siguiente' | 'repetir' | 'ayuda' | 'sumar' | 'restar' | 'iniciar' | 'pausar' | 'reiniciar';
}

// Browser API declarations
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function parseVoiceInput(rawText: string): VoiceCommandResult {
  const clean = rawText.toLowerCase().trim();

  // Check for commands
  let detectedCommand: VoiceCommandResult['detectedCommand'];
  if (clean.includes('siguiente') || clean.includes('avanzar') || clean.includes('continuar')) {
    detectedCommand = 'siguiente';
  } else if (clean.includes('repetir') || clean.includes('escuchar') || clean.includes('de nuevo') || clean.includes('otra vez')) {
    detectedCommand = 'repetir';
  } else if (clean.includes('ayuda') || clean.includes('pista')) {
    detectedCommand = 'ayuda';
  } else if (clean.includes('sumar') || clean.includes('suma') || clean.includes('más')) {
    detectedCommand = 'sumar';
  } else if (clean.includes('restar') || clean.includes('resta') || clean.includes('menos')) {
    detectedCommand = 'restar';
  } else if (clean.includes('iniciar') || clean.includes('empezar') || clean.includes('comenzar')) {
    detectedCommand = 'iniciar';
  } else if (clean.includes('pausar') || clean.includes('pausa') || clean.includes('parar')) {
    detectedCommand = 'pausar';
  } else if (clean.includes('reiniciar') || clean.includes('resetear') || clean.includes('borrar')) {
    detectedCommand = 'reiniciar';
  }

  // Check for numbers directly in text (digits or words)
  let detectedNumber: number | undefined;

  // 1. Direct digits
  const digitMatch = clean.match(/\b([0-9]{1,2})\b/);
  if (digitMatch) {
    const num = parseInt(digitMatch[1], 10);
    if (!isNaN(num) && num >= 0 && num <= 30) {
      detectedNumber = num;
    }
  }

  // 2. Word matches
  if (detectedNumber === undefined) {
    const words = clean.split(/\s+/);
    for (const word of words) {
      // Clean punctuation
      const stripped = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      if (SPANISH_NUMBER_WORDS[stripped] !== undefined) {
        detectedNumber = SPANISH_NUMBER_WORDS[stripped];
        break;
      }
    }
  }

  return {
    transcript: rawText,
    detectedNumber,
    detectedCommand,
  };
}
