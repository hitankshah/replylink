import { z } from 'zod'

// Auth Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().optional(),
  timezone: z.string().optional().default('UTC'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const updatePasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

// Page Validation Schemas
export const createPageSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(100, 'Title must be less than 100 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
})

export const updatePageSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(100, 'Title must be less than 100 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  theme: z.enum(['light', 'dark', 'gradient']).optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  buttonColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
})

// Button Validation Schemas
export const createButtonSchema = z.object({
  pageId: z.string().cuid('Invalid page ID'),
  type: z.enum(['URL', 'WHATSAPP', 'CALL', 'EMAIL', 'SMS', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK']),
  label: z.string().min(1, 'Button label is required').max(50, 'Label must be less than 50 characters'),
  value: z.string().min(1, 'Button value is required'),
  icon: z.string().optional(),
  order: z.number().min(0).optional(),
})

export const updateButtonSchema = z.object({
  type: z.enum(['URL', 'WHATSAPP', 'CALL', 'EMAIL', 'SMS', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK']).optional(),
  label: z.string().min(1, 'Button label is required').max(50, 'Label must be less than 50 characters').optional(),
  value: z.string().min(1, 'Button value is required').optional(),
  icon: z.string().optional(),
  order: z.number().min(0).optional(),
})

// Rule Validation Schemas
export const createRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required').max(50, 'Name must be less than 50 characters'),
  platform: z.enum(['INSTAGRAM', 'FACEBOOK', 'WHATSAPP']),
  socialAccountId: z.string().cuid('Invalid social account ID'),
  triggerType: z.enum(['KEYWORD', 'DM', 'COMMENT', 'TIME', 'ALWAYS']),
  triggerKeywords: z.string().optional(), // Comma-separated keywords
  triggerTime: z
    .object({
      startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
      endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
      timezone: z.string(),
    })
    .optional(),
  actionType: z.enum(['REPLY', 'DIRECT_MESSAGE', 'LINK_SHARE']),
  actionMessage: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  priority: z.number().min(1, 'Priority must be between 1 and 10').max(10),
  enabled: z.boolean().optional().default(true),
})

export const updateRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required').max(50, 'Name must be less than 50 characters').optional(),
  triggerKeywords: z.string().optional(),
  triggerTime: z
    .object({
      startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
      endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
      timezone: z.string(),
    })
    .optional(),
  actionMessage: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters').optional(),
  priority: z.number().min(1).max(10).optional(),
  enabled: z.boolean().optional(),
})

// Workspace Validation Schemas
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be less than 30 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
})

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Name must be less than 100 characters').optional(),
})

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

export const updateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

// Billing Validation Schemas
export const createSubscriptionSchema = z.object({
  planType: z.enum(['FREE', 'STARTER', 'PRO', 'AGENCY']),
  gateway: z.enum(['razorpay', 'paypal']),
})

export const updatePlanSchema = z.object({
  plan: z.enum(['FREE', 'STARTER', 'PRO', 'AGENCY']),
})

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreatePageInput = z.infer<typeof createPageSchema>
export type UpdatePageInput = z.infer<typeof updatePageSchema>
export type CreateButtonInput = z.infer<typeof createButtonSchema>
export type UpdateButtonInput = z.infer<typeof updateButtonSchema>
export type CreateRuleInput = z.infer<typeof createRuleSchema>
export type UpdateRuleInput = z.infer<typeof updateRuleSchema>
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>
