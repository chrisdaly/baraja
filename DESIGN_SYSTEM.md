# Baraja Design System

A comprehensive guide to the visual language, navigation, and component patterns for the Baraja Spanish learning app.

---

## Table of Contents
- [Information Architecture](#information-architecture)
- [Navigation System](#navigation-system)
- [Color System](#color-system)
- [Typography](#typography)
- [Iconography](#iconography)
- [Component Patterns](#component-patterns)
- [Spacing & Layout](#spacing--layout)

---

## Information Architecture

### App Structure

```
baraja/
├── 🏠 home (HomeScreen)
│   ├── Activity calendar
│   ├── Daily stats
│   └── Navigation to other views
│
├── 📚 practice (Practice view)
│   ├── SRS flashcard review
│   ├── Text-to-speech
│   └── Speech recognition
│
├── ➕ add cards (AdminPage)
│   ├── Manual entry
│   └── AI extraction
│
└── 📊 stats (Future)
    ├── Progress charts
    ├── Learning analytics
    └── Achievements
```

### Proposed Main Navigation

**Bottom Tab Bar** (3 primary views):
```
┌─────────────────────────────────┐
│                                 │
│         CONTENT AREA            │
│                                 │
├─────────────────────────────────┤
│  🏠 home  │  📚 practice │  ➕ add  │
└─────────────────────────────────┘
```

**Icons & Labels:**
- **Home**: 🏠 "inicio" - Dashboard with calendar and stats
- **Practice**: 📚 "practicar" - SRS flashcard review
- **Add Cards**: ➕ "agregar" - Manual or AI card creation

---

## Navigation System

### Primary Navigation
**Component**: Bottom tab bar (sticky)
- 3 main sections: home, practice, add
- Always visible (except during flashcard review)
- Active state: Spanish yellow background
- Inactive state: White/transparent background

### Secondary Navigation
- **Back buttons**: Top-left ← arrow during flows
- **Modal flows**: Full-screen overlays with X close button
- **Progressive disclosure**: Stepper flows for multi-step tasks

### Navigation Hierarchy
```
Level 1: Bottom tabs (global)
Level 2: Page headers with back button
Level 3: Modal overlays
Level 4: Inline expansion (accordions, dropdowns)
```

---

## Color System

### Primary Colors
```css
/* Spanish Flag */
--spanish-red:    #c60b1e   /* Primary actions, highlights */
--spanish-yellow: #ffc400   /* Active states, CTAs */

/* Wood & Paper */
--wood-brown:     #5c2e0f   /* Borders, shadows */
--paper-cream:    #fffaf0   /* Backgrounds, cards */
--paper-beige:    #ffe8b5   /* Page backgrounds */
```

### Semantic Colors
```css
/* Status */
--success-green:  rgba(107, 207, 127, 0.95)  /* Correct, keep, save */
--error-red:      rgba(255, 139, 148, 0.95)  /* Wrong, delete, skip */
--warning-yellow: rgba(255, 214, 109, 0.95)  /* Caution, edit */
--info-blue:      rgba(135, 206, 250, 0.95)  /* Easy, info */

/* Neutrals */
--dark-text:      #2c2c2c   /* Primary text */
--gray-600:       #4b5563   /* Secondary text */
--gray-400:       #9ca3af   /* Disabled, hints */
--white:          #ffffff   /* Backgrounds */
```

### Usage Guidelines

**Buttons:**
- Primary action (save, continue): Green or Spanish yellow
- Destructive action (delete, skip): Red
- Secondary action (edit, cancel): White with dark border
- Info/neutral: Blue

**Backgrounds:**
- Page: `#ffe8b5` (beige)
- Cards: `rgba(255, 250, 240, 0.97)` (cream with transparency)
- Overlays: `rgba(255, 255, 255, 0.9)` (white with transparency)

**Borders:**
- All interactive elements: `#2c2c2c` (dark brown)
- Width: 2-3px for most, 4px for emphasis
- Style: Solid, rounded corners (8-16px)

---

## Typography

### Font Families

```css
/* Headings - Playful, Bold */
font-family: 'Fredoka One', cursive;
/* Usage: App title, section headers, celebration text */

/* Display - Handwritten */
font-family: 'Caveat', cursive;
/* Usage: Spanish/English on flashcards, main content */

/* Labels - Uppercase, Bold */
font-family: 'Permanent Marker', cursive;
/* Usage: Buttons, small labels, stats */

/* Body - Readable */
font-family: 'Indie Flower', cursive;
/* Usage: Examples, hints, secondary text */
```

### Type Scale

```css
/* Headings */
.text-hero:    4xl (36px) font-playful     /* App title */
.text-h1:      3xl (30px) font-playful     /* Page headers */
.text-h2:      2xl (24px) font-handwritten /* Card front */
.text-h3:      xl  (20px) font-handwritten /* Card back */

/* Body */
.text-large:   lg  (18px) font-indie       /* Primary content */
.text-base:    base(16px) font-indie       /* Default */
.text-small:   sm  (14px) font-indie       /* Secondary */
.text-tiny:    xs  (12px) font-marker      /* Labels */
```

### Text Styles

**Always:**
- Spanish text: lowercase
- Button text: lowercase
- Labels: UPPERCASE (font-marker)
- English translations: lowercase

**Font weights:**
- Headings: black (900)
- Buttons: bold (700)
- Body: normal (400)

---

## Iconography

### Icon System
**Use Lucide React icons** - Consistent, clean, professional SVG icons

**Package**: `lucide-react`
```bash
npm install lucide-react
```

### Standard Icons

**Navigation (Bottom Tabs):**
```jsx
import { Home, BookOpen, Plus } from 'lucide-react';

Home      - Home/dashboard (inicio)
BookOpen  - Practice/study (practicar)
Plus      - Add cards (agregar)
```

**Future Navigation:**
```jsx
import { BarChart3, Settings } from 'lucide-react';

BarChart3 - Stats/progress
Settings  - Settings/config
```

**In-App Icons (Emojis - for playful touch):**
```
🎉 success       - Goal reached
💪 try again     - Encouragement
😕 error         - Something wrong
✨ ai/magic      - AI features
🔊 speak         - Text-to-speech
🎤 record        - Speech recognition
```

### Icon Usage Guidelines

**Lucide Icons (Navigation, Actions):**
```jsx
<Icon size={20} strokeWidth={2.5} />  // Navigation
<Icon size={16} strokeWidth={2} />    // Inline
```

**Styling:**
1. **Size**: 20px for nav tabs, 16-18px for buttons
2. **Stroke Width**: 2.5 for emphasis, 2 for normal
3. **Color**: Inherit from parent text color
4. **Spacing**: 4-8px gap between icon and text

**Emojis (Feedback, Card Features):**
- Use for emotional/playful feedback only
- Size: 1.5-2rem
- Don't mix Lucide and emoji in same component

---

## Component Patterns

### Buttons

**Primary Button** (CTA, save, continue):
```jsx
className="w-full p-3 bg-[rgba(107,207,127,0.95)] border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-lg hover:bg-green-500 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
```

**Secondary Button** (cancel, back):
```jsx
className="p-3 bg-white/90 border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-sm hover:bg-gray-100 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
```

**Destructive Button** (delete, skip):
```jsx
className="p-3 bg-[rgba(255,139,148,0.95)] border-[3px] border-[#2c2c2c] rounded-xl font-marker font-bold text-sm hover:bg-red-400 transition-transform shadow-[0_3px_0_#2c2c2c] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2c2c2c] active:translate-y-0.5 active:shadow-[0_2px_0_#2c2c2c] lowercase"
```

**Tab Button** (navigation):
```jsx
className={`flex-1 p-3 rounded-xl font-marker font-bold lowercase transition-colors ${
  isActive
    ? 'bg-spanish-yellow text-[#2c2c2c] border-[3px] border-[#2c2c2c]'
    : 'bg-white/80 text-gray-600 border-2 border-transparent hover:bg-white'
}`}
```

### Cards

**Content Card** (white background):
```jsx
<div className="bg-white/90 p-6 rounded-xl border-[3px] border-[#2c2c2c] shadow-[0_4px_0_#2c2c2c] relative overflow-hidden">
  <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

**Flashcard** (paper texture, gradients):
```jsx
<div className="bg-gradient-to-br from-[rgba(255,245,230,0.97)] to-[rgba(255,232,204,0.97)] backdrop-blur-[10px] border-[3px] border-[#2c2c2c] rounded-xl shadow-[0_4px_0_#2c2c2c] overflow-hidden relative h-[420px]">
  <div className="absolute inset-0 noise-texture opacity-[0.08] pointer-events-none" />
  {/* Corners */}
  {/* Content */}
</div>
```

### Inputs

**Text Input**:
```jsx
<input
  className="w-full px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie bg-white/80"
  placeholder="hacer puente"
/>
```

**Textarea**:
```jsx
<textarea
  className="w-full h-40 px-3 py-2 border-2 border-[#2c2c2c] rounded-lg font-indie resize-none bg-white/80"
  placeholder="Pega texto aquí..."
/>
```

### Progress Indicators

**Progress Bar**:
```jsx
<div className="h-2 bg-gray-200 rounded-full overflow-hidden border-2 border-[#2c2c2c]">
  <div
    className="h-full bg-spanish-yellow transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

**Stat Box**:
```jsx
<div className="bg-white/80 p-3 rounded-xl border-2 border-[#2c2c2c] shadow-[0_2px_0_#2c2c2c] relative overflow-hidden">
  <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />
  <div className="font-marker text-xs text-gray-500 uppercase mb-1">label</div>
  <div className="font-playful text-2xl font-black text-[#2c2c2c]">value</div>
</div>
```

---

## Spacing & Layout

### Spacing Scale
```css
/* Based on Tailwind defaults */
0.5 = 2px   (0.125rem)
1   = 4px   (0.25rem)
2   = 8px   (0.5rem)
3   = 12px  (0.75rem)
4   = 16px  (1rem)
6   = 24px  (1.5rem)
8   = 32px  (2rem)
```

### Common Patterns

**Page Container**:
```jsx
<div className="min-h-screen overflow-auto bg-[#ffe8b5] p-4">
  <div className="max-w-4xl mx-auto">
    {/* Content */}
  </div>
</div>
```

**Section Spacing**:
- Between sections: `mb-6` (24px)
- Between cards in stack: `space-y-4` (16px)
- Inside cards: `p-5` or `p-6` (20-24px)

**Component Gaps**:
- Button groups: `gap-2` (8px)
- Form fields: `space-y-3` (12px)
- Icons to text: `gap-1` or `gap-2` (4-8px)

### Responsive Breakpoints
```css
sm:  640px   /* Tablets */
md:  768px   /* Small laptops */
lg:  1024px  /* Desktops (rarely used) */
```

**Mobile-first approach:**
- Default: Mobile (320-640px)
- `sm:` prefix for tablet and up
- Max width: 420px for main content

---

## Animation & Transitions

### Standard Transitions
```css
/* Buttons */
transition-transform    /* For hover lift */
duration-200           /* Fast interactions */

/* Content */
transition-all         /* For smooth state changes */
duration-300          /* Standard speed */

/* Page transitions */
duration-500          /* Slower, more dramatic */
```

### Hover States
- Buttons lift: `-translate-y-0.5` + shadow increase
- Cards lighten: `hover:bg-white` (from bg-white/90)
- Text darkens: `hover:text-gray-800` (from gray-600)

### Active States
- Buttons press down: `translate-y-0.5` + shadow decrease
- Background darkens slightly

---

## Best Practices

### Do's ✅
- Always use lowercase for Spanish text and buttons
- Include noise texture on white cards
- Use 3px borders for primary interactive elements
- Add shadow-lift on button hover
- Keep navigation consistent (bottom tabs always visible)
- Use Lucide icons for navigation/actions
- Use emojis for playful feedback only

### Don'ts ❌
- Don't mix different border widths on same screen
- Don't use uppercase except for tiny labels
- Don't mix Lucide icons and emojis in same component
- Don't create new button styles (reuse patterns)
- Don't hide bottom navigation
- Don't mix Spanish/English in same text block

---

## Implementation Notes

### CSS Classes to Reuse

Save these as Tailwind @apply classes in `index.css`:

```css
/* Buttons */
.btn-primary { /* green CTA */ }
.btn-secondary { /* white bordered */ }
.btn-destructive { /* red warning */ }

/* Cards */
.card-white { /* standard white card */ }
.card-paper { /* flashcard paper texture */ }

/* Text */
.text-spanish { /* lowercase, handwritten */ }
.text-label { /* uppercase, marker */ }
```

### Component Checklist

When creating new components:
- [ ] Uses established color palette
- [ ] Uses standard font families
- [ ] Includes noise texture (if white background)
- [ ] Has 3px dark borders
- [ ] Has shadow-lift hover state
- [ ] Uses lowercase text (Spanish style)
- [ ] Uses emoji icons (not SVG/font icons)
- [ ] Responsive (works 320px-640px)
- [ ] Accessible (keyboard nav, sufficient contrast)

---

## Future Enhancements

**v2.0 Navigation Ideas:**
1. Add stats page with charts
2. Add settings page with preferences
3. Add card browser/search
4. Add review history timeline

**Design System Expansions:**
1. Dark mode variant
2. Animation library
3. Sound effects
4. Haptic feedback (mobile)
