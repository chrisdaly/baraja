export default function Background() {
  return (
    <>
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/background.webp)',
        }}
      />
      {/* Overlay to ensure readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[rgba(255,248,231,0.7)] via-[rgba(255,248,231,0.75)] to-[rgba(255,240,210,0.8)] z-0" />
    </>
  );
}
