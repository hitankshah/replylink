/**
 * Social Platform Adapter Interface
 * 
 * Defines the contract that all social media integrations must implement.
 * This allows the core system to interact with Instagram, Facebook, and WhatsApp
 * in a unified way.
 */

export type SocialPlatform = 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP'

export type EventType = 'COMMENT' | 'MESSAGE' | 'MENTION'

export interface NormalizedEvent {
  platform: SocialPlatform
  type: EventType
  externalId: string      // ID of the comment/message on the platform
  senderId: string        // Platform-specific user ID of the sender
  senderName?: string     // Display name of the sender
  content: string         // Text content of the message/comment
  timestamp: Date
  raw: any                // Original raw payload from webhook
  metadata?: {
    postId?: string       // For comments: ID of the post
    threadId?: string     // For messages: ID of the conversation
    parentId?: string     // For replies: ID of the parent comment
    mediaUrl?: string     // If message contains media
    permalink?: string    // Link to the comment/post
    [key: string]: any
  }
}

export interface OAuthResult {
  accessToken: string
  refreshToken?: string
  expiresIn?: number      // Seconds until expiration
  platformUserId: string  // User's ID on the platform
  platformUserName?: string
  pages?: SocialPage[]    // For FB/IG: list of managed pages/accounts
}

export interface SocialPage {
  id: string
  name: string
  accessToken?: string    // Page-specific access token
  picture?: string
}

export interface ReplyParams {
  toId: string            // ID to reply to (comment ID or user ID)
  content: string         // Message content
  accessToken: string     // Token to use for API call
  metadata?: {
    isDirectMessage?: boolean // If true, send as DM instead of comment reply
    pageId?: string       // ID of the page sending the reply
    [key: string]: any
  }
}

export interface UserProfile {
  id: string
  name: string
  email?: string
  picture?: string
}

export interface SocialPlatformAdapter {
  /**
   * Get the URL to redirect user for OAuth flow
   */
  getOAuthUrl(state: string): string

  /**
   * Exchange authorization code for access token
   */
  exchangeCodeForToken(code: string): Promise<OAuthResult>

  /**
   * Refresh an expired access token
   */
  refreshToken?(oldToken: string): Promise<OAuthResult>

  /**
   * Parse a raw webhook payload into normalized events
   */
  parseIncomingEvent(payload: any): Promise<NormalizedEvent[]>

  /**
   * Send a reply or message
   */
  sendReply(params: ReplyParams): Promise<{ success: boolean; id?: string; error?: any }>

  /**
   * Get user profile information
   */
  getUserProfile(accessToken: string): Promise<UserProfile>
}
