const fs = require('fs');
const path = require('path');

// Simple SVG icon that we'll use as base
const iconSvg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1976d2"/>
  <circle cx="256" cy="256" r="200" fill="white"/>
  <text x="256" y="290" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="#1976d2">$</text>
</svg>
`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Write the SVG file
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), iconSvg.trim());

console.log('Basic icon created at public/icons/icon.svg');
console.log('For production, convert this SVG to PNG files at the required sizes:');
console.log('72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512');
