// Script to resize VSM icon to required PWA and Capacitor sizes
import sharp from 'sharp';
import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const source = 'C:/Users/maria/.gemini/antigravity/brain/f911bf63-cbca-4aae-9cab-5cd038defac6/vsm_icon_1790567765871.jpg';
const publicDir = join(__dirname, '../frontend/public');
const androidResDir = join(__dirname, '../frontend/android-res');

// PWA icon sizes
const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Capacitor/Android splash sizes  
const capacitorSizes = [
  { size: 48,  name: 'mipmap-mdpi/ic_launcher.png' },
  { size: 72,  name: 'mipmap-hdpi/ic_launcher.png' },
  { size: 96,  name: 'mipmap-xhdpi/ic_launcher.png' },
  { size: 144, name: 'mipmap-xxhdpi/ic_launcher.png' },
  { size: 192, name: 'mipmap-xxxhdpi/ic_launcher.png' },
];

async function generate() {
  // Generate PWA icons into public/
  for (const size of pwaSizes) {
    const outPath = join(publicDir, `icon-${size}x${size}.png`);
    await sharp(source)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✅ ${outPath}`);
  }

  // Also create apple-touch-icon
  await sharp(source)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ apple-touch-icon.png');

  // Maskable icon (with padding for safe zone)
  await sharp(source)
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'icon-512x512-maskable.png'));
  console.log('✅ icon-512x512-maskable.png');

  console.log('\n🎉 All icons generated!');
}

generate().catch(console.error);
