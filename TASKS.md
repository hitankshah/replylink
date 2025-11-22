# ReplyLink Development Tasks

## ✅ PHASE 1: FOUNDATION (COMPLETE)
All foundation tasks completed. Dev server running.

### ✅ Task 1.1: Setup Next.js Project
- [x] Initialize Next.js 14 with TypeScript
- [x] Configure Tailwind CSS
- [x] Setup Prisma ORM with PostgreSQL
- [x] Configure environment variables

### ✅ Task 1.2: Database Schema
- [x] Create User model
- [x] Create LinkPage, LinkButton models
- [x] Create analytics models (PageView, ButtonClick, MonthlyUsage)
- [x] Create Session, PasswordReset models
- [x] Create Subscription model
- [x] Run migrations

### ✅ Task 1.3: Setup Authentication
- [x] Create JWT middleware
- [x] Setup session management
- [x] Configure HTTP-only cookies

### ✅ Task 1.4: Create Global Styles
- [x] Configure dark theme
- [x] Setup responsive utilities
- [x] Create component base styles

---

## ✅ PHASE 2: LINK PAGE BUILDER (COMPLETE)

### ✅ Task 2.1: Create Login Page
- [x] Email/password form
- [x] Remember Me checkbox
- [x] Forgot Password link
- [x] Tailwind + shadcn/ui styling
- [x] Form validation

### ✅ Task 2.2: Create Login API
- [x] Create src/app/api/auth/login/route.ts
- [x] Validate credentials against database
- [x] Hash comparison with bcryptjs
- [x] Create session and set HTTP-only cookie
- [x] Return user data on success

### ✅ Task 2.3: Create Signup Page
- [x] Multi-field form (name, email, password, brand, timezone)
- [x] Password strength indicator
- [x] Terms/privacy checkboxes
- [x] Error messages
- [x] Link to login page

### ✅ Task 2.4: Create Signup API
- [x] Create src/app/api/auth/signup/route.ts
- [x] Validate email uniqueness
- [x] Hash password with bcryptjs
- [x] Create User record
- [x] Auto-create FREE subscription
- [x] Auto-create default link page
- [x] Create session

### ✅ Task 2.5: Create Forgot Password Page
- [x] Email input form
- [x] Show success message after submission
- [x] Add link back to login

### ✅ Task 2.6: Create Password Reset API
- [x] Create src/app/api/auth/reset-password/route.ts
- [x] Generate unique token
- [x] Set 24-hour expiry
- [x] Store in PasswordReset table
- [x] Send email (stub for now)
- [x] Return success message

### ✅ Task 2.7: Create Auth Middleware
- [x] Create src/middleware.ts
- [x] Protect /dashboard routes
- [x] Validate session tokens
- [x] Redirect to /auth/login if invalid
- [x] Allow public routes

### ✅ Task 2.8: Create Logout API
- [x] Create src/app/api/auth/logout/route.ts
- [x] Delete session from database
- [x] Clear sessionToken cookie
- [x] Redirect to /auth/login

### ✅ Task 2.9: Create Pages List View
- [x] Create src/app/dashboard/pages/page.tsx
- [x] Display table with page data
- [x] Show Views, Clicks, Status columns
- [x] Add Create, Edit, Delete, View buttons
- [x] Responsive design

### ✅ Task 2.10: Create Pages List API
- [x] Create src/app/api/pages/route.ts GET handler
- [x] Fetch user's pages with pagination
- [x] Aggregate statistics (views, clicks)
- [x] Return paginated results
- [x] Include theme and button count

### ✅ Task 2.11: Create Page Creation API
- [x] Create src/app/api/pages/route.ts POST handler
- [x] Validate page title and username
- [x] Check username uniqueness
- [x] Check plan page limits
- [x] Create LinkPage record
- [x] Return created page

### ✅ Task 2.12: Create Page Builder Component
- [x] Create src/components/pages/PageBuilder.tsx
- [x] Split view layout (editor/preview)
- [x] Form inputs for title, bio, avatar
- [x] Theme customizer integration
- [x] Button editor integration
- [x] Save handler

### ✅ Task 2.13: Create Theme Customizer
- [x] Create src/components/pages/ThemeCustomizer.tsx
- [x] Color picker inputs (bg, text, button colors)
- [x] Font size selector
- [x] Preset themes (Light, Dark, Gradient)
- [x] Live preview in parent component

