import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export interface DomainValidation {
  valid: boolean
  reason?: string
}

export interface DNSRecord {
  type: 'CNAME' | 'A' | 'MX'
  name: string
  value: string
  ttl: number
}

export interface DomainConfig {
  domain: string
  status: 'pending' | 'verified' | 'failed'
  dnsRecords: DNSRecord[]
  sslStatus: 'pending' | 'active' | 'expired'
  redirectHttps: boolean
}

const DEFAULT_DNS_RECORDS: DNSRecord[] = [
  {
    type: 'CNAME',
    name: '@',
    value: 'cname.replylink.io',
    ttl: 3600,
  },
  {
    type: 'CNAME',
    name: 'www',
    value: 'cname.replylink.io',
    ttl: 3600,
  },
]

/**
 * Validate domain format and availability
 */
export async function validateDomain(domain: string): Promise<DomainValidation> {
  // Check format
  const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i
  if (!domainRegex.test(domain)) {
    return { valid: false, reason: 'Invalid domain format' }
  }

  // Check if already in use
  const existing = await prisma.linkPage.findFirst({
    where: { customDomain: domain },
  })

  if (existing) {
    return { valid: false, reason: 'Domain already in use' }
  }

  // Check DNS resolution (stub - would need actual DNS check)
  // In production, you'd use a library like dns2 or dig
  return { valid: true }
}

/**
 * Add custom domain to page
 */
export async function addCustomDomain(
  pageId: string,
  domain: string
): Promise<DomainConfig> {
  // Validate domain
  const validation = await validateDomain(domain)
  if (!validation.valid) {
    throw new Error(validation.reason || 'Invalid domain')
  }

  // Update page with custom domain
  const page = await prisma.linkPage.update({
    where: { id: pageId },
    data: { customDomain: domain },
  })

  // Invalidate cache
  await cache.del(`page:${pageId}`)

  return {
    domain,
    status: 'pending',
    dnsRecords: DEFAULT_DNS_RECORDS,
    sslStatus: 'pending',
    redirectHttps: true,
  }
}

/**
 * Remove custom domain from page
 */
export async function removeCustomDomain(pageId: string): Promise<void> {
  await prisma.linkPage.update({
    where: { id: pageId },
    data: { customDomain: null },
  })

  // Invalidate cache
  await cache.del(`page:${pageId}`)
}

/**
 * Get domain configuration
 */
export async function getDomainConfig(pageId: string): Promise<DomainConfig | null> {
  const cacheKey = `domain:${pageId}`
  const cached = await cache.get<DomainConfig>(cacheKey)
  if (cached) {
    return cached
  }

  const page = await prisma.linkPage.findUnique({
    where: { id: pageId },
    select: { customDomain: true },
  })

  if (!page || !page.customDomain) {
    return null
  }

  const config: DomainConfig = {
    domain: page.customDomain,
    status: 'verified', // In production, check actual DNS records
    dnsRecords: DEFAULT_DNS_RECORDS,
    sslStatus: 'active', // In production, check SSL certificate
    redirectHttps: true,
  }

  // Cache for 24 hours
  await cache.set(cacheKey, config, { ttl: 86400 })

  return config
}

/**
 * Verify DNS records
 */
export async function verifyDNS(domain: string): Promise<boolean> {
  try {
    // In production, implement actual DNS verification
    // For now, return true (stub)
    console.log(`Verifying DNS records for ${domain}`)
    return true
  } catch (error) {
    console.error('DNS verification error:', error)
    return false
  }
}

/**
 * Verify SSL certificate
 */
export async function verifySSL(domain: string): Promise<boolean> {
  try {
    // In production, implement actual SSL verification
    // Could use Let's Encrypt API or check certificate
    console.log(`Verifying SSL for ${domain}`)
    return true
  } catch (error) {
    console.error('SSL verification error:', error)
    return false
  }
}

/**
 * Request SSL certificate for domain
 */
export async function requestSSLCertificate(domain: string): Promise<void> {
  try {
    // In production, integrate with Let's Encrypt or similar
    console.log(`Requesting SSL certificate for ${domain}`)
    // This would typically be handled by your hosting provider
  } catch (error) {
    console.error('SSL request error:', error)
    throw error
  }
}

/**
 * Resolve domain to page ID
 */
export async function resolveDomainToPage(domain: string): Promise<string | null> {
  const cacheKey = `domain-resolve:${domain}`
  const cached = await cache.get<string>(cacheKey)
  if (cached) {
    return cached
  }

  const page = await prisma.linkPage.findUnique({
    where: { customDomain: domain },
    select: { id: true },
  })

  if (!page) {
    return null
  }

  // Cache for 1 hour
  await cache.set(cacheKey, page.id, { ttl: 3600 })

  return page.id
}

/**
 * Get DNS records that need to be configured
 */
export function getDNSRecordsForDomain(domain: string): DNSRecord[] {
  return [
    {
      type: 'CNAME',
      name: '@',
      value: 'cname.replylink.io',
      ttl: 3600,
    },
    {
      type: 'CNAME',
      name: 'www',
      value: 'cname.replylink.io',
      ttl: 3600,
    },
  ]
}

/**
 * Get custom domain status for multiple pages
 */
export async function getCustomDomainStatus(pageIds: string[]): Promise<Record<string, DomainConfig | null>> {
  const results: Record<string, DomainConfig | null> = {}

  for (const pageId of pageIds) {
    results[pageId] = await getDomainConfig(pageId)
  }

  return results
}
