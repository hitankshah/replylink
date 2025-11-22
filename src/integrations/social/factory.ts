import { SocialPlatformAdapter } from './adapter'
import { InstagramAdapter } from '@/integrations/instagram/adapter'
import { FacebookAdapter } from '@/integrations/facebook/adapter'
import { WhatsAppAdapter } from '@/integrations/whatsapp/adapter'

/**
 * Social Adapter Factory
 * Returns the appropriate adapter for a platform
 */

export function getAdapter(platform: string): SocialPlatformAdapter | null {
  switch (platform.toUpperCase()) {
    case 'INSTAGRAM':
      return new InstagramAdapter()
    case 'FACEBOOK':
      return new FacebookAdapter()
    case 'WHATSAPP':
      return new WhatsAppAdapter()
    default:
      return null
  }
}
