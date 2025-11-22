# 📡 ReplyLink API Documentation

Complete API reference for ReplyLink platform.

## 🔐 Authentication

All API requests (except public endpoints) require authentication via JWT token.

### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clx123456",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 📊 Dashboard Endpoints

### Get Dashboard Stats
```http
GET /api/dashboard/stats?days=7
```

**Query Parameters:**
- `days` (optional): Number of days (7 or 30, default: 7)

**Response:**
```json
{
  "pageViews": 1250,
  "buttonClicks": 456,
  "repliesSent": 189,
  "remainingReplies": 14811
}
```

## 📈 Analytics Endpoints

### Page Views
```http
GET /api/analytics/page-views?days=7
```

**Response:**
```json
{
  "data": [
    { "name": "Mon", "views": 234 },
    { "name": "Tue", "views": 345 },
    { "name": "Wed", "views": 456 }
  ]
}
```

### Button Clicks
```http
GET /api/analytics/button-clicks?days=7
```

**Response:**
```json
{
  "data": [
    { "name": "Instagram", "clicks": 245 },
    { "name": "Website", "clicks": 189 },
    { "name": "WhatsApp", "clicks": 167 }
  ]
}
```

### Reply Usage
```http
GET /api/analytics/reply-usage
```

**Response:**
```json
{
  "data": [
    { "name": "Instagram", "value": 456 },
    { "name": "Facebook", "value": 289 },
    { "name": "WhatsApp", "value": 178 }
  ]
}
```

### Platform Stats
```http
GET /api/analytics/platform-stats
```

**Response:**
```json
{
  "data": [
    {
      "platform": "Instagram",
      "accounts": 3,
      "replies": 456,
      "topRule": "DM Auto-Reply"
    }
  ]
}
```

## 🔔 Activity Endpoints

### Recent Activity
```http
GET /api/activity/recent
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "type": "reply_sent",
      "message": "Auto-replied to Instagram comment",
      "platform": "INSTAGRAM",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 📄 Link Pages (TODO)

### List Pages
```http
GET /api/pages
```

### Get Page
```http
GET /api/pages/:id
```

### Create Page
```http
POST /api/pages
```

**Request Body:**
```json
{
  "username": "johndoe",
  "title": "John Doe",
  "bio": "Digital Creator & Entrepreneur",
  "avatar": "https://example.com/avatar.jpg",
  "theme": {
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "buttonColor": "#8b5cf6"
  }
}
```

### Update Page
```http
PUT /api/pages/:id
```

### Delete Page
```http
DELETE /api/pages/:id
```

## 🔘 Buttons (TODO)

### Create Button
```http
POST /api/buttons
```

**Request Body:**
```json
{
  "pageId": "clx123456",
  "type": "URL",
  "label": "Visit My Website",
  "value": "https://example.com",
  "icon": "globe",
  "order": 0
}
```

### Update Button
```http
PUT /api/buttons/:id
```

### Delete Button
```http
DELETE /api/buttons/:id
```

## 🤖 Rules (TODO)

### List Rules
```http
GET /api/rules
```

### Create Rule
```http
POST /api/rules
```

**Request Body:**
```json
{
  "accountId": "clx123456",
  "name": "Instagram DM Auto-Reply",
  "triggerType": "DM_KEYWORD",
  "triggerConfig": {
    "keywords": ["hello", "hi", "info"]
  },
  "actionType": "SEND_DM",
  "actionConfig": {
    "message": "Thanks for reaching out! Here's my link: {{link}}"
  },
  "priority": 1
}
```

### Update Rule
```http
PUT /api/rules/:id
```

### Delete Rule
```http
DELETE /api/rules/:id
```

### Test Rule
```http
POST /api/rules/:id/test
```

## 🔗 Social Accounts (TODO)

### List Accounts
```http
GET /api/accounts
```

### Connect Instagram
```http
POST /api/accounts/connect/instagram
```

**Request Body:**
```json
{
  "code": "oauth_code_from_instagram"
}
```

### Connect Facebook
```http
POST /api/accounts/connect/facebook
```

### Connect WhatsApp
```http
POST /api/accounts/connect/whatsapp
```

**Request Body:**
```json
{
  "phoneNumberId": "123456789",
  "businessAccountId": "987654321",
  "accessToken": "long_lived_token"
}
```

### Disconnect Account
```http
DELETE /api/accounts/:id
```

## 🪝 Webhooks

### Instagram Webhook
```http
GET /api/webhooks/instagram  # Verification
POST /api/webhooks/instagram # Events
```

### Facebook Webhook
```http
GET /api/webhooks/facebook
POST /api/webhooks/facebook
```

### WhatsApp Webhook
```http
GET /api/webhooks/whatsapp
POST /api/webhooks/whatsapp
```

## 💳 Stripe (TODO)

### Create Checkout Session
```http
POST /api/stripe/checkout
```

**Request Body:**
```json
{
  "planType": "PRO",
  "successUrl": "https://app.replylink.io/dashboard",
  "cancelUrl": "https://app.replylink.io/pricing"
}
```

### Stripe Webhook
```http
POST /api/stripe/webhook
```

## 📊 Real-Time Events (Pusher)

### Subscribe to User Channel
```javascript
const pusher = new Pusher(PUSHER_KEY, {
  cluster: 'us2'
})

const channel = pusher.subscribe('user-{userId}')

channel.bind('page-view', (data) => {
  console.log('New page view:', data)
})

channel.bind('button-click', (data) => {
  console.log('Button clicked:', data)
})

channel.bind('reply-sent', (data) => {
  console.log('Reply sent:', data)
})
```

### Event Types
- `page-view` - New page view
- `button-click` - Button clicked
- `reply-sent` - Auto-reply sent
- `rule-triggered` - Rule activated
- `account-connected` - Social account connected
- `subscription-updated` - Subscription changed

## 🚨 Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

### Common Error Codes
- `INVALID_CREDENTIALS` - Login failed
- `UNAUTHORIZED` - Missing or invalid token
- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PLAN_LIMIT_EXCEEDED` - Plan limit reached
- `ACCOUNT_NOT_CONNECTED` - Social account not connected

## 🔒 Rate Limiting

Rate limits apply per user:

- **Free Plan**: 60 requests/minute
- **Starter Plan**: 120 requests/minute
- **Pro Plan**: 300 requests/minute
- **Agency Plan**: 600 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642435200
```

## 📝 Pagination

List endpoints support pagination:

```http
GET /api/pages?page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

## 🔍 Filtering & Sorting

```http
GET /api/rules?platform=INSTAGRAM&isActive=true&sort=-createdAt
```

Query parameters:
- `platform` - Filter by platform
- `isActive` - Filter by status
- `sort` - Sort field (prefix with `-` for descending)

## 📚 SDKs & Tools

### JavaScript/TypeScript
```bash
npm install @replylink/sdk
```

```typescript
import { ReplyLink } from '@replylink/sdk'

const client = new ReplyLink('your_api_key')

const stats = await client.dashboard.getStats({ days: 7 })
```

### Python
```bash
pip install replylink
```

```python
from replylink import ReplyLink

client = ReplyLink(api_key='your_api_key')
stats = client.dashboard.get_stats(days=7)
```

## 🧪 Testing

### Test API with cURL
```bash
# Login
curl -X POST https://api.replylink.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get dashboard stats
curl https://api.replylink.io/api/dashboard/stats?days=7 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Postman Collection
Download our Postman collection: [ReplyLink API](https://postman.com/replylink)

---

**Base URL**: `https://api.replylink.io`  
**Version**: v1  
**Documentation**: https://docs.replylink.io  
**Support**: api@replylink.io
