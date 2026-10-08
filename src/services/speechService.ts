/**
 * @file src/services/speechService.ts
 * @responsibility Single Responsibility: Handle hands-free voice command recognition
 * (voice cancel "I am OK", "Cancel") and Speech Synthesis (TTS guidance).
 */

type VoiceCallback = (command: 'cancel' | 'sos' | 'other', transcript: string) => void;

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private currentCallback: VoiceCallback | null = null;

  constructor() {
    const win = typeof window !== 'undefined' ? (window as any) : {};
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          const cleaned = transcript.trim().toLowerCase();

          if (cleaned.includes('i am ok') || cleaned.includes("i'm ok") || cleaned.includes('cancel') || cleaned.includes('false alarm') || cleaned.includes('theek hun') || cleaned.includes('im ok')) {
            if (this.currentCallback) {
              this.currentCallback('cancel', cleaned);
            }
          } else if (cleaned.includes('help') || cleaned.includes('ambulance') || cleaned.includes('emergency') || cleaned.includes('call rescue')) {
            if (this.currentCallback) {
              this.currentCallback('sos', cleaned);
            }
          } else if (cleaned.length > 0) {
            if (this.currentCallback) {
              this.currentCallback('other', cleaned);
            }
          }
        };

        this.recognition.onerror = () => {
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      } catch {
        this.recognition = null;
      }
    }
  }

  public startListening(onCommand: VoiceCallback) {
    this.currentCallback = onCommand;
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch {
        // Recognition might already be running or blocked
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Safe catch
      }
    }
    this.isListening = false;
    this.currentCallback = null;
  }

  public speak(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback
      }
    }
  }
}

export const speechService = new SpeechService();
