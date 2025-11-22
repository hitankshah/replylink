import {
  SocialPlatformAdapter,
  OAuthResult,
  NormalizedEvent,
  ReplyParams,
  UserProfile,
  SocialPage
} from '../social/adapter'

const GRAPH_API_VERSION = 'v18.0'
const GRAPH_API_URL = 'https://graph.facebook.com'

export class WhatsAppAdapter implements SocialPlatformAdapter {
  private appId: string
  private appSecret: string
  private redirectUri: string

  constructor() {
    this.appId = process.env.META_APP_ID || ''
    this.appSecret = process.env.META_APP_SECRET || ''
    this.redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/integrations/connect?platform=WHATSAPP`
  }

  getOAuthUrl(state: string): string {
    const scopes = [
      'whatsapp_business_management',
      'whatsapp_business_messaging',
      'public_profile'
    ].join(',')

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}&scope=${scopes}&response_type=code`
  }

  async exchangeCodeForToken(code: string): Promise<OAuthResult> {
    // 1. Exchange code for token
    const tokenUrl = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/oauth/access_token?client_id=${this.appId}&client_secret=${this.appSecret}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code=${code}`
    
    const tokenRes = await fetch(tokenUrl)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      throw new Error(`WhatsApp OAuth Error: ${tokenData.error.message}`)
    }

    const accessToken = tokenData.access_token
    const expiresIn = tokenData.expires_in

    // 2. Get user profile
    const profile = await this.getUserProfile(accessToken)

    // 3. Get WhatsApp Business Accounts
    const accounts = await this.getWhatsAppAccounts(accessToken)

    return {
      accessToken,
      expiresIn,
      platformUserId: profile.id,
      platformUserName: profile.name,
      pages: accounts // We map WA accounts to "pages" structure
    }
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const res = await fetch(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/me?fields=id,name,picture&access_token=${accessToken}`)
    const data = await res.json()

    if (data.error) {
      throw new Error(`Failed to get user profile: ${data.error.message}`)
    }

    return {
      id: data.id,
      name: data.name,
      picture: data.picture?.data?.url
    }
  }

  private async getWhatsAppAccounts(accessToken: string): Promise<SocialPage[]> {
    // Get WhatsApp Business Accounts (WABA)
    const res = await fetch(
      `${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
    )
    // Note: This endpoint returns FB Pages. To get WABAs, we usually query client_whatsapp_business_accounts
    // But typically users connect a WABA directly.
    // For simplicity, we'll assume the user selects a WABA in a subsequent step or we fetch all WABAs
    
    // Correct endpoint for WABAs:
    const wabaRes = await fetch(
        `${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/businesses?fields=id,name,client_whatsapp_business_accounts{id,name,message_templates,phone_numbers}&access_token=${accessToken}`
    )
    const wabaData = await wabaRes.json()

    const accounts: SocialPage[] = []

    if (wabaData.data) {
        for (const business of wabaData.data) {
            if (business.client_whatsapp_business_accounts?.data) {
                for (const waba of business.client_whatsapp_business_accounts.data) {
                    // We need phone numbers to send messages
                    if (waba.phone_numbers?.data) {
                        for (const phone of waba.phone_numbers.data) {
                            accounts.push({
                                id: phone.id, // Phone Number ID is what we use to send
                                name: `${waba.name} - ${phone.display_phone_number}`,
                                accessToken: accessToken, // WA uses System User token or User token
                                picture: '' // WA doesn't expose profile pic easily here
                            })
                        }
                    }
                }
            }
        }
    }

    return accounts
  }

  async parseIncomingEvent(payload: any): Promise<NormalizedEvent[]> {
    const events: NormalizedEvent[] = []
    
    if (payload.object === 'whatsapp_business_account' && payload.entry) {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            const value = change.value
            const phoneNumberId = value.metadata.phone_number_id
            
            for (const msg of value.messages) {
              if (msg.type === 'text') {
                events.push({
                  platform: 'WHATSAPP',
                  type: 'MESSAGE',
                  externalId: msg.id,
                  senderId: msg.from, // Phone number
                  senderName: value.contacts?.[0]?.profile?.name,
                  content: msg.text.body,
                  timestamp: new Date(parseInt(msg.timestamp) * 1000),
                  raw: msg,
                  metadata: {
                    phoneNumberId,
                    wabaId: entry.id
                  }
                })
              }
            }
          }
        }
      }
    }

    return events
  }

  async sendReply(params: ReplyParams): Promise<{ success: boolean; id?: string; error?: any }> {
    try {
      const { toId, content, accessToken, metadata } = params
      const phoneNumberId = metadata?.pageId // We store phone number ID in pageId field

      if (!phoneNumberId) {
        return { success: false, error: 'Missing Phone Number ID' }
      }

      // POST /v18.0/{phone-number-id}/messages
      const url = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/${phoneNumberId}/messages?access_token=${accessToken}`
      
      const body = {
        messaging_product: 'whatsapp',
        to: toId,
        type: 'text',
        text: { body: content }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (data.error) {
        return { success: false, error: data.error }
      }

      return { success: true, id: data.messages?.[0]?.id }
    } catch (error) {
      return { success: false, error }
    }
  }
}
