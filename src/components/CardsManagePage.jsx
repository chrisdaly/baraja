import { useState } from 'react';
import CardsPage from './CardsPage';
import AdminPage from './AdminPage';

export default function CardsManagePage({ cards, onCardsUpdate, onViewCard }) {
  const [tab, setTab] = useState('view'); // 'view' or 'create'
  const [editingCard, setEditingCard] = useState(null);

  const handleEditCard = (card) => {
    setEditingCard(card);
    setTab('create'); // Switch to create tab to show the form
  };

  const handleSaveEdit = () => {
    setEditingCard(null);
    setTab('view'); // Go back to view after saving
    onCardsUpdate?.(); // Refresh cards
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative z-10">

        {/* Header with tabs */}
        <div className="mb-6 pt-4">
          <h1 className="font-playful text-4xl sm:text-5xl font-black text-[#2c2c2c] mb-4">
            {editingCard ? 'editar tarjeta' : 'tarjetas'}
          </h1>

          {!editingCard && (
            <div className="flex gap-2">
              <button
                onClick={() => setTab('view')}
                className={`px-4 py-2 rounded-lg font-marker font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
                  tab === 'view'
                    ? 'bg-spanish-yellow text-[#2c2c2c]'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                📚 ver
              </button>
              <button
                onClick={() => setTab('create')}
                className={`px-4 py-2 rounded-lg font-marker font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
                  tab === 'create'
                    ? 'bg-spanish-yellow text-[#2c2c2c]'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                ➕ crear
              </button>
            </div>
          )}

          {editingCard && (
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg font-marker font-bold border-2 border-[#2c2c2c] bg-white/80 text-gray-600 hover:bg-white transition-colors lowercase"
            >
              ← cancelar
            </button>
          )}
        </div>

        {/* Content based on tab */}
        {tab === 'view' ? (
          <CardsPage
            cards={cards}
            onCardsUpdate={onCardsUpdate}
            onViewCard={onViewCard}
            onEditCard={handleEditCard}
            hideHeader
          />
        ) : (
          <AdminPage
            hideHeader
            editingCard={editingCard}
            onSaveEdit={handleSaveEdit}
          />
        )}

    </div>
  );
}
