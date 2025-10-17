import { useState, useCallback } from 'react';

export default function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
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

      setIsRecording(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const original = targetText.toLowerCase();
        const similarity = checkSimilarity(transcript, original);

        onResult?.({
          transcript,
          similarity,
          success: similarity > 0.6,
        });

        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        onError?.('No pude escucharte bien');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    },
    [isSupported]
  );

  return {
    isRecording,
    isSupported,
    startRecognition,
  };
}
