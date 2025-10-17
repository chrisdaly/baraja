export default function StatsBar({ todayCount, streak, totalCards }) {
  return (
    <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3">
      <StatBox label="hoy" value={todayCount} />
      <StatBox label="racha" value={streak} icon="🔥" />
      <StatBox label="total" value={totalCards} />
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="flex-1 bg-white/80 backdrop-blur-[10px] p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center border-2 border-[#2c2c2c] shadow-[0_2px_0_#2c2c2c] relative overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none rounded-[8px]" />

      <div className="font-marker text-[9px] sm:text-[10px] text-gray-500 font-bold mb-0.5 uppercase tracking-wide relative z-10">
        {label}
      </div>
      <div className="font-playful text-base sm:text-lg md:text-xl font-black text-[#2c2c2c] relative z-10 flex items-center justify-center gap-1">
        {icon && <span className="text-sm sm:text-base">{icon}</span>}
        <span>{value}</span>
      </div>
    </div>
  );
}