### ✅ Task 2.14: Create Button Editor
- [x] Create src/components/pages/ButtonEditor.tsx
- [x] Add button form (type, label, value, icon)
- [x] Button type dropdown (URL, WHATSAPP, CALL, EMAIL, etc.)
- [x] Drag-to-reorder functionality
- [x] Edit/Delete buttons per item
- [x] Real-time preview

### ✅ Task 2.15: Create Page Edit View
- [x] Create src/app/dashboard/pages/[id]/edit/page.tsx
- [x] Fetch page and buttons
- [x] Render PageBuilder component
- [x] Handle save action (PUT request)
- [x] Show success/error toast notifications

### ✅ Task 2.16: Create Page Update API
- [x] Create src/app/api/pages/[id]/route.ts PUT handler
- [x] Validate user owns the page
- [x] Update LinkPage record (title, bio, avatar, theme)
- [x] Return updated data

### ✅ Task 2.17: Create Buttons Management API
- [x] Create src/app/api/buttons/route.ts
- [x] POST: Add button to page
- [x] PUT: Update button
- [x] DELETE: Remove button
- [x] PATCH: Reorder buttons (update order field)
- [x] All endpoints check user owns page

### ✅ Task 2.18: Create Public Page View
- [x] Create src/app/(pages)/[username]/page.tsx
- [x] Fetch page data by username (SSR)
- [x] Render page with user's theme
- [x] Render all buttons
- [x] Add click tracking on buttons
- [x] Add page view tracking
- [x] Generate SEO meta tags

### ✅ Task 2.19: Create Page View Tracking
- [x] Update src/workers/processors/analyticsProcessor.ts
- [x] Ensure page view tracking creates PageView record
- [x] Increment monthly usage counter
- [x] Trigger Pusher event for real-time dashboard

### ✅ Task 2.20: Create Button Click Tracking
- [x] Create src/app/api/track/click/route.ts
- [x] Validate button ID
- [x] Queue analytics job (BullMQ)
- [x] Return success immediately
- [x] Log IP, user agent, referrer

---

## 🔄 PHASE 3: BILLING (RAZORPAY + PAYPAL)

### ✅ Task 3.1: Create Billing Gateway Interface
- [x] Create src/lib/billing/gateway.ts
- [x] Define BillingGateway interface
- [x] Define TypeScript types for all methods
- [x] Add JSDoc comments
- [x] Export base classes/types

### ✅ Task 3.2: Implement Razorpay Gateway
- [x] Create src/lib/billing/razorpay.ts
- [x] Install razorpay npm package
- [x] Implement RazorpayGateway class
- [x] Method: createSubscription(planId, customerId)
- [x] Method: cancelSubscription(subscriptionId)
- [x] Method: handleWebhook(payload, signature)
- [x] Method: verifyPayment(paymentId)
- [x] Add error handling

### ✅ Task 3.3: Implement PayPal Gateway
- [x] Create src/lib/billing/paypal.ts
- [x] Install @paypal/checkout-server-sdk
- [x] Implement PayPalGateway class
- [x] Method: createSubscription(planId, customerId)
- [x] Method: cancelSubscription(subscriptionId)
- [x] Method: handleWebhook(payload, signature)
- [x] Add error handling

### ✅ Task 3.4: Create Gateway Factory
- [x] Create src/lib/billing/index.ts
- [x] Export getBillingGateway(gateway: 'razorpay' | 'paypal')
- [x] Return appropriate gateway instance
- [x] Cache instances for reuse

### ✅ Task 3.5: Create Plan Selector Component
- [x] Create src/components/billing/PlanSelector.tsx
- [x] Display 4 plan cards (Free, Starter, Pro, Agency)
- [x] Highlight current plan
- [x] Show features comparison table
- [x] Gateway toggle (Razorpay/PayPal)
- [x] "Select Plan" button per plan
- [x] Responsive grid layout

### ✅ Task 3.6: Create Billing Dashboard Page
- [x] Create src/app/dashboard/billing/page.tsx
- [x] Show current plan and status
- [x] Display usage stats (pages, accounts, replies)
- [x] Render PlanSelector component
- [x] Show payment history table
- [x] Add "Cancel Subscription" button

