// Professional Design Token System for ReplyLink
// Inspired by: Vercel (blacks/grays), Linear (deep blues), Stripe (professional navy)
// NO bright/neon colors - corporate professional palette only

/**
 * SPACING SCALE (4px grid)
 * Use these consistently across all components
 */
export const spacing = {
    0: '0px',
    1: '4px',    // 0.25rem
    2: '8px',    // 0.5rem
    3: '12px',   // 0.75rem
    4: '16px',   // 1rem (base)
    5: '20px',   // 1.25rem
    6: '24px',   // 1.5rem
    8: '32px',   // 2rem
    10: '40px',  // 2.5rem
    12: '48px',  // 3rem
    16: '64px',  // 4rem
    20: '80px',  // 5rem
    24: '96px',  // 6rem
} as const

/**
 * LAYOUT CONSTANTS
 */
export const layout = {
    sidebarWidth: '240px',
    sidebarCollapsedWidth: '64px',
    topbarHeight: '64px',
    maxContentWidth: '1280px',
    mobileBreakpoint: '768px',
    tabletBreakpoint: '1024px',
} as const

/**
 * PROFESSIONAL COLOR SYSTEM
 * Muted, corporate palette - NO bright/neon colors
 */
export const colors = {
    // Brand colors (Professional blue-gray, not bright)
    brand: {
        primary: 'hsl(217, 19%, 27%)',       // Deep blue-gray (like Stripe)
        primaryLight: 'hsl(217, 19%, 45%)',  // Lighter blue-gray
        primaryDark: 'hsl(217, 19%, 15%)',   // Darker blue-gray
    },
    // Accent colors (Muted, professional)
    accent: {
        blue: 'hsl(214, 60%, 50%)',       // Professional blue (not neon)
        indigo: 'hsl(239, 50%, 55%)',     // Muted indigo
        slate: 'hsl(215, 16%, 47%)',      // Slate gray
        navy: 'hsl(217, 91%, 25%)',       // Deep navy (like Stripe)
    },
    // Neutral scale (True blacks and grays - Vercel style)
    gray: {
        0: 'hsl(0, 0%, 100%)',      // Pure white
        50: 'hsl(0, 0%, 98%)',      // Almost white
        100: 'hsl(0, 0%, 96%)',     // Very light gray
        200: 'hsl(0, 0%, 90%)',     // Light gray
        300: 'hsl(0, 0%, 80%)',     // Medium-light gray
        400: 'hsl(0, 0%, 63%)',     // Medium gray
        500: 'hsl(0, 0%, 45%)',     // Medium-dark gray
        600: 'hsl(0, 0%, 32%)',     // Dark gray
        700: 'hsl(0, 0%, 23%)',     // Darker gray
        800: 'hsl(0, 0%, 15%)',     // Very dark gray
        900: 'hsl(0, 0%, 9%)',      // Almost black
        950: 'hsl(0, 0%, 4%)',      // Near black
        1000: 'hsl(0, 0%, 0%)',     // Pure black (Vercel style)
    },
    // Semantic colors (Professional, muted)
    semantic: {
        success: 'hsl(142, 40%, 45%)',      // Muted green (not bright)
        error: 'hsl(0, 65%, 51%)',          // Professional red
        warning: 'hsl(38, 70%, 50%)',       // Muted amber
        info: 'hsl(214, 60%, 50%)',         // Professional blue
    },
    // Surface colors (for dark theme)
    surface: {
        base: 'hsl(0, 0%, 4%)',           // Near black background
        raised: 'hsl(0, 0%, 9%)',         // Slightly elevated surface
        overlay: 'hsl(0, 0%, 15%)',       // Overlay/modal background
    },
} as const

/**
 * TYPOGRAPHY SYSTEM
 */
export const typography = {
    // Font families
    fontFamily: {
        sans: "'Inter', -apple-system, system-ui, sans-serif",
        mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    // Font sizes (Modular scale 1.250 - Major Third)
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
    },
    // Font weights
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    // Line heights
    lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
    },
} as const

/**
 * BORDER RADIUS (Subtle, professional)
 */
export const borderRadius = {
    sm: '4px',      // Small elements (more subtle than 6px)
    md: '6px',      // Default (cards, inputs)
    lg: '8px',      // Large cards
    xl: '12px',     // Feature sections
    '2xl': '16px',  // Hero elements
    full: '9999px', // Pills, avatars
} as const

/**
 * SHADOWS (Soft, professional - Vercel/Linear style)
 */
export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    lg: '0 4px 8px 0 rgba(0, 0, 0, 0.12)',
    xl: '0 8px 16px 0 rgba(0, 0, 0, 0.15)',
    '2xl': '0 16px 32px 0 rgba(0, 0, 0, 0.2)',
    // Subtle glows (not bright)
    glowSubtle: '0 0 20px rgba(59, 130, 246, 0.15)',
    glowMedium: '0 0 30px rgba(59, 130, 246, 0.25)',
} as const

/**
 * Z-INDEX SCALE
 */
export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
} as const

/**
 * TRANSITION DURATIONS
 */
export const transitions = {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
} as const

/**
 * HELPER: Get spacing value by key
 */
export const getSpacing = (key: keyof typeof spacing): string => spacing[key]

/**
 * HELPER: Get color by path (e.g., 'brand.primary')
 */
export const getColor = (path: string): string => {
    const parts = path.split('.')
    let value: any = colors
    for (const part of parts) {
        value = value[part]
    }
    return value as string
}

/**
 * HELPER: Create consistent padding classes
 */
export const createPadding = (size: keyof typeof spacing) => ({
    padding: spacing[size],
})

/**
 * HELPER: Create consistent margin classes
 */
export const createMargin = (size: keyof typeof spacing) => ({
    margin: spacing[size],
})
