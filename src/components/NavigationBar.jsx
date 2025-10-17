import { Home, BookOpen, Library } from 'lucide-react';

export default function NavigationBar({ currentView, onNavigate }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'inicio' },
    { id: 'cards', icon: Library, label: 'tarjetas' },
    { id: 'practice', icon: BookOpen, label: 'practicar' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[10px] border-t-[3px] border-[#2c2c2c] shadow-[0_-4px_0_#2c2c2c]">
      <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-2 flex gap-2 relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg font-marker font-bold lowercase transition-colors ${
                isActive
                  ? 'bg-spanish-yellow text-[#2c2c2c] border-[3px] border-[#2c2c2c] shadow-[0_2px_0_#2c2c2c]'
                  : 'bg-transparent text-gray-500 border-2 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
              <span className={`text-sm tracking-wide whitespace-nowrap transition-all overflow-hidden ${
                isActive ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