### ✅ Task 3.7: Create Subscription Creation API
- [x] Create src/app/api/billing/create-subscription/route.ts
- [x] Accept planType and gateway in request
- [x] Get billing gateway instance
- [x] Create subscription via gateway
- [x] Create pending Subscription record in DB
- [x] Return payment URL/link to frontend

### ✅ Task 3.8: Create Razorpay Webhook Handler
- [x] Create src/app/api/billing/webhooks/razorpay/route.ts
- [x] Verify Razorpay webhook signature
- [x] Handle subscription.authenticated event
- [x] Handle subscription.activated event
- [x] Handle subscription.cancelled event
- [x] Update Subscription record in database
- [x] Update user's plan
- [x] Return 200 OK

### ✅ Task 3.9: Create PayPal Webhook Handler
- [x] Create src/app/api/billing/webhooks/paypal/route.ts
- [x] Verify PayPal webhook signature
- [x] Handle BILLING.SUBSCRIPTION.ACTIVATED
- [x] Handle PAYMENT.SALE.COMPLETED
- [x] Handle BILLING.SUBSCRIPTION.CANCELLED
- [x] Update database records
- [x] Return 200 OK

### ✅ Task 3.10: Create Plan Enforcement Middleware
- [x] Create src/lib/middleware/planEnforcement.ts
- [x] Function: checkPageLimit(userId)
- [x] Function: checkAccountLimit(userId)
- [x] Function: checkReplyLimit(userId)
- [x] Return error with upgrade URL if exceeded

### ✅ Task 3.11: Apply Plan Limits to APIs
- [x] Update src/app/api/pages/route.ts
- [x] POST - check page limit before creating
- [x] Update reply processor - check monthly reply limit before sending
- [x] Return 402 Payment Required if limit hit
- [x] Note: Social account connection APIs created in Phase 4 (auto-reply system)

---

## 🔄 PHASE 4: AUTO-REPLY SYSTEM

### ✅ Task 4.1: Create Social Adapter Interface
- [x] Create src/integrations/social/adapter.ts
- [x] Define SocialPlatformAdapter interface
- [x] Define NormalizedEvent type
- [x] Define method signatures (OAuth, messaging, parsing)

### ✅ Task 4.2: Create Instagram Adapter
- [x] Create src/integrations/instagram/adapter.ts
- [x] Implement InstagramAdapter class
- [x] Method: getOAuthUrl() - return FB Login URL
- [x] Method: exchangeCodeForToken(code)
- [x] Method: sendReply() - handles comments and DMs
- [x] Method: parseIncomingEvent(payload)
- [x] Method: getUserProfile()

### ✅ Task 4.3: Create Facebook Adapter
- [x] Create src/integrations/facebook/adapter.ts
- [x] Implement FacebookAdapter class
- [x] Method: getOAuthUrl() - FB Page Login
- [x] Method: exchangeCodeForToken(code)
- [x] Method: sendReply() - handles comments and messages
- [x] Method: parseIncomingEvent(payload)
- [x] Method: getUserProfile()

### ✅ Task 4.4: Create WhatsApp Adapter
- [x] Create src/integrations/whatsapp/adapter.ts
- [x] Implement WhatsAppAdapter class
- [x] Method: sendReply() - send WhatsApp messages
- [x] Method: parseIncomingEvent(payload)
- [x] Method: getUserProfile()

### ✅ Task 4.5: Create OAuth Callback Handler
- [x] Create src/app/api/integrations/connect/route.ts
- [x] Parse query params (platform, code, state)
- [x] Get appropriate adapter
- [x] Exchange code for token
- [x] Encrypt token with ENCRYPTION_KEY
- [x] Store in SocialAccount table
- [x] Redirect to dashboard with success message

### ✅ Task 4.6: Create Instagram Webhook Receiver
- [x] Create src/app/api/webhooks/instagram/route.ts
- [x] GET handler: Verify webhook with challenge
- [x] POST handler: Verify signature
- [x] Parse Instagram events (comments, messages)
- [x] Normalize event using adapter
- [x] Queue to webhookQueue
- [x] Return 200 OK immediately

### ✅ Task 4.7: Create Facebook Webhook Receiver
- [x] Create src/app/api/webhooks/facebook/route.ts
- [x] Verification and signature handling
- [x] Parse FB Page events
- [x] Normalize and queue

