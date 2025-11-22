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

export class FacebookAdapter implements SocialPlatformAdapter {
  private appId: string
  private appSecret: string
  private redirectUri: string

  constructor() {
    this.appId = process.env.META_APP_ID || ''
    this.appSecret = process.env.META_APP_SECRET || ''
    this.redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/integrations/connect?platform=FACEBOOK`
  }

  getOAuthUrl(state: string): string {
    const scopes = [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'pages_manage_metadata',
      'pages_messaging',
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
      throw new Error(`Facebook OAuth Error: ${tokenData.error.message}`)
    }

    const shortLivedToken = tokenData.access_token

    // 2. Exchange for long-lived user access token
    const longLivedUrl = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${shortLivedToken}`
    
    const longLivedRes = await fetch(longLivedUrl)
    const longLivedData = await longLivedRes.json()
    
    const accessToken = longLivedData.access_token || shortLivedToken
    const expiresIn = longLivedData.expires_in

    // 3. Get user profile
    const profile = await this.getUserProfile(accessToken)

    // 4. Get managed Pages
    const pages = await this.getManagedPages(accessToken)

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

  private async getManagedPages(accessToken: string): Promise<SocialPage[]> {
    const res = await fetch(
      `${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/accounts?fields=id,name,access_token,picture&access_token=${accessToken}`
    )
    const data = await res.json()

    if (data.error) {
      console.error('Failed to fetch pages:', data.error)
      return []
    }

    return (data.data || []).map((page: any) => ({
      id: page.id,
      name: page.name,
      accessToken: page.access_token, // Page Access Token is crucial for FB Page ops
      picture: page.picture?.data?.url
    }))
  }

  async parseIncomingEvent(payload: any): Promise<NormalizedEvent[]> {
    const events: NormalizedEvent[] = []
    
    if (payload.object === 'page' && payload.entry) {
      for (const entry of payload.entry) {
        const pageId = entry.id

        if (entry.messaging) {
          // Handle Messenger messages
          for (const msg of entry.messaging) {
            if (msg.message) {
              events.push({
                platform: 'FACEBOOK',
                type: 'MESSAGE',
                externalId: msg.message.mid,
                senderId: msg.sender.id,
                content: msg.message.text || '[Media]',
                timestamp: new Date(msg.timestamp),
                raw: msg,
                metadata: {
                  pageId,
                  isEcho: msg.message.is_echo
                }
              })
            }
          }
        }

        if (entry.changes) {
          // Handle Feed changes (comments, posts)
          for (const change of entry.changes) {
            if (change.field === 'feed') {
              const val = change.value
              if (val.item === 'comment' && val.verb === 'add') {
                events.push({
                  platform: 'FACEBOOK',
                  type: 'COMMENT',
                  externalId: val.comment_id,
                  senderId: val.from.id,
                  senderName: val.from.name,
                  content: val.message,
                  timestamp: new Date(val.created_time * 1000),
                  raw: change,
                  metadata: {
                    postId: val.post_id,
                    parentId: val.parent_id,
                    permalink: `https://facebook.com/${val.post_id}`
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
      
      let url = ''
      let body = {}

      // For Facebook, we often need the Page Access Token, not User Token
      // The caller should provide the correct token (stored in SocialAccount)

      if (metadata?.isDirectMessage) {
        // Send Messenger message
        // POST /v18.0/me/messages
        url = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/messages?access_token=${accessToken}`
        body = {
          recipient: { id: toId },
          message: { text: content }
        }
      } else {
        // Reply to comment
        // POST /v18.0/{comment-id}/comments
        url = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/${toId}/comments?access_token=${accessToken}`
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

      return { success: true, id: data.id }
    } catch (error) {
      return { success: false, error }
    }
  }
}
