import { useState } from 'react';
import Flashcard from './Flashcard';

export default function HomeScreen({ activities, todayStats, onStartPractice, isDemo = false, onMicStart, isRecording, isPreparing }) {
  const [demoFlipped, setDemoFlipped] = useState(false);
  const currentStreak = calculateStreak(activities);
  const todayActivity = activities.find(
    a => a.date === new Date().toISOString().split('T')[0]
  );
  const isCompletedToday = todayActivity?.is_complete || false;

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 py-12 ${isDemo ? 'pt-20' : ''}`}>
      <div className="max-w-[420px] w-full relative z-10 flex flex-col items-center gap-8">

        {/* Hero title */}
        <div className="text-center space-y-2">
          <h1 className="font-playful text-6xl sm:text-7xl font-black text-[#2c2c2c] tracking-wide uppercase [text-shadow:3px_3px_0_rgba(198,11,30,0.25),_4px_4px_0_rgba(255,196,0,0.2)] italic scale-y-95">
            BARAJA
          </h1>
          <p className="font-marker text-sm sm:text-base text-gray-600 font-bold tracking-[2px] lowercase">
            {isDemo ? 'learn spanish from real content, powered by ai' : 'tarjetas de español'}
          </p>
        </div>

        {isDemo ? (
          <>
            {/* Welcome card using the real Flashcard component */}
            <div className="w-full">
              <Flashcard
                spanish="¡bienvenidos!"
                english="welcome!"
                examples={[]}
                suitSymbol="👋"
                isFlipped={demoFlipped}
                onFlip={setDemoFlipped}
                isRecording={isRecording}
                isPreparing={isPreparing}
                onMicStart={onMicStart}
                onSpeak={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance('¡bienvenidos!');
                    utterance.lang = 'es-ES';
                    utterance.rate = 0.85;
                    const voices = speechSynthesis.getVoices();
                    const spanishVoice = voices.find(v => v.lang === 'es-ES') || voices.find(v => v.lang.startsWith('es'));
                    if (spanishVoice) utterance.voice = spanishVoice;
                    speechSynthesis.cancel();
                    speechSynthesis.speak(utterance);
                  }
                }}
                customBackExtras={
                  <div className="w-full mt-4 relative z-10 space-y-3">
                    <div className="font-indie text-base text-[#2c2c2c] text-center animate-[fadeIn_0.5s_ease-in]">
                      learn from real spanish
                    </div>
                    <div className="font-indie text-base text-spanish-red text-center font-bold animate-[fadeIn_0.5s_ease-in_0.4s_both]">
                      ai turns it into flashcards
                    </div>
                    <div className="font-indie text-base text-[#2c2c2c] text-center animate-[fadeIn_0.5s_ease-in_0.8s_both]">
                      no setup, just paste and go
                    </div>
                  </div>
                }
              />
            </div>
          </>
        ) : (
          <>
            {/* Main CTA */}
            <button
              onClick={onStartPractice}
              className="w-full p-6 border-[3px] border-[#2c2c2c] rounded-2xl font-extrabold cursor-pointer transition-all lowercase tracking-wide overflow-hidden backdrop-blur-[10px] font-marker bg-spanish-yellow text-[#2c2c2c] shadow-[0_4px_0_#2c2c2c] hover:-translate-y-1 hover:shadow-[0_6px_0_#2c2c2c] active:translate-y-0 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center gap-3 text-2xl relative group"
            >
              <div className="absolute inset-0 noise-texture opacity-[0.05] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-3">
                {isCompletedToday ? '🔄' : '▶️'} practicar
              </span>
            </button>

            {/* Minimal stats - just streak and today */}
            <div className="flex gap-4 items-center justify-center">
              <div className="text-center">
                <div className="font-playful text-4xl font-black text-[#2c2c2c]">
                  {currentStreak} 🔥
                </div>
                <div className="font-marker text-xs text-gray-500 uppercase tracking-wide mt-1">
                  racha
                </div>
              </div>

              <div className="w-px h-12 bg-[#2c2c2c] opacity-20" />

              <div className="text-center">
                <div className="font-playful text-4xl font-black text-[#2c2c2c]">
                  {todayStats.reviewed}
                </div>
                <div className="font-marker text-xs text-gray-500 uppercase tracking-wide mt-1">
                  hoy
                </div>
              </div>
            </div>

            {/* Completion message */}
            {isCompletedToday && (
              <div className="text-center space-y-1">
                <div className="text-4xl">🎉</div>
                <p className="font-indie text-sm text-gray-600">
                  completado hoy
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

function calculateStreak(activities) {
  if (!activities.length) return 0;

  const sortedActivities = [...activities]
    .filter(a => a.is_complete)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!sortedActivities.length) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedActivities.length; i++) {
    const activityDate = new Date(sortedActivities[i].date);
    activityDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - streak);

    if (activityDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
