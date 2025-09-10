/**
 * Color mappings from hardcoded GitHub-style colors to ODS color system
 * This file centralizes all color conversions to make future changes easier
 */

import { systemGreys, flamingo, attention, openYellow } from './colors';

// GitHub to ODS color mappings
export const githubToOds = {
  // Text colors
  textPrimary: systemGreys.white,           // #e6edf3 → ODS white
  textSecondary: systemGreys.grey,          // #7d8590, #768390 → ODS grey  
  textMuted: systemGreys.grey_hover,        // #57606a, #6e7681 → ODS grey_hover
  textDark: systemGreys.black,              // #24292f → ODS black
  
  // Background colors
  bgDark: systemGreys.background,           // #161b22 → ODS background
  bgCard: systemGreys.black,                // Card backgrounds
  bgHover: systemGreys.soft_grey_hover,     // Hover states
  bgLight: systemGreys.white_hover,         // #f6f8fa → ODS white_hover
  
  // Border colors
  border: systemGreys.soft_grey,            // #30363d → ODS soft_grey
  borderHover: systemGreys.soft_grey_hover, // Hover border states
  
  // Link colors
  link: flamingo.cyan_light,                // #58a6ff, #539bf5 → ODS cyan_light
  linkHover: flamingo.cyan_base,            // Link hover states
  linkDark: flamingo.cyan_dark,             // #0969da, #0550ae → ODS cyan_dark
  linkAccent: flamingo.cyan_base,           // #2f81f7 → ODS cyan_base
  
  // Status colors
  success: attention.green_success,         // #57ab5a, #1a7f37 → ODS green
  warning: openYellow.base,                 // #daaa3f, #9a6700 → ODS yellow
  error: attention.red_error,               // #ec775c, #cf222e → ODS red
  info: flamingo.cyan_base,                 // Info states
  purple: flamingo.pink_base,               // #986ee2, #8250df → ODS pink
  
  // Additional colors
  muted: systemGreys.grey,                  // #adbac7 → ODS grey
  white: systemGreys.white,                 // #ffffff → ODS white
} as const;

// Badge colors with opacity variations for rankings
export const badgeColors = {
  gold: {
    bg: `${openYellow.base}1A`,              // 10% opacity
    bgHover: `${openYellow.base}26`,         // 15% opacity  
    border: `${openYellow.base}4D`,          // 30% opacity
    borderHover: `${openYellow.base}66`,     // 40% opacity
    text: openYellow.base,                   // Full opacity
  },
  silver: {
    bg: `${systemGreys.grey}1A`,
    bgHover: `${systemGreys.grey}26`,
    border: `${systemGreys.grey}4D`,
    borderHover: `${systemGreys.grey}66`,
    text: systemGreys.grey,
  },
  bronze: {
    bg: `${openYellow.dark}1A`,
    bgHover: `${openYellow.dark}26`,
    border: `${openYellow.dark}4D`,
    borderHover: `${openYellow.dark}66`,
    text: openYellow.dark,
  },
} as const;

// Common shadow colors using ODS
export const shadows = {
  light: `${systemGreys.black}26`,           // 15% opacity for light shadows
  medium: `${systemGreys.black}4D`,          // 30% opacity for medium shadows
  heavy: `${systemGreys.black}B3`,           // 70% opacity for heavy shadows
  card: `${systemGreys.black}B3`,            // Card shadows
} as const;

// Helper function to get GitHub color mapping
export function getGithubColor(key: keyof typeof githubToOds): string {
  return githubToOds[key];
}

// Helper function to get badge color
export function getBadgeColor(type: keyof typeof badgeColors, variant: keyof typeof badgeColors.gold): string {
  return badgeColors[type][variant];
}

// Helper function to get shadow color
export function getShadowColor(type: keyof typeof shadows): string {
  return shadows[type];
}

// Type exports for better TypeScript support
export type GithubColorKey = keyof typeof githubToOds;
export type BadgeColorType = keyof typeof badgeColors;
export type BadgeColorVariant = keyof typeof badgeColors.gold;
export type ShadowType = keyof typeof shadows;