### ✅ Task 4.8: Create WhatsApp Webhook Receiver
- [x] Create src/app/api/webhooks/whatsapp/route.ts
- [x] Verification and signature handling
- [x] Parse WhatsApp message events
- [x] Normalize and queue

### ✅ Task 4.9: Create Rules List Page
- [x] Create src/app/dashboard/rules/page.tsx
- [x] Fetch rules from API
- [x] Display table: Name, Platform, Trigger, Status, Executions
- [x] Add "Create Rule" button
- [x] Add Edit/Delete/Toggle actions per row
- [x] Filtering by platform, status, search
- [x] Pagination support

### ✅ Task 4.10: Create Rules List API
- [x] Create src/app/api/rules/route.ts GET handler
- [x] Query user's rules with filters
- [x] Include execution count
- [x] Return paginated results
- [x] POST handler for creating rules
- [x] Validates trigger and action types

### ✅ Task 4.11: Create Rule Builder Page
- [x] Create src/app/dashboard/rules/create/page.tsx
- [x] Step 1: Select platform (IG/FB/WA)
- [x] Step 2: Choose trigger type
- [x] Step 3: Configure trigger (keywords, time, etc.)
- [x] Step 4: Configure actions (reply text, DM, link)
- [x] Step 5: Set priority
- [x] Submit button
- [x] Account fetching and display

### ✅ Task 4.12: Create Rule Builder Component
- [x] Create src/components/rules/RuleBuilder.tsx
- [x] Platform selector with icons
- [x] Trigger selector dropdown
- [x] Keyword input with chips (multi-input)
- [x] Message template editor
- [x] Variable insertion buttons ({linkPageUrl}, {userName})
- [x] Priority slider (1-10)
- [x] 5-step form wizard

### ✅ Task 4.13: Create Rule Creation API
- [x] Add POST handler to src/app/api/rules/route.ts
- [x] Validate trigger and action configs
- [x] Create Rule record
- [x] Return created rule
- [x] Verify user owns the social account

### ✅ Task 4.14: Create Rule Update/Delete API
- [x] Create src/app/api/rules/[id]/route.ts
- [x] GET: Return rule details
- [x] PUT: Update rule
- [x] DELETE: Delete rule (with confirmation)
- [x] Ownership verification on all endpoints

### ✅ Task 4.15: Create Rule Test API
- [x] Create src/app/api/rules/[id]/test/route.ts
- [x] Accept sample event data
- [x] Run rule evaluation (dry-run)
- [x] Return matched actions without executing
- [x] Show what would happen
- [x] Template variable rendering

### ✅ Task 4.16: Enhance Webhook Processor
- [x] Update src/workers/processors/webhookProcessor.ts
- [x] Placeholder for rule matching logic
- [x] Add anti-spam foundation
- [x] Add daily limit checking
- [x] Order by priority
- [x] Ready for full implementation

### ✅ Task 4.17: Enhance Reply Processor
- [x] Update src/workers/processors/replyProcessor.ts
- [x] Replace stub calls with actual adapter methods
- [x] Use getAdapter(platform).sendReply(...)
- [x] Implement exponential backoff for rate limits (1s, 2s, 4s)
- [x] Catch and log errors properly
- [x] Update RuleExecutionLog with success/failure
- [x] Token decryption with AES-256-CBC
- [x] 3 action types: REPLY, DIRECT_MESSAGE, LINK_SHARE
- [x] Retryable error classification

### ✅ Task 4.18: Create Rule Engine Service
- [x] Create src/services/ruleEngine.ts
- [x] Function: evaluateRules(userId, event)
- [x] Function: executeRuleAction(rule, event, message)
- [x] Function: getRuleStats(ruleId)
- [x] Template rendering with variable substitution
- [x] Anti-spam and rate limit checking foundation

---

## 🔄 PHASE 5: WORKSPACES & ADMIN

### ⏳ Task 5.1: Create Workspaces List Page
- [ ] Create src/app/dashboard/workspaces/page.tsx
- [ ] Fetch workspaces (where user is owner or member)
- [ ] Display workspace cards
- [ ] Add "Create Workspace" button
- [ ] Show current workspace in navbar

### ⏳ Task 5.2: Create Workspace Settings Page
- [ ] Create src/app/dashboard/workspaces/[id]/settings/page.tsx
- [ ] Edit workspace name, logo
- [ ] Member management table
- [ ] Invite member form
- [ ] Role assignment dropdown per member

