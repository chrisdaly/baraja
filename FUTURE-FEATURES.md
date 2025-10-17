# Future Features for Baraja

## Speaking Practice Section
A dedicated practice mode focused on pronunciation and speaking fluency.

**Ideas:**
- Collection of sentences to read aloud
- Speech recognition to check pronunciation accuracy
- Progressive difficulty (short phrases → full sentences → paragraphs)
- Record and playback your pronunciation
- Daily speaking challenges

**User Story:** "I want to practice speaking full Spanish sentences out loud and get feedback on my pronunciation"

## Sentence Builder
Interactive exercises where you construct sentences using vocabulary from your learned cards.

**Ideas:**
- Drag-and-drop word tiles to build sentences
- English prompt → construct Spanish sentence
- Uses only vocabulary from cards you've already learned
- Progressive complexity (3 words → 5 words → 10+ words)
- Checks grammar and word order
- Hints system (show first word, show verb, etc.)
- Real-time validation with helpful error messages

**User Story:** "I know individual words but struggle to put them together into sentences. I want guided practice building complete sentences."

**Example Flow:**
```
Prompt: "I want to eat"
Cards available: [quiero, comer, necesito, ver, hoy, mañana]
Correct: "quiero comer"
```

## Language Transfer Integration
Inspired by the Language Transfer method - focus on understanding and thinking in Spanish, not just memorization.

**Language Transfer Philosophy:**
- Understanding over memorization
- Building sentences from first principles
- Recognizing patterns and connections
- Active thinking (not passive repetition)
- Using what you already know to learn new things

**Potential Features:**
1. **Pattern Recognition Cards**
   - Teach grammar patterns, not just vocabulary
   - Example: "If it ends in -ción in Spanish, it's -tion in English (acción → action)"
   - Show connections between related words

2. **Thinking-Based Exercises**
   - "How would you say ___ in Spanish? Think about it before revealing the answer"
   - Pause-and-think prompts (like Language Transfer audio pauses)
   - Encourage building sentences from understanding, not memory

3. **Progressive Building**
   - Start with simple patterns
   - Build complexity using previously learned patterns
   - Example flow:
     - Learn: "quiero" (I want)
     - Learn: "comer" (to eat)
     - Combine: "quiero comer" (I want to eat)
     - Add: "quiero comer mañana" (I want to eat tomorrow)

4. **Explanation Cards**
   - Not just vocab, but WHY things work
   - Example: "Why do we say 'me gusta' not 'yo gusto'? Because it literally means 'it pleases me'"
   - Grammar insights as flashcards

5. **Cognate Recognition**
   - Highlight Spanish/English cognates
   - Pattern cards for common transformations
   - Example: -dad → -ty (universidad → university)

## Implementation Notes

### Speaking Section
- Could reuse existing speech recognition hook
- Add new view in NavigationBar: 🗣️ "hablar"
- Create `SpeakingPractice.jsx` component
- Needs curated sentence database (start with example sentences from existing cards)

### Sentence Builder
- New game-like component
- Could use cards table as source vocabulary
- Track "sentence mastery" separately from card reviews
- Gamification: unlock harder sentences as you progress

### Language Transfer Approach
- Extend cards schema to support "pattern" type cards (not just vocab)
- Add "explanation" field to cards
- Tag cards with related_to (connect related words/patterns)
- Create "thinking mode" - pause before showing answer
- Add difficulty progression system

## Priority
1. **Phase 1 (MVP+):** Speaking Section - builds on existing features
2. **Phase 2:** Sentence Builder - new gameplay, high engagement
3. **Phase 3:** Language Transfer Integration - rework learning philosophy

## User Research
- Main education source: Language Transfer app
- Learning style: Understanding patterns over rote memorization
- Pain point: Knows words individually but struggles with sentence construction
- Preference: Active recall and thinking, not passive review

## Technical Considerations
- Speech recognition already implemented (`useSpeechRecognition.js`)
- Database supports JSON fields (could store sentence structures)
- Could add new tables: `sentences`, `patterns`, `sentence_progress`
- Maintain current SRS for vocabulary, add separate progression for sentences

## References
- Language Transfer Spanish course methodology
- Duolingo sentence construction exercises (for UI inspiration)
- Anki sentence mining (for content ideas)
