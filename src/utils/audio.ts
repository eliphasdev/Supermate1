/**
 * Audio feedback and Speech Synthesis utility for 7-year-old learners.
 * Specially calibrated for children:
 * - Patient, measured tempo (not fast: ~0.8x rate)
 * - Prioritizes warm, gentle, maternal/female voices in Spanish
 * - Soft, soothing musical chimes (sine/warm triangle with smooth envelope)
 */

const FEMALE_VOICE_KEYWORDS = [
  'monica', 'paulina', 'lucia', 'laura', 'helena', 'elena', 'victoria',
  'francisca', 'sofia', 'sabina', 'paloma', 'carmen', 'luz', 'ines',
  'inés', 'rosa', 'camila', 'mia', 'female', 'mujer', 'elvira', 'conchita',
  'maria', 'maría', 'raquel', 'jimena', 'marta', 'silvia', 'catalina',
  'natural female', 'online natural'
];

class SoundController {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;
  private speechRate: number = 0.80; // Gentle, patient pace for 7-year-olds
  private speechPitch: number = 1.12; // Warm, gentle, friendly pitch
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.availableVoices = window.speechSynthesis.getVoices();
    this.findBestFemaleSpanishVoice();
  }

  private findBestFemaleSpanishVoice(): SpeechSynthesisVoice | null {
    if (!this.availableVoices.length) return null;

    // Filter Spanish voices
    const spanishVoices = this.availableVoices.filter(v => 
      v.lang.toLowerCase().startsWith('es')
    );

    if (!spanishVoices.length) {
      // Fallback to any voice
      this.selectedVoice = this.availableVoices[0] || null;
      return this.selectedVoice;
    }

    // 1. Look for known female Spanish voices
    for (const v of spanishVoices) {
      const nameLower = v.name.toLowerCase();
      if (FEMALE_VOICE_KEYWORDS.some(kw => nameLower.includes(kw))) {
        this.selectedVoice = v;
        return v;
      }
    }

    // 2. Look for Google / Microsoft / Apple Spanish natural voices (frequently female)
    const naturalVoice = spanishVoices.find(v => 
      v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')
    );
    if (naturalVoice) {
      this.selectedVoice = naturalVoice;
      return naturalVoice;
    }

    // 3. Any Spanish voice
    this.selectedVoice = spanishVoices[0];
    return this.selectedVoice;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.65, Math.min(1.0, rate));
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public getSelectedVoiceName(): string {
    return this.selectedVoice?.name || 'Voz en español suave';
  }

  // Soft, warm bubble pop sound (soothing for children)
  public playPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.09);

      // Smooth envelope to prevent harsh clicking
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio not permitted yet
    }
  }

  // Warm, melodic ascending arpeggio with soft bell timbre
  public playSuccess() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Soft pentatonic chime notes (C5, E5, G5, B5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = now + idx * 0.11;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.14, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // Fallback
    }
  }

  // Warm, reassuring chime for "try again" without any harsh buzzer sound
  public playEncouragement() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Gentle warm minor third (G4 to E4)
      const notes = [392.0, 329.63];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = now + idx * 0.15;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // Fallback
    }
  }

  // Celebratory sweet chime fanfare
  public playFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const sequence = [
        { f: 523.25, d: 0.14 }, // C5
        { f: 659.25, d: 0.14 }, // E5
        { f: 783.99, d: 0.18 }, // G5
        { f: 1046.5, d: 0.55 }, // C6
      ];

      let elapsed = 0;
      const now = ctx.currentTime;

      sequence.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = now + elapsed;
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + note.d + 0.05);

        elapsed += note.d * 0.88;
      });
    } catch {
      // Fallback
    }
  }

  // Voice Narration via Web Speech API in Spanish, gentle, familiar, maternal pace
  public speak(text: string, onEnd?: () => void) {
    if (!this.speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Ensure voices are loaded
      if (!this.selectedVoice) {
        this.loadVoices();
      }

      // Add gentle commas for natural breath pauses if raw numbers
      const formattedText = text
        .replace(/([0-9]+)/g, ' $1 ')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(formattedText);
      utterance.lang = 'es-CL'; // Latin American / Chilean friendly Spanish
      utterance.rate = this.speechRate; // Deliberate, calm, unhurried (default 0.80)
      utterance.pitch = this.speechPitch; // Friendly, warm, maternal pitch

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public testVoice() {
    this.speak('¡Hola! Soy tu profesora de matemáticas. Vamos a aprender juntos, con calma y entusiasmo.');
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }
}

export const soundManager = new SoundController();
