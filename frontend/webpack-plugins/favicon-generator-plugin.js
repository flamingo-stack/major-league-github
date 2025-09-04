const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

class FaviconGeneratorPlugin {
  constructor(options = {}) {
    this.options = {
      svgPath: options.svgPath || 'public/favicon.svg',
      icoPath: options.icoPath || 'public/favicon.ico',
      size: options.size || 60,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'FaviconGeneratorPlugin';

    compiler.hooks.beforeRun.tapAsync(pluginName, async (compilation, callback) => {
      try {
        await this.generateFavicon(compiler.context);
        callback();
      } catch (error) {
        callback(error);
      }
    });

    compiler.hooks.watchRun.tapAsync(pluginName, async (compilation, callback) => {
      try {
        await this.generateFavicon(compiler.context);
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }

  async generateFavicon(context) {
    const svgPath = path.resolve(context, this.options.svgPath);
    const icoPath = path.resolve(context, this.options.icoPath);

    // Check if SVG file exists
    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  SVG favicon not found: ${svgPath}`);
      return;
    }

    // Check if ICO already exists and is newer than SVG
    if (fs.existsSync(icoPath)) {
      const svgStats = fs.statSync(svgPath);
      const icoStats = fs.statSync(icoPath);
      
      if (icoStats.mtime > svgStats.mtime) {
        console.log('ℹ️  Favicon ICO is up to date');
        return;
      }
    }

    console.log('🔄 Generating favicon.ico from SVG...');

    try {
      // Convert SVG to PNG
      const pngBuffer = await sharp(svgPath)
        .resize(this.options.size, this.options.size)
        .png()
        .toBuffer();

      // Convert PNG to ICO
      const icoBuffer = await toIco([pngBuffer]);

      // Ensure directory exists
      const icoDir = path.dirname(icoPath);
      if (!fs.existsSync(icoDir)) {
        fs.mkdirSync(icoDir, { recursive: true });
      }

      // Save ICO file
      fs.writeFileSync(icoPath, icoBuffer);

      const fileSize = (fs.statSync(icoPath).size / 1024).toFixed(2);
      console.log(`✅ Generated favicon.ico (${fileSize} KB) at: ${icoPath}`);

    } catch (error) {
      console.error('❌ Error generating favicon:', error.message);
      throw error;
    }
  }
}

module.exports = FaviconGeneratorPlugin;