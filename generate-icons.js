#!/usr/bin/env node

/**
 * Generate PNG icons from SVG source
 * Requires: npm install sharp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, 'public', 'icon.svg');
const outputDir = path.join(__dirname, 'public');

// Icon sizes to generate
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
];

async function generateIcons() {
  console.log('🎨 Generating icons from SVG...\n');

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error(`❌ Error: SVG file not found at ${svgPath}`);
    process.exit(1);
  }

  // Read SVG
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate each size
  for (const { size, name } of sizes) {
    try {
      const outputPath = path.join(outputDir, name);

      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message);
    }
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Icons are in the /public directory');
  console.log('2. favicon.ico will be generated automatically by browsers');
  console.log('3. Restart your dev server to see the new favicon');
}

generateIcons().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
