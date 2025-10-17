export default function ProgressBar({ progress }) {
  return (
    <div className="bg-white/70 backdrop-blur-[10px] p-2 sm:p-2.5 rounded-lg sm:rounded-xl mb-2 sm:mb-3 border-2 border-[#2c2c2c] shadow-[0_2px_0_#2c2c2c] relative overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none rounded-[8px]" />

      <div className="font-marker text-[9px] sm:text-[10px] text-gray-500 font-bold mb-1.5 tracking-wide relative z-10">
        tu progreso hoy
      </div>

      <div className="h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden border-2 border-[#2c2c2c] relative z-10">
        <div
          className="h-full bg-[#ffc400] rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
