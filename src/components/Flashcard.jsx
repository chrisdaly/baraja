import { useState } from 'react';

export default function Flashcard({
  spanish,
  english,
  examples,
  suitSymbol,
  onFlip,
  onSpeak,
  onMicStart,
  isRecording,
  isPreparing,
  swipeDirection,
  isFlipped,
}) {
  const [flippedExamples, setFlippedExamples] = useState([]);

  const handleFlip = () => {
    onFlip?.(!isFlipped);
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    onSpeak?.();
  };

  const handleMic = (e) => {
    e.stopPropagation();
    onMicStart?.();
  };

  const toggleExampleFlip = (index, e) => {
    e.stopPropagation();
    setFlippedExamples((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const speakExample = (text, e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;

      // Try to find a Spanish voice explicitly (mobile browsers need this)
      const voices = speechSynthesis.getVoices();
      const spanishVoice =
        voices.find((v) => v.lang === 'es-ES') ||
        voices.find((v) => v.lang === 'es-MX') ||
        voices.find((v) => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mb-2 sm:mb-4 h-[420px] sm:h-[460px] md:h-[480px] relative flex-shrink-0 overflow-hidden" style={{ perspective: '1000px' }}>
      <div
        className={`w-full h-full absolute top-0 left-0 transition-transform duration-500 cursor-pointer ${swipeDirection ? swipeDirection : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <CardFace isFront>
          <CardCorners />
          <div className="absolute top-[50px] left-5 opacity-10 text-6xl">{suitSymbol}</div>
          <div className="absolute bottom-[50px] right-5 opacity-10 text-6xl rotate-180">{suitSymbol}</div>

          <div className="font-handwritten text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#2c2c2c] mb-6 sm:mb-8 leading-snug lowercase relative z-10">
            {spanish}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-[#ff8b60] rounded opacity-50" />
          </div>

          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 relative z-10">
            <button
              onClick={handleSpeak}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-[#2c2c2c] text-xl sm:text-2xl cursor-pointer transition-transform bg-[#ffd66d] shadow-[0_3px_0_#2c2c2c] sm:shadow-[0_4px_0_#2c2c2c] flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] sm:hover:shadow-[0_6px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c]"
              title="Escuchar"
            >
              🔊
            </button>
            <button
              onClick={handleMic}
              disabled={isPreparing || isRecording}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-[#2c2c2c] text-xl sm:text-2xl cursor-pointer transition-all flex items-center justify-center relative overflow-hidden ${
                isPreparing
                  ? 'bg-[#ffd66d] shadow-[0_3px_0_#2c2c2c] sm:shadow-[0_4px_0_#2c2c2c]'
                  : isRecording
                  ? 'bg-[#ff4757] shadow-[0_3px_0_#2c2c2c] sm:shadow-[0_4px_0_#2c2c2c] animate-pulse scale-110'
                  : 'bg-[#ff8b94] shadow-[0_3px_0_#2c2c2c] sm:shadow-[0_4px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] sm:hover:shadow-[0_6px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c]'
              }`}
              title={isPreparing ? 'Preparando micrófono...' : isRecording ? '¡Habla ahora!' : 'Practicar'}
            >
              {isPreparing ? (
                <span className="animate-spin">⏳</span>
              ) : isRecording ? (
                <span className="animate-pulse">🔴</span>
              ) : (
                '🎤'
              )}
            </button>
          </div>

          {/* Microphone status indicator */}
          {(isPreparing || isRecording) && (
            <div className="mt-3 animate-fadeIn">
              <div className={`px-4 py-2 rounded-lg border-2 border-[#2c2c2c] font-marker text-sm font-bold ${
                isPreparing ? 'bg-[#ffd66d]' : 'bg-[#ff4757] text-white'
              }`}>
                {isPreparing ? '⏳ preparando micrófono...' : '🔴 ¡habla ahora!'}
              </div>
            </div>
          )}

          <div className="font-indie text-xs sm:text-sm text-gray-400 mt-3 sm:mt-5 font-semibold tracking-wide relative z-10">
            toca para voltear
          </div>
        </CardFace>

        {/* Back of card */}
        <CardFace isFront={false}>
          <CardCorners />
          <div className="absolute top-[50px] left-5 opacity-10 text-6xl">{suitSymbol}</div>
          <div className="absolute bottom-[50px] right-5 opacity-10 text-6xl rotate-180">{suitSymbol}</div>

          <div className="font-handwritten text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#2c2c2c] mb-4 sm:mb-6 leading-snug lowercase relative z-10">
            {english}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-[#ff8b60] rounded opacity-50" />
          </div>

          <div className="w-full mt-2 sm:mt-3 relative z-10 space-y-2">
            {(examples || []).map((example, i) => {
              const isExampleFlipped = flippedExamples.includes(i);
              const displayText = typeof example === 'string'
                ? example
                : (isExampleFlipped ? example.english : example.spanish);
              const spanishText = typeof example === 'string' ? example : example.spanish;

              return (
                <div
                  key={i}
                  className="bg-white/90 py-2.5 sm:py-3 px-3 sm:px-4 pr-20 sm:pr-24 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg text-[#2c2c2c] border-2 border-[#2c2c2c] font-semibold relative pl-7 sm:pl-[30px] font-indie leading-snug cursor-pointer hover:bg-white transition-colors"
                  onClick={(e) => typeof example === 'object' && toggleExampleFlip(i, e)}
                >
                  <span className="absolute left-2 sm:left-3 text-[#ff8b60] font-black">→</span>
                  {displayText}
                  <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={(e) => speakExample(spanishText, e)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#2c2c2c] bg-[#ff8b94] text-base sm:text-lg flex items-center justify-center hover:bg-[#ff9ba4] transition-colors shadow-[0_2px_0_#2c2c2c]"
                      title="Escuchar"
                    >
                      🎤
                    </button>
                    {typeof example === 'object' && (
                      <button
                        onClick={(e) => toggleExampleFlip(i, e)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#2c2c2c] bg-[#ffd66d] text-xs font-black flex items-center justify-center hover:bg-[#ffe087] transition-colors shadow-[0_2px_0_#2c2c2c]"
                        title={isExampleFlipped ? 'Ver español' : 'Ver inglés'}
                      >
                        {isExampleFlipped ? 'ES' : 'EN'}
                      </button>
                    )}
                  </div>
                  <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none rounded-[10px]" />
                </div>
              );
            })}
          </div>

          <div className="font-indie text-xs sm:text-sm text-gray-400 mt-3 sm:mt-5 font-semibold tracking-wide relative z-10">
            toca para voltear
          </div>
        </CardFace>
      </div>
    </div>
  );
}

function CardFace({ children, isFront }) {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 px-5 sm:px-7 md:px-8 flex flex-col justify-center items-center border-3 sm:border-4 border-[#2c2c2c] shadow-[0_4px_0_#2c2c2c,0_8px_24px_rgba(0,0,0,0.2)] sm:shadow-[0_6px_0_#2c2c2c,0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden backdrop-blur-[10px] ${
        isFront
          ? 'bg-gradient-to-br from-[rgba(255,245,230,0.97)] to-[rgba(255,232,204,0.97)]'
          : 'bg-gradient-to-br from-[rgba(255,249,240,0.97)] to-[rgba(255,232,204,0.97)] [transform:rotateY(180deg)]'
      }`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Aged paper texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-xl"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {children}
    </div>
  );
}

function CardCorners() {
  return (
    <>
      <div className="absolute top-4 left-4 w-10 h-10 border-t-[3px] border-l-[3px] border-wood opacity-40 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-[3px] border-r-[3px] border-wood opacity-40 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-[3px] border-l-[3px] border-wood opacity-40 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-[3px] border-r-[3px] border-wood opacity-40 rounded-br-lg" />
    </>
  );
}
