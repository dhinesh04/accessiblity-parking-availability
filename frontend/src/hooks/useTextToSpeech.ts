import { useCallback } from 'react';

export function useTextToSpeech() {
  const speak = useCallback((text: string, options?: { urgent?: boolean; rate?: number; pitch?: number }) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || (options?.urgent ? 1.2 : 1.0);
    utterance.pitch = options?.pitch || (options?.urgent ? 1.1 : 1.0);
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, []);

  return { speak, stopSpeaking };
}
