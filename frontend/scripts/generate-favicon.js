const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    console.log('Converting SVG to ICO favicon...');
    
    const svgPath = path.join(__dirname, '../public/favicon.svg');
    const icoPath = path.join(__dirname, '../public/favicon.ico');
    
    // Check if SVG file exists
    if (!fs.existsSync(svgPath)) {
      throw new Error(`SVG file not found: ${svgPath}`);
    }
    
    // Convert SVG to PNG at 60x60 resolution
    console.log('Converting SVG to PNG at 60x60...');
    const pngBuffer = await sharp(svgPath)
      .resize(60, 60)
      .png()
      .toBuffer();
    
    // Convert PNG to ICO
    console.log('Converting PNG to ICO format...');
    const icoBuffer = await toIco([pngBuffer]);
    
    // Save ICO file
    fs.writeFileSync(icoPath, icoBuffer);
    
    console.log(`✅ Successfully generated favicon.ico at: ${icoPath}`);
    console.log(`File size: ${(fs.statSync(icoPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
    process.exit(1);
  }
}

// Run the conversion
generateFavicon();