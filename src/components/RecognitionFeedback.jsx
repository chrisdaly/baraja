export default function RecognitionFeedback({ show, icon, text, heard }) {
  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/98 backdrop-blur-[10px] p-9 rounded-[20px] shadow-[0_6px_0_#2c2c2c,0_10px_40px_rgba(0,0,0,0.3)] z-[1000] text-center border-4 border-[#2c2c2c] max-w-[320px] animate-[fadeInScale_0.3s_ease-out]">
      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none rounded-2xl" />

      <div className="text-[56px] mb-4 relative z-10">{icon}</div>
      <div className="font-playful text-2xl font-extrabold text-[#2c2c2c] mb-3 tracking-wide relative z-10">
        {text}
      </div>
      <div className="font-indie text-base text-gray-600 font-semibold relative z-10">{heard}</div>
    </div>
  );
}
