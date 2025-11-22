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

export class InstagramAdapter implements SocialPlatformAdapter {
  private appId: string
  private appSecret: string
  private redirectUri: string

  constructor() {
    this.appId = process.env.META_APP_ID || ''
    this.appSecret = process.env.META_APP_SECRET || ''
    this.redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/integrations/connect?platform=INSTAGRAM`

    if (!this.appId || !this.appSecret) {
      console.warn('Instagram Adapter: META_APP_ID or META_APP_SECRET not configured')
    }
  }

  getOAuthUrl(state: string): string {
    const scopes = [
      'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_messages',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata',
      'public_profile'
    ].join(',')

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}&scope=${scopes}&response_type=code`
  }

  async exchangeCodeForToken(code: string): Promise<OAuthResult> {
    // 1. Exchange code for short-lived user access token
    const tokenUrl = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/oauth/access_token?client_id=${this.appId}&client_secret=${this.appSecret}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code=${code}`
    
    const tokenRes = await fetch(tokenUrl)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      throw new Error(`Instagram OAuth Error: ${tokenData.error.message}`)
    }

    const shortLivedToken = tokenData.access_token

    // 2. Exchange for long-lived user access token (60 days)
    const longLivedUrl = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${shortLivedToken}`
    
    const longLivedRes = await fetch(longLivedUrl)
    const longLivedData = await longLivedRes.json()
    
    const accessToken = longLivedData.access_token || shortLivedToken
    const expiresIn = longLivedData.expires_in

    // 3. Get user profile
    const profile = await this.getUserProfile(accessToken)

    // 4. Get connected Instagram Business Accounts
    const pages = await this.getInstagramAccounts(accessToken)

    return {
      accessToken,
      expiresIn,
      platformUserId: profile.id,
      platformUserName: profile.name,
      pages
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

  private async getInstagramAccounts(accessToken: string): Promise<SocialPage[]> {
    // Get user's pages and their connected IG accounts
    const res = await fetch(
      `${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/accounts?fields=id,name,access_token,picture,instagram_business_account{id,username,profile_picture_url}&access_token=${accessToken}`
    )
    const data = await res.json()

    if (data.error) {
      console.error('Failed to fetch pages:', data.error)
      return []
    }

    const accounts: SocialPage[] = []

    for (const page of data.data || []) {
      if (page.instagram_business_account) {
        accounts.push({
          id: page.instagram_business_account.id,
          name: page.instagram_business_account.username || page.name,
          accessToken: page.access_token, // We might need page token for some ops, but usually user token works for IG Graph API if user has role
          picture: page.instagram_business_account.profile_picture_url
        })
      }
    }

    return accounts
  }

  async parseIncomingEvent(payload: any): Promise<NormalizedEvent[]> {
    const events: NormalizedEvent[] = []
    
    // Handle 'entry' array from Facebook Webhook format
    if (payload.object === 'instagram' && payload.entry) {
      for (const entry of payload.entry) {
        const entryId = entry.id // IG Business Account ID
        
        if (entry.messaging) {
          // Handle Direct Messages
          for (const msg of entry.messaging) {
            if (msg.message) {
              events.push({
                platform: 'INSTAGRAM',
                type: 'MESSAGE',
                externalId: msg.message.mid,
                senderId: msg.sender.id,
                content: msg.message.text || '[Media]',
                timestamp: new Date(msg.timestamp),
                raw: msg,
                metadata: {
                  threadId: msg.sender.id, // In IG DM, sender ID is effectively thread ID for 1:1
                  isEcho: msg.message.is_echo,
                  mediaUrl: msg.message.attachments?.[0]?.payload?.url
                }
              })
            }
          }
        }
        
        if (entry.changes) {
          // Handle Comments/Mentions
          for (const change of entry.changes) {
            if (change.field === 'comments') {
              const val = change.value
              events.push({
                platform: 'INSTAGRAM',
                type: 'COMMENT',
                externalId: val.id,
                senderId: val.from.id,
                senderName: val.from.username,
                content: val.text,
                timestamp: new Date(entry.time * 1000), // entry.time is unix timestamp
                raw: change,
                metadata: {
                  postId: val.media.id,
                  parentId: val.parent_id,
                  permalink: val.media.permalink
                }
              })
            } else if (change.field === 'mentions') {
              const val = change.value
              events.push({
                platform: 'INSTAGRAM',
                type: 'MENTION',
                externalId: val.media_id,
                senderId: val.user_id || 'unknown', // Sometimes not provided in mentions
                content: val.caption || '',
                timestamp: new Date(entry.time * 1000),
                raw: change,
                metadata: {
                  postId: val.media_id,
                  permalink: val.permalink
                }
              })
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
      
      let url = ''
      let body = {}

      if (metadata?.isDirectMessage) {
        // Send DM
        // Note: For IG DM, we use the conversation API or messages API
        // POST /v18.0/me/messages
        url = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/messages?access_token=${accessToken}`
        body = {
          recipient: { id: toId },
          message: { text: content }
        }
      } else {
        // Reply to comment
        // POST /v18.0/{comment-id}/replies
        url = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/${toId}/replies?access_token=${accessToken}`
        body = {
          message: content
        }
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

      return { success: true, id: data.id || data.message_id }
    } catch (error) {
      return { success: false, error }
    }
  }
}
