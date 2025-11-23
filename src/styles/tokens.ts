/**
 * Design Token System for ReplyLink
 * Single source of truth for spacing, colors, typography, shadows, and surfaces
 * Used across all UI components for consistency
 */

// ============================================================================
// SPACING GRID (4px base)
// ============================================================================
export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

export type SpacingKey = keyof typeof SPACING

// ============================================================================
// COLOR PALETTE
// ============================================================================
export const COLORS = {
  // Primary & Secondary
  primary: '#059669', // Emerald-600
  secondary: '#2563eb', // Blue-600
  accent: '#06b6d4', // Cyan-500

  // Neutral & Backgrounds
  neutral: {
    'bg-dark': '#0f172a', // Slate-950 (page background)
    'bg-card': '#1e293b', // Slate-900 (card backgrounds)
    'bg-input': '#334155', // Slate-800 (input/control backgrounds)
    'text-primary': '#f1f5f9', // Slate-100 (primary text)
    'text-secondary': '#cbd5e1', // Slate-300 (secondary text)
    'text-muted': '#94a3b8', // Slate-400 (muted text)
    'border': '#475569', // Slate-700 (borders)
    'divider': '#ffffff', // White with 10% opacity
  },

  // Status Colors
  status: {
    success: '#16a34a', // Green-600
    warning: '#d97706', // Amber-600
    error: '#dc2626', // Red-600
    info: '#2563eb', // Blue-600
  },

  // Extended Palette (for gradients, badges, etc.)
  emerald: {
    50: '#f0fdf4',
    100: '#dcfce7',
    600: '#059669',
    700: '#047857',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  cyan: {
    500: '#06b6d4',
    600: '#0891b2',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    300: '#cbd5e1',
    400: '#94a3b8',
    700: '#475569',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================
export const TYPOGRAPHY = {
  sizes: {
    hero: '48px', // h1 - 3xl
    pageHead: '36px', // h2 - 2xl
    sectionHead: '24px', // h3 - xl
    label: '14px', // form labels
    body: '16px', // p - base
    caption: '12px', // small text
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// ============================================================================
// SHADOWS & ELEVATION
// ============================================================================
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const

// ============================================================================
// SURFACES
// ============================================================================
export const SURFACES = {
  'bg-page': COLORS.neutral['bg-dark'],
  'bg-card': COLORS.neutral['bg-card'],
  'bg-input': COLORS.neutral['bg-input'],
  'bg-hover': '#2d3748', // Slightly lighter on hover
  'border-color': COLORS.neutral['border'],
  'border-light': 'rgba(255, 255, 255, 0.1)', // For dividers
} as const

// ============================================================================
// BORDERS & RADIUS
// ============================================================================
export const BORDERS = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px', // 2xl in Tailwind
    full: '9999px',
  },
  width: {
    thin: '1px',
    base: '2px',
    thick: '3px',
  },
} as const

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================
export const TRANSITIONS = {
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  notification: 1070,
} as const

// ============================================================================
// BREAKPOINTS (for responsive design)
// ============================================================================
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// UNIFIED TOKEN EXPORT
// ============================================================================
export const TOKENS = {
  spacing: SPACING,
  colors: COLORS,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  surfaces: SURFACES,
  borders: BORDERS,
  transitions: TRANSITIONS,
  zIndex: Z_INDEX,
  breakpoints: BREAKPOINTS,
} as const

// ============================================================================
// COMPONENT-SPECIFIC TOKENS (convenience exports)
// ============================================================================

/**
 * Button color variants
 */
export const BUTTON_COLORS = {
  primary: {
    bg: COLORS.primary,
    text: '#ffffff',
    hover: '#047857',
    active: '#065f46',
  },
  secondary: {
    bg: COLORS.neutral['bg-input'],
    text: COLORS.neutral['text-primary'],
    hover: '#475569',
    active: '#1e293b',
  },
  danger: {
    bg: COLORS.status.error,
    text: '#ffffff',
    hover: '#b91c1c',
    active: '#991b1b',
  },
} as const

/**
 * Input/Form field variants
 */
export const FORM_COLORS = {
  bg: COLORS.neutral['bg-input'],
  border: COLORS.neutral['border'],
  'border-focus': COLORS.primary,
  'border-error': COLORS.status.error,
  'bg-disabled': COLORS.neutral['bg-card'],
  'text-disabled': COLORS.neutral['text-muted'],
} as const

/**
 * Card/Surface variants
 */
export const CARD_COLORS = {
  default: {
    bg: COLORS.neutral['bg-card'],
    border: COLORS.neutral['border'],
    shadow: SHADOWS.md,
  },
  elevated: {
    bg: COLORS.neutral['bg-card'],
    border: COLORS.neutral['border'],
    shadow: SHADOWS.lg,
  },
  interactive: {
    bg: COLORS.neutral['bg-card'],
    border: COLORS.neutral['border'],
    shadow: SHADOWS.sm,
    'hover-shadow': SHADOWS.lg,
    'hover-border': COLORS.primary,
  },
} as const

/**
 * Badge/Tag color schemes
 */
export const BADGE_COLORS = {
  success: {
    bg: 'rgba(22, 163, 74, 0.1)',
    text: COLORS.status.success,
  },
  warning: {
    bg: 'rgba(217, 119, 6, 0.1)',
    text: COLORS.status.warning,
  },
  error: {
    bg: 'rgba(220, 38, 38, 0.1)',
    text: COLORS.status.error,
  },
  info: {
    bg: 'rgba(37, 99, 235, 0.1)',
    text: COLORS.status.info,
  },
} as const
