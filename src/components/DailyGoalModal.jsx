export default function DailyGoalModal({ show, onContinue, onGoHome }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-[10px] p-6 sm:p-8 rounded-2xl border-[3px] border-[#2c2c2c] shadow-[0_8px_0_#2c2c2c] relative overflow-hidden max-w-md w-full animate-scaleIn">
        {/* Noise texture */}
        <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 text-center space-y-4">
          {/* Trophy animation */}
          <div className="text-7xl animate-bounce">
            🏆
          </div>

          {/* Congratulations text */}
          <div>
            <h2 className="font-playful text-3xl sm:text-4xl font-black text-[#2c2c2c] mb-2">
              ¡meta alcanzada!
            </h2>
            <p className="font-indie text-base sm:text-lg text-gray-700">
              Has completado tu meta de hoy: <span className="font-bold text-spanish-red">10 tarjetas</span>
            </p>
          </div>

          {/* Spanish flag celebration */}
          <div className="flex justify-center gap-1 my-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm animate-pulse"
                style={{
                  backgroundColor: i % 2 === 0 ? '#c60b1e' : '#ffc400',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Motivational message */}
          <p className="font-indie text-sm text-gray-600 italic">
            ¡Sigue practicando si quieres! 🔥
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:gap-3 pt-2">
            <button
              onClick={onContinue}
              className="w-full p-3 sm:p-4 border-[3px] border-[#2c2c2c] rounded-xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide overflow-hidden backdrop-blur-[10px] font-marker bg-[rgba(107,207,127,0.95)] text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center gap-2 text-base"
            >
              <span className="text-xl">🔄</span>
              continuar practicando
            </button>

            <button
              onClick={onGoHome}
              className="w-full p-3 sm:p-4 border-[3px] border-[#2c2c2c] rounded-xl font-extrabold cursor-pointer transition-transform lowercase tracking-wide overflow-hidden backdrop-blur-[10px] font-marker bg-white/95 text-[#2c2c2c] shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] flex items-center justify-center gap-2"
            >
              <span className="text-xl">🏠</span>
              volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
