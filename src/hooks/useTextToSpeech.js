export default function useTextToSpeech() {
  const getSpanishVoice = () => {
    const voices = speechSynthesis.getVoices();
    // Try to find a Spanish voice (prefer es-ES, then any Spanish)
    return (
      voices.find((v) => v.lang === 'es-ES') ||
      voices.find((v) => v.lang === 'es-MX') ||
      voices.find((v) => v.lang.startsWith('es')) ||
      null
    );
  };

  const speak = (text, lang = 'es-ES', rate = 0.85) => {
    if (!('speechSynthesis' in window)) {
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

    // Try to get a Spanish voice explicitly
    const spanishVoice = getSpanishVoice();
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    return true;
  };

  // Pre-load voices (needed on some browsers)
  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    // Some browsers need this event to populate voices
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }

  return { speak };
}
