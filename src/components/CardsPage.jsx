import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function CardsPage({ cards, onCardsUpdate, onViewCard, onEditCard, hideHeader = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 20;

  // Filter cards based on search
  const filteredCards = cards.filter(card =>
    card.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort cards
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'alphabetical') {
      return a.spanish.localeCompare(b.spanish);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedCards = sortedCards.slice(startIndex, startIndex + CARDS_PER_PAGE);

  console.log('📊 Cards Debug:', {
    totalCards: cards.length,
    filteredCards: filteredCards.length,
    sortedCards: sortedCards.length,
    currentPage,
    totalPages,
    paginatedCardsCount: paginatedCards.length,
  });

  // Reset to page 1 when search or sort changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleDelete = async (cardId) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      setDeleteConfirm(null);
      onCardsUpdate?.();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error al eliminar tarjeta: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {!hideHeader && (
        <div className="mb-6 pt-4">
          <h1 className="font-playful text-4xl sm:text-5xl font-black text-[#2c2c2c] mb-2">
            mis tarjetas
          </h1>
          <p className="font-indie text-sm text-gray-600">
            {cards.length} {cards.length === 1 ? 'tarjeta' : 'tarjetas'} en total
          </p>
        </div>
      )}

      {/* Search and Sort */}
      <div className="mb-4 space-y-3">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="buscar tarjetas..."
            className="w-full px-4 py-3 border-[3px] border-[#2c2c2c] rounded-xl font-indie bg-white/95 shadow-[0_3px_0_#2c2c2c] focus:outline-none focus:ring-2 focus:ring-spanish-yellow lowercase"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('newest')}
            className={`px-3 py-2 rounded-lg font-marker text-xs font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
              sortBy === 'newest' ? 'bg-spanish-yellow' : 'bg-white/80 hover:bg-white'
            }`}
          >
            más reciente
          </button>
          <button
            onClick={() => handleSortChange('oldest')}
            className={`px-3 py-2 rounded-lg font-marker text-xs font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
              sortBy === 'oldest' ? 'bg-spanish-yellow' : 'bg-white/80 hover:bg-white'
            }`}
          >
            más antigua
          </button>
          <button
            onClick={() => handleSortChange('alphabetical')}
            className={`px-3 py-2 rounded-lg font-marker text-xs font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
              sortBy === 'alphabetical' ? 'bg-spanish-yellow' : 'bg-white/80 hover:bg-white'
            }`}
          >
            a-z
          </button>
        </div>
      </div>

      {/* Simple Table View */}
      {sortedCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-indie text-gray-500">
            {searchQuery ? 'no se encontraron tarjetas' : 'no hay tarjetas todavía'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white/95 border-[3px] border-[#2c2c2c] rounded-xl shadow-[0_3px_0_#2c2c2c] overflow-hidden relative">
            <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

            {/* Table */}
            <div className="overflow-x-auto relative z-10">
              <table className="w-full">
                <thead className="bg-spanish-yellow/30 border-b-2 border-[#2c2c2c]">
                  <tr>
                    <th className="px-4 py-3 text-left font-marker text-xs font-bold uppercase tracking-wide">
                      Español
                    </th>
                    <th className="px-4 py-3 text-left font-marker text-xs font-bold uppercase tracking-wide hidden sm:table-cell">
                      English
                    </th>
                    <th className="px-4 py-3 text-left font-marker text-xs font-bold uppercase tracking-wide hidden md:table-cell">
                      Creado
                    </th>
                    <th className="px-4 py-3 text-right font-marker text-xs font-bold uppercase tracking-wide">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCards.map((card, index) => (
                    <tr
                      key={card.id}
                      onClick={() => onViewCard?.(card.id)}
                      className={`border-b border-gray-200 hover:bg-spanish-yellow/10 transition-colors cursor-pointer ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-white/30'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-handwritten text-lg font-bold text-spanish-red lowercase">
                          {card.spanish}
                        </div>
                        {/* Show English on mobile */}
                        <div className="font-indie text-sm text-gray-600 lowercase sm:hidden">
                          {card.english}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="font-indie text-sm text-gray-700 lowercase">
                          {card.english}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="font-indie text-xs text-gray-500">
                          {formatDate(card.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditCard?.(card);
                            }}
                            className="px-2 py-1 rounded font-marker text-xs font-bold border border-[#2c2c2c] bg-white hover:bg-spanish-yellow transition-colors"
                            title="editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deleteConfirm === card.id) {
                                handleDelete(card.id);
                              } else {
                                setDeleteConfirm(card.id);
                                setTimeout(() => setDeleteConfirm(null), 3000);
                              }
                            }}
                            className={`px-2 py-1 rounded font-marker text-xs font-bold border border-[#2c2c2c] transition-colors ${
                              deleteConfirm === card.id
                                ? 'bg-spanish-red text-white'
                                : 'bg-white hover:bg-red-50'
                            }`}
                            title="eliminar"
                          >
                            {deleteConfirm === card.id ? '?' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border-[3px] border-[#2c2c2c] rounded-lg font-marker font-bold text-sm bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ←
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  // Show first 3, last 3, and current page +/- 1
                  const pageNum = i + 1;
                  const showPage = pageNum <= 3 ||
                                   pageNum > totalPages - 3 ||
                                   Math.abs(pageNum - currentPage) <= 1;

                  if (!showPage && (pageNum === 4 || pageNum === totalPages - 3)) {
                    return <span key={pageNum} className="px-2">...</span>;
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 border-[3px] border-[#2c2c2c] rounded-lg font-marker font-bold text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-spanish-yellow'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border-[3px] border-[#2c2c2c] rounded-lg font-marker font-bold text-sm bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      <p className="mt-4 mb-8 text-center font-indie text-xs text-gray-500">
        mostrando {paginatedCards.length} de {sortedCards.length} {sortedCards.length === 1 ? 'tarjeta' : 'tarjetas'}
        {searchQuery && ` (filtrado de ${cards.length} total)`}
      </p>
    </>
  );
}
