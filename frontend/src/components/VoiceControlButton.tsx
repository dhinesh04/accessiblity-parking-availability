import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceControl } from "@/hooks/useVoiceControl";

interface VoiceControlButtonProps {
  onCommand: (command: string, transcript: string) => void;
}

export function VoiceControlButton({ onCommand }: VoiceControlButtonProps) {
  const { isListening, isSupported, startListening, stopListening } = useVoiceControl({ onCommand });

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      variant={isListening ? "destructive" : "default"}
      size="icon"
      className="rounded-full shadow-lg"
      aria-label={isListening ? "Stop voice control" : "Start voice control"}
      aria-pressed={isListening}
    >
      {isListening ? (
        <MicOff className="h-5 w-5 animate-pulse" aria-hidden="true" />
      ) : (
        <Mic className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
