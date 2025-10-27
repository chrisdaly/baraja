# 🎴 Baraja App Icons

The Baraja app uses a bold, italic "B" on Spanish flag colors (red and yellow) that matches the playful header design.

## Icon Design

The icon features:
- **Bold italic "B"** using Fredoka One font style
- **Spanish flag stripes** (red-yellow-red)
- **Cream background** (#ffe8b5) matching the app theme
- **Strong black borders** for clarity at all sizes
- **Red shadow effect** for depth

This design was chosen because it:
- ✅ Matches the app header's bold, italic "BARAJA" text
- ✅ Works perfectly at tiny 16×16 favicon size
- ✅ Uses Spanish flag colors for instant recognition
- ✅ Simple enough to be recognizable at all sizes
- ✅ Strong brand identity with just the "B"

## Generated Files

All icon files are generated from `/public/icon.svg`:

| File | Size | Purpose |
|------|------|---------|
| `icon.svg` | 512×512 | Source file (SVG) |
| `favicon-16x16.png` | 16×16 | Browser tab favicon (tiny) |
| `favicon-32x32.png` | 32×32 | Browser tab favicon (standard) |
| `apple-touch-icon.png` | 180×180 | iOS home screen icon |
| `icon-192.png` | 192×192 | PWA icon (standard) |
| `icon-512.png` | 512×512 | PWA icon (large) |

## How to Regenerate Icons

If you update the source SVG (`/public/icon.svg`), regenerate all PNG files:

```bash
npm run generate-icons
```

This will:
1. Read `/public/icon.svg`
2. Generate all PNG sizes using [sharp](https://sharp.pixelplumbing.com/)
3. Save them to `/public` directory

## Files Updated

### index.html
Added complete favicon and PWA metadata:
```html
<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="/icon.svg" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json" />

<!-- Theme color -->
<meta name="theme-color" content="#ffc400" />
```

### manifest.json
Updated to reference the new icon files with proper purpose attributes for PWA support.

## Browser Support

- **Modern browsers**: Will use the SVG favicon for sharp rendering at any size
- **Older browsers**: Will fall back to PNG favicons
- **iOS Safari**: Will use the Apple touch icon for home screen
- **PWA installs**: Will use 192px and 512px icons

## Design Alternatives

See `/icon-concepts.html` and `/favicon-test.html` for other design concepts that were considered, including:
- Full "BARAJA" text (too small at 16×16)
- Card stack designs (too detailed)
- Badge/circle designs (too busy)

The single bold "B" was chosen as the winner after testing at actual favicon size.

## Color Palette

- **Background**: `#ffe8b5` (cream)
- **Red stripe**: `#c60b1e` (Spanish flag red)
- **Yellow stripe**: `#ffc400` (Spanish flag yellow)
- **Text**: `#2c2c2c` (near black)
- **Border**: `#2c2c2c` (near black, 13px wide for visibility)

## Technical Details

- **Source format**: SVG (vector, infinite scaling)
- **Export format**: PNG with transparency
- **Generator**: sharp (Node.js image processor)
- **Font fallback**: Arial Black (when Fredoka One not available)
- **Text transform**: `skewX(-8)` for italic effect
