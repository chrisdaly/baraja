export default function useTextToSpeech() {
  const speak = (text, lang = 'es-ES', rate = 0.85) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };

  return { speak };
}
