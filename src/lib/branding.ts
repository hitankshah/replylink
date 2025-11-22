import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  buttonStyle: 'rounded' | 'square' | 'pill'
  fontFamily: string
  fontSize: number
  borderRadius: number
  customCSS?: string
  logoUrl?: string
  faviconUrl?: string
}

export interface BrandTemplate {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  fonts: {
    family: string
    size: number
  }
}

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#4F46E5',
  secondaryColor: '#10B981',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  buttonStyle: 'rounded',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 16,
  borderRadius: 8,
}

const BRAND_TEMPLATES: BrandTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design',
    colors: {
      primary: '#4F46E5',
      secondary: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      size: 16,
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold and colorful design',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      background: '#F7F7F7',
      text: '#2D3436',
    },
    fonts: {
      family: 'Poppins, system-ui, sans-serif',
      size: 18,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and formal style',
    colors: {
      primary: '#1E40AF',
      secondary: '#0891B2',
      background: '#F5F5F5',
      text: '#1F2937',
    },
    fonts: {
      family: 'Roboto, system-ui, sans-serif',
      size: 16,
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Dark theme with neon accents',
    colors: {
      primary: '#06B6D4',
      secondary: '#A78BFA',
      background: '#0F172A',
      text: '#F1F5F9',
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      size: 16,
    },
  },
]

/**
 * Get theme configuration for a page
 */
export async function getPageTheme(pageId: string): Promise<ThemeConfig> {
  const cacheKey = `theme:${pageId}`
  const cached = await cache.get<ThemeConfig>(cacheKey)
  if (cached) {
    return cached
  }

  const page = await prisma.linkPage.findUnique({
    where: { id: pageId },
    select: { theme: true },
  })

  const theme = page?.theme ? (page.theme as Partial<ThemeConfig>) : {}
  const mergedTheme = { ...DEFAULT_THEME, ...theme }

  // Cache for 1 hour
  await cache.set(cacheKey, mergedTheme, { ttl: 3600 })

  return mergedTheme
}

/**
 * Update page theme
 */
export async function updatePageTheme(
  pageId: string,
  themeUpdates: Partial<ThemeConfig>
): Promise<ThemeConfig> {
  const page = await prisma.linkPage.findUnique({
    where: { id: pageId },
    select: { theme: true },
  })

  const currentTheme = page?.theme ? (page.theme as Partial<ThemeConfig>) : {}
  const newTheme = { ...DEFAULT_THEME, ...currentTheme, ...themeUpdates }

  await prisma.linkPage.update({
    where: { id: pageId },
    data: { theme: newTheme },
  })

  // Invalidate cache
  await cache.del(`theme:${pageId}`)

  return newTheme
}

/**
 * Generate CSS from theme configuration
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  return `
:root {
  --color-primary: ${theme.primaryColor};
  --color-secondary: ${theme.secondaryColor};
  --color-background: ${theme.backgroundColor};
  --color-text: ${theme.textColor};
  --font-family: ${theme.fontFamily};
  --font-size: ${theme.fontSize}px;
  --border-radius: ${theme.borderRadius}px;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family);
  font-size: var(--font-size);
}

a {
  color: var(--color-primary);
}

button {
  background-color: var(--color-primary);
  color: #FFFFFF;
  border-radius: ${theme.buttonStyle === 'pill' ? '50px' : theme.buttonStyle === 'square' ? '0' : 'var(--border-radius)'};
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  transition: all 0.3s ease;
}

button:hover {
  background-color: var(--color-secondary);
  transform: translateY(-2px);
}

${theme.customCSS || ''}
  `
}

/**
 * Generate color palette from a base color
 */
export function generateColorPalette(baseColor: string): Record<string, string> {
  // This is a simplified implementation
  // In production, use a library like chroma-js or tinycolor2
  return {
    50: '#F9F5FF',
    100: '#F3EBFF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: baseColor,
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  }
}

/**
 * Get available brand templates
 */
export function getBrandTemplates(): BrandTemplate[] {
  return BRAND_TEMPLATES
}

/**
 * Apply brand template to page
 */
export async function applyBrandTemplate(
  pageId: string,
  templateId: string
): Promise<ThemeConfig> {
  const template = BRAND_TEMPLATES.find((t) => t.id === templateId)
  if (!template) {
    throw new Error('Template not found')
  }

  const newTheme: ThemeConfig = {
    ...DEFAULT_THEME,
    primaryColor: template.colors.primary,
    secondaryColor: template.colors.secondary,
    backgroundColor: template.colors.background,
    textColor: template.colors.text,
    fontFamily: template.fonts.family,
    fontSize: template.fonts.size,
  }

  return updatePageTheme(pageId, newTheme)
}

/**
 * Create custom CSS stylesheet
 */
export async function updateCustomCSS(
  pageId: string,
  customCSS: string
): Promise<ThemeConfig> {
  return updatePageTheme(pageId, { customCSS })
}

/**
 * Get CSS class names for styling components
 */
export function getThemeClasses(theme: ThemeConfig): Record<string, string> {
  return {
    button: `px-6 py-3 rounded-${theme.borderRadius} bg-[${theme.primaryColor}] text-white hover:bg-[${theme.secondaryColor}]`,
    text: `text-[${theme.textColor}] font-[${theme.fontFamily}]`,
    container: `bg-[${theme.backgroundColor}] p-8`,
  }
}

/**
 * Validate CSS for safety
 */
export function validateCustomCSS(css: string): boolean {
  // Prevent dangerous CSS properties
  const dangerousPatterns = [
    /@import/i,
    /expression\(/i,
    /javascript:/i,
    /behavior:/i,
  ]

  return !dangerousPatterns.some((pattern) => pattern.test(css))
}
