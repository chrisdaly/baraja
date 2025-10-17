import { useState, useEffect } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ProgressBar from './components/ProgressBar';
import Flashcard from './components/Flashcard';
import RecognitionFeedback from './components/RecognitionFeedback';
import useFlashcards from './hooks/useFlashcards';
import useTextToSpeech from './hooks/useTextToSpeech';
import useSpeechRecognition from './hooks/useSpeechRecognition';

const suits = ['🏆', '⚜️', '🌟', '👑', '💎', '🎭', '🎨', '🎪'];

export default function App() {
  const { cards, loading } = useFlashcards();
  const { speak } = useTextToSpeech();
  const { isRecording, startRecognition } = useSpeechRecognition();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(1);
  const [knownCards, setKnownCards] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState({
    show: false,
    icon: '',
    text: '',
    heard: '',
  });

  const currentCard = cards[currentCardIndex];
  const progress = cards.length > 0 ? (todayCount / cards.length) * 100 : 0;

  const handleSpeak = () => {
    if (currentCard) {
      speak(currentCard.spanish);
    }
  };

  const handleMicStart = () => {
    if (!currentCard) return;

    startRecognition(
      currentCard.spanish,
      (result) => {
        if (result.success) {
          showFeedback('🎉', '¡Excelente!', `Escuché: "${result.transcript}"`);
        } else {
          showFeedback('💪', '¡Buen intento!', `Escuché: "${result.transcript}"`);
        }
      },
      (error) => {
        showFeedback('😕', 'Error', error);
      }
    );
  };

  const showFeedback = (icon, text, heard) => {
    setFeedback({ show: true, icon, text, heard });
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const moveToNextCard = () => {
    setTimeout(() => {
      setSwipeDirection(null);
      setIsFlipped(false); // Reset flip state for new card

      if (reviewQueue.length > 0 && Math.random() > 0.5) {
        setCurrentCardIndex(reviewQueue[0]);
        setReviewQueue((prev) => prev.slice(1));
      } else {
        setCurrentCardIndex((prev) => (prev + 1) % cards.length);
      }
    }, 500);
  };

  const handleReview = () => {
    setSwipeDirection('swipe-left');

    if (!reviewQueue.includes(currentCardIndex)) {
      setReviewQueue((prev) => [...prev, currentCardIndex]);
    }

    moveToNextCard();
  };

  const handleKnown = () => {
    setSwipeDirection('swipe-right');

    if (!knownCards.includes(currentCardIndex)) {
      setKnownCards((prev) => [...prev, currentCardIndex]);
      setTodayCount((prev) => prev + 1);
    }

    moveToNextCard();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <div className="relative z-10 text-center">
          <div className="font-playful text-4xl text-[#2c2c2c] mb-4">Cargando...</div>
          <div className="font-indie text-lg text-gray-600">Preparando tus tarjetas</div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <Background />
        <div className="relative z-10 text-center max-w-md bg-white/95 p-8 rounded-2xl border-4 border-wood shadow-[0_6px_0_#5c2e0f]">
          <div className="font-playful text-3xl text-[#2c2c2c] mb-4">No hay tarjetas</div>
          <div className="font-indie text-base text-gray-600">
            Configura Supabase para comenzar a agregar tus propias tarjetas de vocabulario.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-2 sm:p-5 overflow-hidden">
      <Background />

      <div className="max-w-[420px] w-full relative z-10 flex flex-col max-h-[100dvh]">
        <Header />

        <StatsBar todayCount={todayCount} streak={streak} totalCards={cards.length} />

        <ProgressBar progress={progress} />

        {currentCard && (
          <Flashcard
            spanish={currentCard.spanish}
            english={currentCard.english}
            examples={currentCard.examples}
            suitSymbol={suits[currentCardIndex % suits.length]}
            onSpeak={handleSpeak}
            onMicStart={handleMicStart}
            isRecording={isRecording}
            swipeDirection={swipeDirection}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
          />
        )}

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleReview}
            className="flex-1 p-3 sm:p-4 border-[3px] border-[#2c2c2c] rounded-2xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide relative overflow-hidden backdrop-blur-[10px] font-marker bg-white/95 text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] sm:shadow-[0_4px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] sm:hover:shadow-[0_6px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
            <span className="relative z-10 flex items-center gap-1.5 text-sm sm:text-base">
              <span className="text-xl sm:text-2xl">↻</span>
              todavía no
            </span>
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 p-3 sm:p-4 border-[3px] border-[#2c2c2c] rounded-2xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide relative overflow-hidden backdrop-blur-[10px] font-marker bg-[rgba(107,207,127,0.95)] text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] sm:shadow-[0_4px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] sm:hover:shadow-[0_6px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
            <span className="relative z-10 flex items-center gap-1.5 text-sm sm:text-base">
              <span className="text-xl sm:text-2xl">✓</span>
              ¡ya está!
            </span>
          </button>
        </div>
      </div>

      <RecognitionFeedback
        show={feedback.show}
        icon={feedback.icon}
        text={feedback.text}
        heard={feedback.heard}
      />
    </div>
  );
}
