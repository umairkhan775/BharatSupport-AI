import { SupportedLanguage } from '../types';

export class SpeechService {
  private static recognition: any = null;
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Initialize Speech Recognition
  static initRecognition(
    onResult: (text: string) => void,
    onError: (err: any) => void,
    language: SupportedLanguage = 'en'
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      return false;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
      };

      recognition.lang = langMap[language] || 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        onError(event.error);
      };

      this.recognition = recognition;
      return true;
    } catch (e) {
      console.error('Failed to init speech recognition:', e);
      return false;
    }
  }

  static startListening(): boolean {
    if (this.recognition) {
      try {
        this.recognition.start();
        return true;
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    }
    return false;
  }

  static stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
    }
  }

  // Text to Speech
  static speak(text: string, language: SupportedLanguage = 'en') {
    if (!this.synth) return;

    try {
      this.synth.cancel(); // Stop any ongoing speech

      // Clean markdown tags for clear speech
      const cleanText = text
        .replace(/[*#_`\[\]()]/g, ' ')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/\n+/g, '. ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
      };

      utterance.lang = langMap[language] || 'en-IN';

      const voices = this.synth.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('IN') || (language === 'hi' && v.lang.includes('hi')));
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.error('TTS speech error:', e);
    }
  }

  static stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
