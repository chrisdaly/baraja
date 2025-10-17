import { useState, useCallback } from 'react';

export default function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSupported, setIsSupported] = useState(
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  );

  const checkSimilarity = (str1, str2) => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;

    words1.forEach((word) => {
      if (words2.some((w) => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });

    return matches / Math.max(words1.length, words2.length);
  };

  const startRecognition = useCallback(
    (targetText, onResult, onError) => {
      if (!isSupported) {
        onError?.('Tu navegador no soporta reconocimiento de voz 😢');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Show preparing state immediately
      setIsPreparing(true);

      recognition.onstart = () => {
        // Mic is ready and listening
        setIsPreparing(false);
        setIsRecording(true);
        console.log('🎤 Microphone started - speak now!');
      };

      recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected!');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const original = targetText.toLowerCase();
        const similarity = checkSimilarity(transcript, original);

        console.log('📝 Heard:', transcript);

        onResult?.({
          transcript,
          similarity,
          success: similarity > 0.6,
        });

        setIsRecording(false);
        setIsPreparing(false);
      };

      recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsRecording(false);
        setIsPreparing(false);

        if (event.error === 'no-speech') {
          onError?.('No escuché nada. Intenta de nuevo.');
        } else if (event.error === 'audio-capture') {
          onError?.('No puedo acceder al micrófono');
        } else {
          onError?.('No pude escucharte bien');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsPreparing(false);
        console.log('🛑 Microphone stopped');
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsPreparing(false);
        setIsRecording(false);
        onError?.('Error al iniciar el micrófono');
      }
    },
    [isSupported]
  );

  return {
    isRecording,
    isPreparing,
    isSupported,
    startRecognition,
  };
}
