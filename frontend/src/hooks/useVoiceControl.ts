import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VoiceControlOptions {
  onCommand: (command: string, transcript: string) => void;
}

export function useVoiceControl({ onCommand }: VoiceControlOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    if (!isSupported || !isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      toast.info('🎤 Listening... Speak now');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice command:', transcript);

      // Parse commands
      if (transcript.includes('find') || transcript.includes('search')) {
        onCommand('search', transcript);
      } else if (transcript.includes('nearest') || transcript.includes('closest')) {
        onCommand('nearest', transcript);
      } else if (transcript.includes('favorite') || transcript.includes('favourite')) {
        onCommand('favorites', transcript);
      } else if (transcript.includes('call') || transcript.includes('emergency')) {
        onCommand('emergency', transcript);
      } else if (transcript.includes('help') || transcript.includes('assist')) {
        onCommand('help', transcript);
      } else if (transcript.includes('weather')) {
        onCommand('weather', transcript);
      } else if (transcript.includes('refresh') || transcript.includes('update')) {
        onCommand('refresh', transcript);
      } else {
        onCommand('unknown', transcript);
        toast.error(`Command not recognized: "${transcript}"`);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        toast.warning('No speech detected. Try again.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please enable in settings.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore errors on cleanup
      }
    };
  }, [isListening, isSupported, onCommand]);

  const startListening = () => {
    if (!isSupported) {
      toast.error('Voice control not supported in this browser');
      return;
    }
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
}
