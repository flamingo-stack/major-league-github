# Color System Migration

This document describes the migration from `@flamingo/ui-kit` color imports to local flat hex colors.

## Overview

The project has been migrated from using ui-kit CSS variables and imports to local flat hex color values to avoid dependency issues and ensure consistent color availability.

## Color Sources

Colors are extracted from two sources in the ui-kit:

1. **Base Color Tokens** (`ui-kit/src/styles/ods_color_tokens.json`)
   - Primary design tokens with semantic names
   - Includes attention colors, flamingo brand colors, open yellow, and system greys

2. **Semantic Colors** (`ui-kit/src/styles/ods-colors.css`)
   - CSS custom properties with hex values only
   - Includes high-level semantic mappings like `--color-warning: #f59e0b`

## Generated Files

- **`src/styles/colors.ts`** - Generated TypeScript file with all color exports
  - `baseColors` - Direct tokens from JSON
  - `semanticColors` - Hex values from CSS
  - `colors` - Combined export
  - Individual category exports (attention, flamingo, openYellow, systemGreys)

## Usage

```typescript
// Import individual categories
import { systemGreys, flamingo } from '../styles/colors';

// Usage in components
const StyledComponent = styled.div`
  background-color: ${systemGreys.background};
  color: ${systemGreys.white};
  border: 1px solid ${flamingo.pink_base};
`;

// Or use with Material-UI sx prop
<Box sx={{ 
  bgcolor: systemGreys.background,
  color: systemGreys.white,
  borderColor: flamingo.pink_base 
}} />
```

## Automated Updates

### Copy Colors Script

Run the color extraction script to update local colors when ui-kit changes:

```bash
npm run copy:colors
```

This script (`scripts/extract-ui-kit-colors.js`):
- Extracts all color tokens from ui-kit sources
- Converts to flat hex values with valid JavaScript identifiers
- Generates TypeScript file with proper exports and types
- Provides organized category exports for easier usage

### Integration

The script can be integrated into CI/CD or development workflows:

```bash
# Update ui-kit dependency and copy colors
npm run setup:ui-kit
npm run copy:colors

# Verify everything builds
npm run build
```

## Migrated Components

The following components have been migrated from ui-kit color imports:

- ✅ `HeroSection.tsx` - Updated to use systemGreys and flamingo colors
- ✅ `Header.tsx` - Updated to use systemGreys
- ✅ `GitHubStats.tsx` - Updated to use systemGreys  
- ✅ `HiringSection.tsx` - Updated to use systemGreys
- ✅ `Layout.tsx` - Updated to use systemGreys
- ✅ `main.tsx` - Removed ui-kit styles import

## Color Categories

### System Greys
- `background`, `background_action`, `background_hover`
- `black`, `black_action`, `black_hover`
- `grey`, `grey_action`, `grey_hover`
- `soft_grey`, `soft_grey_action`, `soft_grey_hover`
- `white`, `white_action`, `white_hover`

### Flamingo Colors
- Cyan: `cyan_base`, `cyan_action`, `cyan_hover`, `cyan_dark`, `cyan_light` variants
- Pink: `pink_base`, `pink_action`, `pink_hover`, `pink_dark`, `pink_light` variants

### Open Yellow
- `base`, `action`, `hover`, `dark`, `light` variants

### Attention Colors
- Green: `green_success`, `green_success_action`, `green_success_hover`
- Red: `red_error`, `red_error_action`, `red_error_hover`

## Benefits

1. **No Import Errors** - No dependency on ui-kit styles that may be missing
2. **Flat Hex Values** - Direct color values, no CSS variable resolution needed
3. **Type Safety** - Full TypeScript support with color key validation
4. **Organized Access** - Category-based exports for logical grouping
5. **Easy Updates** - Automated script to sync with ui-kit changes
6. **Build Performance** - No runtime CSS variable lookups

## Maintenance

When ui-kit colors change:
1. Run `npm run copy:colors` to update local colors
2. Review generated `src/styles/colors.ts` for any new/changed colors
3. Update component usage if needed
4. Test build and visual appearance

The color extraction script preserves the same color values as ui-kit while providing a more reliable import mechanism.