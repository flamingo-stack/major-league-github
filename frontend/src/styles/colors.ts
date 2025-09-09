/**
 * Colors extracted from @flamingo/ui-kit
 * Generated automatically from ui-kit/src/styles/ods_color_tokens.json and ods-colors.css
 * 
 * @see scripts/extract-ui-kit-colors.js
 * @see ui-kit/src/styles/ods_color_tokens.json
 * @see ui-kit/src/styles/ods-colors.css
 */

// Base Color Tokens (from ods_color_tokens.json)
export const baseColors = {
  attention_green_success: '#5ea62e',
  attention_green_success_action: '#4a921a',
  attention_green_success_hover: '#549c24',
  attention_red_error: '#f36666',
  attention_red_error_action: '#df5252',
  attention_red_error_hover: '#e95c5c',
  flamingo_cyan_base: '#5efaf0',
  flamingo_cyan_action: '#4ae6dc',
  flamingo_cyan_hover: '#54f0e6',
  flamingo_cyan_dark: '#058c83',
  flamingo_cyan_dark_action: '#00786f',
  flamingo_cyan_dark_hover: '#008279',
  flamingo_cyan_light: '#a1fbf5',
  flamingo_cyan_light_action: '#8de7e1',
  flamingo_cyan_light_hover: '#97f1eb',
  flamingo_pink_base: '#f357bb',
  flamingo_pink_action: '#df43a7',
  flamingo_pink_hover: '#e94db1',
  flamingo_pink_dark: '#792b5d',
  flamingo_pink_dark_action: '#651749',
  flamingo_pink_dark_hover: '#6f2153',
  flamingo_pink_light: '#f9abdd',
  flamingo_pink_light_action: '#e597c9',
  flamingo_pink_light_hover: '#efa1d3',
  open_yellow_base: '#ffc008',
  open_yellow_action: '#ebac00',
  open_yellow_hover: '#f5b600',
  open_yellow_dark: '#ffe084',
  open_yellow_dark_action: '#ebcc70',
  open_yellow_dark_hover: '#f5d67a',
  open_yellow_light: '#7f6004',
  open_yellow_light_action: '#6b4c00',
  open_yellow_light_hover: '#755600',
  system_greys_background: '#161616',
  system_greys_background_action: '#2a2a2a',
  system_greys_background_hover: '#202020',
  system_greys_black: '#212121',
  system_greys_black_action: '#353535',
  system_greys_black_hover: '#2b2b2b',
  system_greys_grey: '#888888',
  system_greys_grey_action: '#747474',
  system_greys_grey_hover: '#7e7e7e',
  system_greys_soft_grey: '#3a3a3a',
  system_greys_soft_grey_action: '#4e4e4e',
  system_greys_soft_grey_hover: '#444444',
  system_greys_white: '#fafafa',
  system_greys_white_action: '#f0f0f0',
  system_greys_white_hover: '#f5f5f5',
} as const;

// Semantic Colors (hex values from ods-colors.css)
export const semanticColors = {
  text_on_accent: '#1a1a1a',
  warning: '#f59e0b',
  warning_hover: '#d97706',
  warning_active: '#b45309',
  link_visited: '#b794f6',
  bg_card: '#000000',
  border_default: '#ffffff',
  divider: '#e5e5e5',
  bg: '#000000',
  text_primary: '#ffffff',
  text_secondary: '#ffffff',
  accent_primary: '#00ff00',
  focus_ring: '#00ff00',
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
