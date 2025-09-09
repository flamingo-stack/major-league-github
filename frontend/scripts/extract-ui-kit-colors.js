#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Source files from ui-kit
const UI_KIT_DIR = path.join(__dirname, '../ui-kit/src/styles');
const COLOR_TOKENS_FILE = path.join(UI_KIT_DIR, 'ods_color_tokens.json');
const COLOR_CSS_FILE = path.join(UI_KIT_DIR, 'ods-colors.css');

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../src/styles');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'colors.ts');

function extractColorsFromJSON() {
  const colorTokens = JSON.parse(fs.readFileSync(COLOR_TOKENS_FILE, 'utf8'));
  const colors = {};
  
  function traverse(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        if (value.value && value.type === 'color') {
          // This is a color token
          const colorName = prefix ? `${prefix}_${key}` : key;
          // Convert hyphens to underscores for valid JS identifiers
          colors[colorName.replace(/-/g, '_')] = value.value;
        } else {
          // Continue traversing
          const newPrefix = prefix ? `${prefix}_${key}` : key;
          traverse(value, newPrefix.replace(/-/g, '_'));
        }
      }
    }
  }
  
  traverse(colorTokens.color);
  return colors;
}

function extractSemanticColorsFromCSS() {
  const cssContent = fs.readFileSync(COLOR_CSS_FILE, 'utf8');
  const semanticColors = {};
  
  // Extract CSS custom properties (--color-* variables)
  const cssVariableRegex = /--color-([^:]+):\s*([^;]+);/g;
  let match;
  
  while ((match = cssVariableRegex.exec(cssContent)) !== null) {
    const [, name, value] = match;
    // Only extract hex values, skip var() references
    if (value.startsWith('#')) {
      semanticColors[name.replace(/-/g, '_')] = value.trim();
    }
  }
  
  return semanticColors;
}

function generateColorsFile() {
  console.log('🎨 Extracting colors from ui-kit...');
  
  // Extract from JSON tokens
  const baseColors = extractColorsFromJSON();
  console.log(`📦 Extracted ${Object.keys(baseColors).length} base color tokens`);
  
  // Extract semantic colors with hex values from CSS
  const semanticColors = extractSemanticColorsFromCSS();
  console.log(`🎯 Extracted ${Object.keys(semanticColors).length} semantic color values`);
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate TypeScript file
  const tsContent = `/**
 * Colors extracted from @flamingo/ui-kit
 * Generated automatically from ui-kit/src/styles/ods_color_tokens.json and ods-colors.css
 * 
 * @see scripts/extract-ui-kit-colors.js
 * @see ui-kit/src/styles/ods_color_tokens.json
 * @see ui-kit/src/styles/ods-colors.css
 */

// Base Color Tokens (from ods_color_tokens.json)
export const baseColors = {
${Object.entries(baseColors)
  .map(([name, value]) => `  ${name}: '${value}',`)
  .join('\n')}
} as const;

// Semantic Colors (hex values from ods-colors.css)
export const semanticColors = {
${Object.entries(semanticColors)
  .map(([name, value]) => `  ${name}: '${value}',`)
  .join('\n')}
} as const;

// Combined colors export
export const colors = {
  ...baseColors,
  ...semanticColors,
} as const;

// Type for all available colors
export type ColorKey = keyof typeof colors;

// Helper function to get color value
export function getColor(key: ColorKey): string {
  return colors[key];
}

// Export individual color categories for easier access
export const attention = {
  green_success: baseColors.attention_green_success,
  green_success_action: baseColors.attention_green_success_action,
  green_success_hover: baseColors.attention_green_success_hover,
  red_error: baseColors.attention_red_error,
  red_error_action: baseColors.attention_red_error_action,
  red_error_hover: baseColors.attention_red_error_hover,
} as const;

export const flamingo = {
  cyan_base: baseColors.flamingo_cyan_base,
  cyan_action: baseColors.flamingo_cyan_action,
  cyan_hover: baseColors.flamingo_cyan_hover,
  cyan_dark: baseColors.flamingo_cyan_dark,
  cyan_dark_action: baseColors.flamingo_cyan_dark_action,
  cyan_dark_hover: baseColors.flamingo_cyan_dark_hover,
  cyan_light: baseColors.flamingo_cyan_light,
  cyan_light_action: baseColors.flamingo_cyan_light_action,
  cyan_light_hover: baseColors.flamingo_cyan_light_hover,
  pink_base: baseColors.flamingo_pink_base,
  pink_action: baseColors.flamingo_pink_action,
  pink_hover: baseColors.flamingo_pink_hover,
  pink_dark: baseColors.flamingo_pink_dark,
  pink_dark_action: baseColors.flamingo_pink_dark_action,
  pink_dark_hover: baseColors.flamingo_pink_dark_hover,
  pink_light: baseColors.flamingo_pink_light,
  pink_light_action: baseColors.flamingo_pink_light_action,
  pink_light_hover: baseColors.flamingo_pink_light_hover,
} as const;

export const openYellow = {
  base: baseColors.open_yellow_base,
  action: baseColors.open_yellow_action,
  hover: baseColors.open_yellow_hover,
  dark: baseColors.open_yellow_dark,
  dark_action: baseColors.open_yellow_dark_action,
  dark_hover: baseColors.open_yellow_dark_hover,
  light: baseColors.open_yellow_light,
  light_action: baseColors.open_yellow_light_action,
  light_hover: baseColors.open_yellow_light_hover,
} as const;

export const systemGreys = {
  background: baseColors.system_greys_background,
  background_action: baseColors.system_greys_background_action,
  background_hover: baseColors.system_greys_background_hover,
  black: baseColors.system_greys_black,
  black_action: baseColors.system_greys_black_action,
  black_hover: baseColors.system_greys_black_hover,
  grey: baseColors.system_greys_grey,
  grey_action: baseColors.system_greys_grey_action,
  grey_hover: baseColors.system_greys_grey_hover,
  soft_grey: baseColors.system_greys_soft_grey,
  soft_grey_action: baseColors.system_greys_soft_grey_action,
  soft_grey_hover: baseColors.system_greys_soft_grey_hover,
  white: baseColors.system_greys_white,
  white_action: baseColors.system_greys_white_action,
  white_hover: baseColors.system_greys_white_hover,
} as const;
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`✅ Generated colors file: ${OUTPUT_FILE}`);
  console.log(`📊 Total colors available: ${Object.keys(baseColors).length + Object.keys(semanticColors).length}`);
  
  return {
    baseColors,
    semanticColors,
    totalColors: Object.keys(baseColors).length + Object.keys(semanticColors).length
  };
}

// Run the extraction
if (require.main === module) {
  generateColorsFile();
}

module.exports = { generateColorsFile };