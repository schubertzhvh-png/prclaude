# Icons for BIGGA v2.0

## Required Icons

You need to create 3 PNG icons:

- `icon16.png` (16x16px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

## Quick Generation Methods

### Method 1: Online Generator

Use **https://favicon.io/favicon-generator/**:

1. Choose "Text" option
2. Enter text: "🎯" or "B"
3. Choose background: Purple gradient (#667eea)
4. Download and rename files

### Method 2: Figma/Canva

1. Create 128x128px canvas
2. Add emoji "🎯" or "💎" or "📊"
3. Add gradient background (purple to pink)
4. Export as PNG in 3 sizes

### Method 3: Quick Placeholder (Browser Console)

```javascript
// Run this in browser console to create data URLs:
const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
const ctx = canvas.getContext('2d');

// Gradient background
const gradient = ctx.createLinearGradient(0, 0, 128, 128);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 128, 128);

// Add text
ctx.fillStyle = '#fff';
ctx.font = 'bold 80px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('B', 64, 64);

// Get data URL
console.log(canvas.toDataURL());
```

Then convert data URL to PNG using online tool.

### Method 4: ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create 128x128 icon
convert -size 128x128 \
  -gravity center \
  -background "gradient:#667eea-#764ba2" \
  -fill white \
  -font Arial-Bold \
  -pointsize 80 \
  label:B \
  icon128.png

# Resize for other sizes
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

## Recommended Design

- **Background**: Purple gradient (#667eea to #764ba2)
- **Icon**: 🎯 target emoji or "B" letter
- **Style**: Modern, flat design
- **Colors**: White/yellow on purple gradient

## Temporary Solution

For testing, you can use any 3 PNG files and rename them. The extension will work without icons, but won't look professional.

---

## Alternative: SVG Icons (Not Supported in Manifest V3)

If you were using Manifest V2, you could use SVG, but V3 requires PNG/JPEG only.
