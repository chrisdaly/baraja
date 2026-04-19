import { useState, useEffect } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ProgressBar from './components/ProgressBar';
import Flashcard from './components/Flashcard';
import RecognitionFeedback from './components/RecognitionFeedback';
import HomeScreen from './components/HomeScreen';
import DailyGoalModal from './components/DailyGoalModal';
import CardsManagePage from './components/CardsManagePage';
import BlogPost from './components/BlogPost';
import NavigationBar from './components/NavigationBar';
import DemoBanner from './components/DemoBanner';
import useFlashcards from './hooks/useFlashcards';
import useTextToSpeech from './hooks/useTextToSpeech';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useDailyActivity from './hooks/useDailyActivity';
import useSRS from './hooks/useSRS';
import { isSupabaseConfigured } from './lib/supabase';
import { DemoContext, getIsDemo } from './lib/demoContext';

const suits = ['🏆', '⚜️', '🌟', '👑', '💎', '🎭', '🎨', '🎪'];

export default function App() {
  const isDemo = getIsDemo();
  const { cards, loading, reload: reloadCards } = useFlashcards();
  const { speak } = useTextToSpeech();
  const { isRecording, isPreparing, startRecognition } = useSpeechRecognition();
  const { activities, todayStats: activityStats, updateTodayActivity, loading: activityLoading, DAILY_GOAL } = useDailyActivity();
  const srs = useSRS();

  const [view, setView] = useState(() => {
    return window.location.hash === '#blog' ? 'blog' : 'home';
  }); // 'home' | 'practice' | 'cards' | 'blog'
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [hasShownGoalToday, setHasShownGoalToday] = useState(false);
  const [cardKey, setCardKey] = useState(0); // Key to trigger re-render animation
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null); // Track specific card to view
  const [demoCardIndex, setDemoCardIndex] = useState(0); // Demo mode card cycling
  const [feedback, setFeedback] = useState({
    show: false,
    icon: '',
    text: '',
    heard: '',
  });

  // Sync hash with view
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#blog') {
        setView('blog');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (view === 'blog') {
      window.location.hash = '#blog';
    } else if (window.location.hash === '#blog') {
      history.replaceState(null, '', window.location.pathname);
    }
  }, [view]);

  // Check if we have SRS configured (Supabase must be configured and loaded)
  const hasSRS = isSupabaseConfigured() && !srs.loading;

  // Determine which card to show
  // Priority: 1) Specific selected card, 2) SRS current card, 3) Demo cycling, 4) First card
  let currentCard;
  if (selectedCardId) {
    currentCard = cards.find(card => card.id === selectedCardId);
  } else if (isDemo) {
    currentCard = cards[demoCardIndex % cards.length];
  } else if (hasSRS) {
    currentCard = srs.currentCard;
  } else {
    currentCard = cards[0];
  }

  const progress = hasSRS ? srs.progress : (activityStats.learned / DAILY_GOAL) * 100;

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

  const handleSRSReview = async (quality) => {
    if (!currentCard) return;

    // Start transition - fade out current card
    setIsTransitioning(true);
    setIsFlipped(false);

    // Small delay for fade out
    await new Promise(resolve => setTimeout(resolve, 150));

    // Clear selected card ID to return to SRS flow
    setSelectedCardId(null);

    if (isDemo) {
      // Demo mode: just cycle to next card
      setDemoCardIndex(prev => prev + 1);
      setCardKey(prev => prev + 1);
      setIsTransitioning(false);
      return;
    }

    // 0=again, 1=hard, 2=good, 3=easy
    // Update the card data
    await srs.reviewCard(currentCard.card_id || currentCard.id, quality);

    // Trigger the slide-in animation with new card
    setCardKey(prev => prev + 1);
    setIsTransitioning(false);

    // Update daily activity with cumulative totals from the database
    // Always increment reviewed count
    const newReviewed = activityStats.reviewed + 1;
    // Only increment learned if quality >= 2 (good or easy)
    const newLearned = activityStats.learned + (quality >= 2 ? 1 : 0);
    updateTodayActivity(newReviewed, newLearned);

    // Check if daily goal reached
    if (newLearned === DAILY_GOAL && !hasShownGoalToday) {
      setTimeout(() => {
        setShowGoalModal(true);
        setHasShownGoalToday(true);
      }, 600);
    }
  };

  const handleGoalModalContinue = () => {
    setShowGoalModal(false);
    // Stay in practice view
  };

  const handleGoalModalHome = () => {
    setShowGoalModal(false);
    setView('home');
  };

  const handleNavigation = (newView) => {
    // Clear selected card when navigating to practice view
    if (newView === 'practice') {
      setSelectedCardId(null);
    }
    setView(newView);
  };

  if (loading || activityLoading) {
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

  // Show cards management page (browse and create)
  if (view === 'cards') {
    return (
      <>
        <div className={`fixed inset-0 overflow-y-auto pb-20 ${isDemo ? 'pt-8' : ''}`} style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}>
          <Background />
          <CardsManagePage
            isDemo={isDemo}
            cards={cards}
            onCardsUpdate={reloadCards}
            onViewCard={(cardId) => {
              // Switch to practice view and show the selected card
              setSelectedCardId(cardId);
              setIsFlipped(false); // Reset flip state
              setView('practice');
            }}
          />
        </div>
        <NavigationBar currentView={view} onNavigate={handleNavigation} />
      </>
    );
  }

  // Show blog post
  if (view === 'blog') {
    return (
      <>
        <div className="fixed inset-0 overflow-y-auto pb-20" style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}>
          <Background />
          <BlogPost onBack={() => setView('home')} />
        </div>
        <NavigationBar currentView={view} onNavigate={handleNavigation} />
      </>
    );
  }

  // Show home screen by default
  if (view === 'home') {
    // Check if there are no cards - show empty state
    if (cards.length === 0) {
      return (
        <>
          <div className="min-h-screen flex items-center justify-center p-5 pb-20">
            <Background />
            <div className="relative z-10 text-center max-w-md bg-white/95 p-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[0_6px_0_#2c2c2c]">
              <div className="font-playful text-3xl text-[#2c2c2c] mb-4">no hay tarjetas</div>
              <div className="font-indie text-base text-gray-600 mb-4">
                haz clic en "agregar" para crear tus primeras tarjetas
              </div>
            </div>
          </div>
          <NavigationBar currentView={view} onNavigate={handleNavigation} />
        </>
      );
    }

    return (
      <>
        <div className="min-h-screen overflow-auto pb-20">
          <Background />
          <HomeScreen
            activities={activities}
            todayStats={activityStats}
            isDemo={isDemo}
            isRecording={isRecording}
            isPreparing={isPreparing}
            onBlog={() => setView('blog')}
            onMicStart={() => {
              startRecognition(
                '¡bienvenidos!',
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
            }}
            onStartPractice={() => {
              setSelectedCardId(null); // Clear selected card to use SRS flow
              setView('practice');
            }}
          />
        </div>
        <RecognitionFeedback
          show={feedback.show}
          icon={feedback.icon}
          text={feedback.text}
          heard={feedback.heard}
        />
        <NavigationBar currentView={view} onNavigate={handleNavigation} />
      </>
    );
  }

  // Practice view - check if we have any cards or due cards
  if (cards.length === 0) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-5 pb-20">
          <Background />
          <div className="relative z-10 text-center max-w-md bg-white/95 p-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[0_6px_0_#2c2c2c]">
            <div className="font-playful text-3xl text-[#2c2c2c] mb-4">no hay tarjetas</div>
            <div className="font-indie text-base text-gray-600 mb-4">
              agrega tarjetas primero para practicar
            </div>
          </div>
        </div>
        <NavigationBar currentView={view} onNavigate={handleNavigation} />
      </>
    );
  }

  // If SRS is configured and has no due cards, show options to continue
  if (hasSRS && !currentCard && view === 'practice') {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-5 pb-20">
          <Background />
          <div className="relative z-10 text-center max-w-md bg-white/95 p-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[0_6px_0_#2c2c2c]">
            <div className="font-playful text-5xl mb-4">🎉</div>
            <div className="font-playful text-3xl text-[#2c2c2c] mb-4">¡todo hecho!</div>
            <div className="font-indie text-base text-gray-600 mb-6">
              no hay tarjetas para repasar ahora.
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Force reload SRS to get new cards
                  srs.reload();
                }}
                className="w-full px-6 py-3 border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold bg-spanish-yellow text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] transition-transform lowercase"
              >
                🔄 recargar tarjetas
              </button>
              <button
                onClick={() => setView('cards')}
                className="w-full px-6 py-3 border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold bg-white text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] transition-transform lowercase"
              >
                📚 ver todas las tarjetas
              </button>
              <button
                onClick={() => setView('home')}
                className="w-full px-6 py-3 border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold bg-white text-gray-600 shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] transition-transform lowercase"
              >
                ← volver a inicio
              </button>
            </div>
          </div>
        </div>
        <NavigationBar currentView={view} onNavigate={handleNavigation} />
      </>
    );
  }

  return (
    <>
      <div className={`min-h-screen flex items-center justify-center px-3 py-2 sm:p-5 pb-24 overflow-hidden ${isDemo ? 'pt-10' : ''}`}>
        <Background />

        <div className="max-w-[420px] w-full relative z-10 flex flex-col justify-center gap-4">

        {currentCard && (
          <div
            key={cardKey}
            className={isTransitioning ? 'opacity-0 transition-opacity duration-150' : 'animate-slideInFromRight'}
          >
            <Flashcard
              spanish={currentCard.spanish}
              english={currentCard.english}
              examples={currentCard.examples}
              suitSymbol={suits[0]}
              onSpeak={handleSpeak}
              onMicStart={handleMicStart}
              isRecording={isRecording}
              isPreparing={isPreparing}
              swipeDirection={swipeDirection}
              isFlipped={isFlipped}
              onFlip={setIsFlipped}
            />
          </div>
        )}

        {/* SRS Quality Buttons - Always show them */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleSRSReview(0)}
              className="flex-1 p-2.5 sm:p-3 border-[3px] border-[#2c2c2c] rounded-xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide relative overflow-hidden backdrop-blur-[10px] font-marker bg-[rgba(255,139,148,0.95)] text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center text-xs sm:text-sm"
            >
              <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
              <span className="relative z-10">↻ otra vez</span>
            </button>
            <button
              onClick={() => handleSRSReview(1)}
              className="flex-1 p-2.5 sm:p-3 border-[3px] border-[#2c2c2c] rounded-xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide relative overflow-hidden backdrop-blur-[10px] font-marker bg-[rgba(255,214,109,0.95)] text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center text-xs sm:text-sm"
            >
              <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
              <span className="relative z-10">difícil</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSRSReview(2)}
              className="flex-1 p-2.5 sm:p-3 border-[3px] border-[#2c2c2c] rounded-xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide relative overflow-hidden backdrop-blur-[10px] font-marker bg-[rgba(107,207,127,0.95)] text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center text-xs sm:text-sm"
            >
              <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
              <span className="relative z-10">✓ bien</span>
            </button>
            <button
              onClick={() => handleSRSReview(3)}
              className="flex-1 p-2.5 sm:p-3 border-[3px] border-[#2c2c2c] rounded-xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide relative overflow-hidden backdrop-blur-[10px] font-marker bg-[rgba(135,206,250,0.95)] text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center text-xs sm:text-sm"
            >
              <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
              <span className="relative z-10">🌟 fácil</span>
            </button>
          </div>
        </div>
      </div>

      <RecognitionFeedback
        show={feedback.show}
        icon={feedback.icon}
        text={feedback.text}
        heard={feedback.heard}
      />

        <DailyGoalModal
          show={showGoalModal}
          onContinue={handleGoalModalContinue}
          onGoHome={handleGoalModalHome}
        />
      </div>

      <NavigationBar currentView={view} onNavigate={handleNavigation} />
    </>
  );
}
