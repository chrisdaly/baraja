export default function DemoBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#2c2c2c] text-white py-1.5 px-4 text-center">
      <span className="font-indie text-xs tracking-wide">
        demo mode{' '}
        <a
          href="https://github.com/chrisdaly/baraja"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-spanish-yellow transition-colors"
        >
          view source on github
        </a>
      </span>
    </div>
  );
}
