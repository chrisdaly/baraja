import { useState } from 'react';
import { extractFlashcardsFromText, isClaudeConfigured } from '../lib/claude';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Flashcard from './Flashcard';

export default function AdminPage({ hideHeader = false, editingCard = null, onSaveEdit = null }) {
  console.log('🔧 AdminPage rendering', { editingCard });

  const [mode, setMode] = useState('manual'); // 'manual' or 'ai'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Manual entry state - populate with editing card if provided
  const [manualCard, setManualCard] = useState(() => {
    if (editingCard) {
      return {
        spanish: editingCard.spanish || '',
        english: editingCard.english || '',
        example1_es: editingCard.examples?.[0]?.spanish || '',
        example1_en: editingCard.examples?.[0]?.english || '',
        example2_es: editingCard.examples?.[1]?.spanish || '',
        example2_en: editingCard.examples?.[1]?.english || '',
        example3_es: editingCard.examples?.[2]?.spanish || '',
        example3_en: editingCard.examples?.[2]?.english || '',
      };
    }
    return {
      spanish: '',
      english: '',
      example1_es: '',
      example1_en: '',
      example2_es: '',
      example2_en: '',
      example3_es: '',
      example3_en: '',
    };
  });

  // AI extraction state
  const [spanishText, setSpanishText] = useState('');
  const [extractedCards, setExtractedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsToSave, setCardsToSave] = useState([]); // Cards user wants to keep
  const [isEditing, setIsEditing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardKey, setCardKey] = useState(0); // For card transition animation
  const [isTransitioning, setIsTransitioning] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!isSupabaseConfigured()) {
      showMessage('error', 'Supabase no está configurado');
      return;
    }

    setLoading(true);

    try {
      // Build examples array, filtering out empty ones
      const allExamples = [
        { spanish: manualCard.example1_es.trim(), english: manualCard.example1_en.trim() },
        { spanish: manualCard.example2_es.trim(), english: manualCard.example2_en.trim() },
        { spanish: manualCard.example3_es.trim(), english: manualCard.example3_en.trim() },
      ].filter(ex => ex.spanish || ex.english);

      const cardData = {
        spanish: manualCard.spanish.trim(),
        english: manualCard.english.trim(),
        examples: allExamples,
      };

      if (editingCard) {
        // Update existing card
        const { error } = await supabase
          .from('cards')
          .update(cardData)
          .eq('id', editingCard.id);

        if (error) throw error;

        showMessage('success', '¡Tarjeta actualizada exitosamente!');

        // Call callback to exit edit mode
        if (onSaveEdit) {
          onSaveEdit();
        }
      } else {
        // Insert new card
        const { error } = await supabase.from('cards').insert([cardData]);

        if (error) throw error;

        showMessage('success', '¡Tarjeta agregada exitosamente!');

        // Reset form
        setManualCard({
          spanish: '',
          english: '',
          example1_es: '',
          example1_en: '',
          example2_es: '',
          example2_en: '',
          example3_es: '',
          example3_en: '',
        });
      }
    } catch (error) {
      console.error('Error saving card:', error);
      showMessage('error', 'Error al guardar tarjeta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIExtract = async () => {
    if (!isClaudeConfigured()) {
      showMessage('error', 'Claude API no está configurado. Agrega VITE_ANTHROPIC_API_KEY a tu .env');
      return;
    }

    if (!spanishText.trim()) {
      showMessage('error', 'Por favor ingresa texto en español');
      return;
    }

    setLoading(true);
    setExtractedCards([]);
    setCurrentCardIndex(0);
    setCardsToSave([]);

    try {
      const cards = await extractFlashcardsFromText(spanishText);
      setExtractedCards(cards);
      showMessage('success', `¡${cards.length} tarjetas extraídas! Revisa cada una.`);
    } catch (error) {
      console.error('Error extracting cards:', error);
      showMessage('error', 'Error al extraer tarjetas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeepCard = async () => {
    const currentCard = extractedCards[currentCardIndex];
    setCardsToSave([...cardsToSave, currentCard]);

    // Reset flip state and start transition
    setIsFlipped(false);
    setIsTransitioning(true);

    // Small delay for fade out
    await new Promise(resolve => setTimeout(resolve, 150));

    if (currentCardIndex < extractedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardKey(prev => prev + 1);
      setIsTransitioning(false);
    } else {
      // Done reviewing all cards
      handleFinishReview();
    }
  };

  const handleSkipCard = async () => {
    // Reset flip state and start transition
    setIsFlipped(false);
    setIsTransitioning(true);

    // Small delay for fade out
    await new Promise(resolve => setTimeout(resolve, 150));

    if (currentCardIndex < extractedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardKey(prev => prev + 1);
      setIsTransitioning(false);
    } else {
      // Done reviewing all cards
      handleFinishReview();
    }
  };

  const handleUpdateCurrentCard = (updatedCard) => {
    const newCards = [...extractedCards];
    newCards[currentCardIndex] = updatedCard;
    setExtractedCards(newCards);
  };

  const handleFinishReview = () => {
    // Show summary or save
    if (cardsToSave.length === 0) {
      showMessage('error', 'No seleccionaste ninguna tarjeta');
      setExtractedCards([]);
      setCurrentCardIndex(0);
    }
  };

  const handleSaveExtractedCards = async () => {
    if (!isSupabaseConfigured()) {
      showMessage('error', 'Supabase no está configurado');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('cards').insert(cardsToSave);

      if (error) throw error;

      showMessage('success', `¡${cardsToSave.length} tarjetas guardadas!`);
      setExtractedCards([]);
      setCardsToSave([]);
      setSpanishText('');
      setCurrentCardIndex(0);
    } catch (error) {
      console.error('Error saving cards:', error);
      showMessage('error', 'Error al guardar tarjetas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setExtractedCards([]);
    setCardsToSave([]);
    setCurrentCardIndex(0);
  };

  const handleSpeak = () => {
    if (extractedCards[currentCardIndex]) {
      const text = extractedCards[currentCardIndex].spanish;
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.85;

        // Try to find a Spanish voice explicitly (mobile browsers need this)
        const voices = speechSynthesis.getVoices();
        const spanishVoice =
          voices.find((v) => v.lang === 'es-ES') ||
          voices.find((v) => v.lang === 'es-MX') ||
          voices.find((v) => v.lang.startsWith('es'));
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <>
        {/* Header */}
        {!hideHeader && (
          <div className="mb-6 pt-4">
            <h1 className="font-playful text-4xl font-black text-[#2c2c2c] mb-4">
              agregar tarjetas
            </h1>
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-lg font-marker font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
                mode === 'manual'
                  ? 'bg-spanish-yellow text-[#2c2c2c]'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              ✏️ manual
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 rounded-lg font-marker font-bold border-2 border-[#2c2c2c] transition-colors lowercase ${
                mode === 'ai'
                  ? 'bg-spanish-yellow text-[#2c2c2c]'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              ✨ ai extraction
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg border-2 border-[#2c2c2c] font-indie ${
              message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Manual Mode */}
        {mode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="bg-white/90 p-6 rounded-xl border-2 border-[#2c2c2c]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-marker font-bold text-sm text-gray-700 block mb-1">
                    Español
                  </label>
                  <input
                    type="text"
                    required
                    value={manualCard.spanish}
                    onChange={(e) => setManualCard({ ...manualCard, spanish: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie"
                    placeholder="hacer puente"
                  />
                </div>
                <div>
                  <label className="font-marker font-bold text-sm text-gray-700 block mb-1">
                    English
                  </label>
                  <input
                    type="text"
                    required
                    value={manualCard.english}
                    onChange={(e) => setManualCard({ ...manualCard, english: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie"
                    placeholder="to take a long weekend"
                  />
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4">
                <h3 className="font-marker font-bold text-sm text-gray-700 mb-3">Ejemplos <span className="font-indie font-normal text-gray-400">(opcional)</span></h3>

                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={manualCard[`example${num}_es`]}
                      onChange={(e) =>
                        setManualCard({ ...manualCard, [`example${num}_es`]: e.target.value })
                      }
                      className="px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie text-sm"
                      placeholder={`Ejemplo ${num} en español`}
                    />
                    <input
                      type="text"
                      value={manualCard[`example${num}_en`]}
                      onChange={(e) =>
                        setManualCard({ ...manualCard, [`example${num}_en`]: e.target.value })
                      }
                      className="px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie text-sm"
                      placeholder={`Example ${num} in English`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-spanish-yellow border-2 border-[#2c2c2c] rounded-lg font-marker font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed lowercase"
              >
                {loading ? 'guardando...' : (editingCard ? '💾 actualizar tarjeta' : '➕ agregar tarjeta')}
              </button>
            </div>
          </form>
        )}

        {/* AI Extraction Mode */}
        {mode === 'ai' && (
          <>
            {/* Input view - only show when no extracted cards */}
            {extractedCards.length === 0 && (
              <div className="bg-white/90 p-6 rounded-xl border-[3px] border-[#2c2c2c] shadow-[0_4px_0_#2c2c2c] relative overflow-hidden">
                <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

                <div className="relative z-10">
                  <label className="font-playful text-xl font-black text-[#2c2c2c] block mb-2">
                    pega texto en español
                  </label>
                  <p className="font-indie text-xs text-gray-600 mb-3">
                    tiktok, artículo, conversación, etc.
                  </p>
                  <textarea
                    value={spanishText}
                    onChange={(e) => setSpanishText(e.target.value)}
                    className="w-full h-40 px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie resize-none bg-white/80"
                    placeholder="Cuando le pregunto si prefiere culo o tetas, y me dice que una mujer que le de paz y tranquilidad..."
                  />

                  <button
                    onClick={handleAIExtract}
                    disabled={loading || !spanishText.trim()}
                    className="w-full mt-3 p-3 bg-spanish-red text-white border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
                  >
                    {loading ? 'extrayendo...' : 'extraer frases'}
                  </button>
                </div>
              </div>
            )}

            {/* Card-by-Card Review Journey */}
            {extractedCards.length > 0 && cardsToSave.length < extractedCards.length && (
              <div className="space-y-4">
                {/* Progress indicator */}
                <div className="bg-white/90 p-4 rounded-xl border-[3px] border-[#2c2c2c] shadow-[0_4px_0_#2c2c2c] relative overflow-hidden">
                  <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-marker text-xs font-bold text-gray-600 uppercase tracking-wide">
                        tarjeta {currentCardIndex + 1} de {extractedCards.length}
                      </span>
                      <span className="font-indie text-xs text-gray-600">
                        {cardsToSave.length} guardadas
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden border-2 border-[#2c2c2c]">
                      <div
                        className="h-full bg-spanish-yellow transition-all duration-300"
                        style={{ width: `${((currentCardIndex + 1) / extractedCards.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Current card - show actual flashcard or edit mode */}
                {isEditing ? (
                  <EditCardForm
                    card={extractedCards[currentCardIndex]}
                    onUpdate={handleUpdateCurrentCard}
                    onDone={() => setIsEditing(false)}
                  />
                ) : (
                  <div
                    key={cardKey}
                    className={isTransitioning ? 'opacity-0 transition-opacity duration-150' : 'animate-slideInFromRight'}
                  >
                    <Flashcard
                      spanish={extractedCards[currentCardIndex].spanish}
                      english={extractedCards[currentCardIndex].english}
                      examples={extractedCards[currentCardIndex].examples}
                      suitSymbol="✨"
                      isFlipped={isFlipped}
                      onFlip={setIsFlipped}
                      onSpeak={handleSpeak}
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleSkipCard}
                      className="flex-1 p-3 bg-white/90 border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-sm hover:bg-gray-100 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
                    >
                      ⏭️ saltar
                    </button>
                    <button
                      onClick={handleKeepCard}
                      className="flex-1 p-3 bg-[rgba(107,207,127,0.95)] border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-lg hover:bg-green-500 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
                    >
                      ✓ guardar
                    </button>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full p-2 bg-spanish-yellow border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-xs hover:bg-yellow-400 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
                  >
                    ✏️ {isEditing ? 'ver tarjeta' : 'editar'}
                  </button>

                  {/* Cancel button */}
                  <button
                    onClick={handleStartOver}
                    className="w-full mt-1 p-2 font-indie text-xs text-gray-500 hover:text-gray-700 underline lowercase"
                  >
                    cancelar todo
                  </button>
                </div>
              </div>
            )}

            {/* Summary and Save */}
            {extractedCards.length > 0 && cardsToSave.length === extractedCards.length && (
              <div className="bg-white/90 p-6 rounded-xl border-[3px] border-[#2c2c2c] shadow-[0_4px_0_#2c2c2c] relative overflow-hidden">
                <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-3">🎉</div>
                  <h3 className="font-playful text-3xl font-black text-[#2c2c2c] mb-2">
                    ¡listo!
                  </h3>
                  <p className="font-indie text-base text-gray-600 mb-6">
                    seleccionaste {cardsToSave.length} {cardsToSave.length === 1 ? 'tarjeta' : 'tarjetas'}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStartOver}
                      className="flex-1 p-3 bg-white/90 border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-sm hover:bg-gray-100 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
                    >
                      ❌ descartar
                    </button>
                    <button
                      onClick={handleSaveExtractedCards}
                      disabled={loading}
                      className="flex-1 p-3 bg-[rgba(107,207,127,0.95)] border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-lg hover:bg-green-500 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
                    >
                      {loading ? 'guardando...' : `💾 guardar`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
    </>
  );
}

// Simple edit form for quick edits
function EditCardForm({ card, onUpdate, onDone }) {
  const [editedCard, setEditedCard] = useState(card);

  const handleUpdate = (field, value) => {
    const updated = { ...editedCard, [field]: value };
    setEditedCard(updated);
    onUpdate(updated);
  };

  const handleExampleUpdate = (index, field, value) => {
    const updated = { ...editedCard };
    updated.examples[index][field] = value;
    setEditedCard(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-gradient-to-br from-[rgba(255,245,230,0.97)] to-[rgba(255,232,204,0.97)] backdrop-blur-[10px] border-[3px] border-[#2c2c2c] rounded-xl shadow-[0_4px_0_#2c2c2c] overflow-hidden relative h-[420px] sm:h-[460px] overflow-y-auto">
      <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 p-5">
        {/* Spanish/English fields */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="font-marker text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
              español
            </label>
            <input
              type="text"
              value={editedCard.spanish}
              onChange={(e) => handleUpdate('spanish', e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-[#2c2c2c] rounded-lg font-handwritten text-2xl font-bold text-spanish-red bg-white/80 lowercase"
              placeholder="hacer puente"
            />
          </div>

          <div>
            <label className="font-marker text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
              english
            </label>
            <input
              type="text"
              value={editedCard.english}
              onChange={(e) => handleUpdate('english', e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-[#2c2c2c] rounded-lg font-handwritten text-xl text-gray-700 bg-white/80 lowercase"
              placeholder="to take a long weekend"
            />
          </div>
        </div>

        {/* Examples section */}
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="font-marker text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-3">
            ejemplos
          </div>

          <div className="space-y-3">
            {editedCard.examples.map((example, i) => (
              <div key={i} className="bg-white/90 p-3 rounded-lg border-2 border-[#2c2c2c]">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={example.spanish}
                    onChange={(e) => handleExampleUpdate(i, 'spanish', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#2c2c2c] rounded font-indie text-sm bg-white"
                    placeholder={`Ejemplo ${i + 1} ES`}
                  />
                  <input
                    type="text"
                    value={example.english}
                    onChange={(e) => handleExampleUpdate(i, 'english', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#2c2c2c] rounded font-indie text-xs text-gray-600 bg-white"
                    placeholder={`Example ${i + 1} EN`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
