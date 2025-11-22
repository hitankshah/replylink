import QRCode from 'qrcode'
import { cache } from '@/lib/cache'

export interface QRCodeOptions {
  size?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  type?: 'image/png' | 'image/jpeg' | 'image/webp'
  quality?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  logoUrl?: string
  logoSize?: number
}

const DEFAULT_QR_OPTIONS: QRCodeOptions = {
  size: 300,
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
}

/**
 * Generate QR code as Data URL
 */
export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const mergedOptions = { ...DEFAULT_QR_OPTIONS, ...options }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: mergedOptions.size,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
      type: mergedOptions.type,
      quality: mergedOptions.quality,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
    })

    return dataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as Buffer
 */
export async function generateQRCodeBuffer(
  text: string,
  options: QRCodeOptions = {}
): Promise<Buffer> {
  const mergedOptions = { ...DEFAULT_QR_OPTIONS, ...options }

  try {
    const buffer = await QRCode.toBuffer(text, {
      width: mergedOptions.size,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
      type: mergedOptions.type,
      quality: mergedOptions.quality,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
    })

    return buffer
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code with caching
 */
export async function generateCachedQRCode(
  pageId: string,
  pageUrl: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const cacheKey = `qr:${pageId}:${JSON.stringify(options)}`

  // Try to get from cache first
  const cached = await cache.get<string>(cacheKey)
  if (cached) {
    return cached
  }

  // Generate new QR code
  const dataUrl = await generateQRCodeDataUrl(pageUrl, options)

  // Cache for 24 hours
  await cache.set(cacheKey, dataUrl, { ttl: 86400 })

  return dataUrl
}

/**
 * Invalidate QR code cache for a page
 */
export async function invalidatePageQRCode(pageId: string): Promise<void> {
  // Delete all QR code variants for this page
  await cache.delPattern(`qr:${pageId}:*`)
}

/**
 * Generate multiple QR code formats
 */
export async function generateQRCodeFormats(
  text: string,
  options: QRCodeOptions = {}
): Promise<{
  png: Buffer
  dataUrl: string
  svg: string
}> {
  const [pngBuffer, dataUrl] = await Promise.all([
    generateQRCodeBuffer(text, { ...options, type: 'image/png' }),
    generateQRCodeDataUrl(text, options),
  ])

  // Generate SVG version
  const svgString = await QRCode.toString(text, {
    width: options.size || DEFAULT_QR_OPTIONS.size,
    errorCorrectionLevel: options.errorCorrectionLevel || 'H',
    type: 'terminal',
    margin: options.margin || 2,
  }).catch(() => '<svg></svg>')

  return {
    png: pngBuffer,
    dataUrl,
    svg: svgString,
  }
}

/**
 * Generate QR code with page branding
 */
export async function generateBrandedQRCode(
  text: string,
  brandColor: string = '#000000',
  options: QRCodeOptions = {}
): Promise<string> {
  return generateQRCodeDataUrl(text, {
    ...options,
    color: {
      dark: brandColor,
      light: '#FFFFFF',
    },
  })
}