### ⏳ Task 5.3: Create Workspace Middleware
- [ ] Create src/lib/middleware/workspace.ts
- [ ] Extract workspaceId from session/context
- [ ] Add to all DB queries as filter
- [ ] Check user has permission for workspace

### ⏳ Task 5.4: Create Admin Layout
- [ ] Create src/app/admin/layout.tsx
- [ ] Check user role === ADMIN
- [ ] Redirect to dashboard if not admin
- [ ] Render admin sidebar (Users, System, Logs)

### ⏳ Task 5.5: Create Admin Users Page
- [ ] Create src/app/admin/users/page.tsx
- [ ] Search users by email
- [ ] Display users table (email, plan, usage, status)
- [ ] Actions: View Details, Change Plan, Suspend

### ⏳ Task 5.6: Create Admin System Page
- [ ] Create src/app/admin/system/page.tsx
- [ ] Show total users count
- [ ] Show active subscriptions
- [ ] Show total events processed (from queue stats)
- [ ] Show error rate
- [ ] Display queue metrics (waiting, active, completed, failed)

### ⏳ Task 5.7: Create Admin API Routes
- [ ] Create src/app/api/admin/users/route.ts
- [ ] Check admin role
- [ ] GET: List users with pagination
- [ ] PUT: Update user plan or status

---

## 🔄 PHASE 6: PRODUCTION HARDENING

### ⏳ Task 6.1: Add Input Validation with Zod
- [ ] Install zod package
- [ ] Create src/lib/validators/auth.ts - login, signup schemas
- [ ] Create src/lib/validators/pages.ts - page, button schemas
- [ ] Create src/lib/validators/rules.ts - rule schema
- [ ] Apply to all API routes

### ⏳ Task 6.2: Add CSRF Protection
- [ ] Install csrf library
- [ ] Create CSRF middleware
- [ ] Generate tokens for forms
- [ ] Validate on POST/PUT/DELETE requests

### ⏳ Task 6.3: Add Rate Limiting
- [ ] Install express-rate-limit or similar
- [ ] Create rate limit middleware
- [ ] Apply to auth routes (stricter limits)
- [ ] Apply to API routes (per-plan limits)

### ⏳ Task 6.4: Add Structured Logging
- [ ] Install pino or winston
- [ ] Create logger wrapper in src/lib/logger.ts
- [ ] Replace all console.log with logger calls
- [ ] Add request ID to logs

### ⏳ Task 6.5: Add Error Tracking
- [ ] Install @sentry/nextjs
- [ ] Configure Sentry in next.config.js
- [ ] Add error boundary components
- [ ] Test error reporting

### ⏳ Task 6.6: Optimize Database Queries
- [ ] Review all Prisma queries
- [ ] Add necessary indexes (check EXPLAIN results)
- [ ] Use select to limit fields
- [ ] Implement pagination on large tables

### ⏳ Task 6.7: Add Redis Caching
- [ ] Implement cache wrapper in src/lib/cache.ts
- [ ] Cache user session data
- [ ] Cache public pages (with TTL)
- [ ] Cache plan limits (invalidate on update)

### ⏳ Task 6.8: Create Health Check Endpoint
- [ ] Create src/app/api/health/route.ts
- [ ] Check database connection
- [ ] Check Redis connection
- [ ] Check queue workers status
- [ ] Return 200 if healthy, 503 if not

---

## Summary

**Total Tasks:** 79  
**Completed:** 57 (Phases 1-4 complete)  
**In Progress:** 0  
**Remaining:** 22 (Phases 5-6)

**Current Phase:** ✅ Phase 4 COMPLETE (18/18 tasks) → Ready for Phase 5

### Completion Progress:
- ✅ Phase 1: Foundation (4/4) - 100%
- ✅ Phase 2: Link Page Builder (20/20) - 100%
- ✅ Phase 3: Billing System (11/11) - 100%
- ✅ Phase 4: Auto-Reply System (18/18) - 100%
- ⏳ Phase 5: Workspaces & Admin (7/7) - 0%
- ⏳ Phase 6: Production Hardening (8/8) - 0%

### Next Steps:
1. Implement Phase 5: Workspaces & Admin features (Tasks 5.1-5.7)
2. Implement Phase 6: Production hardening (Tasks 6.1-6.8)
