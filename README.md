# 🔗 ReplyLink - Complete SaaS Platform

A production-ready SaaS application combining **Link-in-Bio** pages with **Auto-Reply** automation for Instagram, Facebook, and WhatsApp.

## 🚀 Features

### ✨ Core Functionality
- **Link-in-Bio Pages**: Create beautiful, customizable landing pages
- **Auto-Reply Engine**: Intelligent auto-replies for Instagram, Facebook & WhatsApp
- **Real-Time Dashboard**: Live analytics and activity monitoring
- **Multi-Platform Support**: Unified management for all social accounts
- **Advanced Analytics**: Detailed insights into engagement and performance
- **Subscription Management**: Tiered plans with usage tracking

### 📊 Dashboard Features
- **Live Metrics**: Real-time page views, clicks, and reply counts
- **Interactive Charts**: Page views trends, button clicks, reply distribution
- **Platform Overview**: Per-platform statistics and top rules
- **Activity Feed**: Real-time stream of events with WebSockets
- **Date Range Filtering**: 7 or 30-day analytics

### 🎯 Auto-Reply Rules
- Comment keyword triggers
- DM keyword triggers
- First-time DM responses
- Out-of-hours messages
- Custom rule priorities
- Platform-specific actions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching/Queues**: Redis + BullMQ
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Charts**: Recharts
- **Real-Time**: Pusher
- **Authentication**: JWT + HTTP-only cookies
- **Payment**: Stripe / Razorpay
- **APIs**: Meta Graph API (Instagram, Facebook, WhatsApp)

/status - Interactive dashboard with expandable phase details
/features - Feature matrix by category
/api-docs - Complete API documentation
/api/status/phases - JSON API for programmatic access
## 📁 Project Structure

```
replylink/
├── prisma/
│   └── schema.prisma           # Complete database schema
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── analytics/     # Analytics endpoints
│   │   │   ├── activity/      # Activity feed
│   │   │   └── dashboard/     # Dashboard stats
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── auth/              # Authentication pages (TODO)
│   │   ├── pages/             # Link pages (TODO)
│   │   ├── rules/             # Auto-reply rules (TODO)
│   │   ├── settings/          # Settings pages (TODO)
│   │   └── admin/             # Admin panel (TODO)
│   ├── components/            # React components
│   │   └── dashboard/         # Dashboard-specific components
│   ├── lib/                   # Core utilities
│   │   ├── prisma.ts         # Prisma client
│   │   ├── redis.ts          # Redis client
│   │   ├── queues.ts         # BullMQ queues
│   │   ├── pusher.ts         # Real-time events
│   │   ├── auth.ts           # Authentication
│   │   └── utils.ts          # Helpers
│   ├── services/             # Business logic (TODO)
│   ├── workers/              # Background workers
│   │   ├── index.ts          # Worker setup
│   │   └── processors/       # Job processors
│   └── types/                # TypeScript types (TODO)
└── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Meta Developer Account
- Pusher Account
- Stripe Account (optional)

### 1. Installation

```bash
cd replylink
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_SECRET`: Secret for JWT
- `NEXT_PUBLIC_PUSHER_APP_KEY`: Pusher app key
- `PUSHER_SECRET`: Pusher secret
- `META_APP_ID`: Facebook/Instagram app ID
- `META_APP_SECRET`: Facebook/Instagram app secret
- `STRIPE_SECRET_KEY`: Stripe secret key

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### 4. Start Redis

```bash
# Using Docker
docker run -p 6379:6379 redis:alpine

# Or install locally and start
redis-server
```

### 5. Start Background Workers

```bash
npm run worker
```

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎨 Key Components

### Dashboard
- **StatsCard**: Real-time metric cards with trend indicators
- **PageViewsChart**: Line chart showing page view trends
- **ButtonClicksChart**: Bar chart for button click distribution
- **ReplyUsageChart**: Pie chart for platform reply distribution
- **PlatformStats**: Platform-specific statistics overview
- **LiveActivityFeed**: Real-time activity stream with Pusher

### Workers
- **Reply Processor**: Handles auto-reply execution
- **Analytics Processor**: Tracks events and updates metrics
- **Webhook Processor**: Processes incoming social media webhooks
- **Notification Processor**: Sends notifications to users

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token generated and stored in HTTP-only cookie
3. Session created in database
4. Protected routes check session validity
5. Token refresh on expiration

## 📡 Real-Time Updates

Using **Pusher** for WebSocket-based real-time features:

### Events
- `page-view`: New page view
- `button-click`: Button clicked
- `reply-sent`: Auto-reply sent
- `rule-triggered`: Rule activated
- `account-connected`: Social account connected

### Channels
- `user-{userId}`: User-specific events
- `page-{pageId}`: Page-specific events
- `workspace-{workspaceId}`: Team workspace events

## 🔄 Background Job Queues

### Reply Queue
- Processes auto-reply jobs
- Executes rule actions
- Logs execution results
- Updates usage metrics

### Analytics Queue
- Tracks page views
- Tracks button clicks
- Updates monthly usage
- Triggers real-time events

### Webhook Queue
- Processes platform webhooks
- Matches trigger rules
- Queues reply jobs

### Notification Queue
- Sends email notifications
- Push notifications
- In-app notifications

## 💳 Subscription Plans

| Plan | Pages | Accounts | Replies/Month | Custom Domain | White-Label |
|------|-------|----------|---------------|---------------|-------------|
| FREE | 1 | 1 | 200 | ❌ | ❌ |
| STARTER | 3 | 3 | 3,000 | ❌ | ❌ |
| PRO | 10 | 10 | 15,000 | ✅ | ❌ |
| AGENCY | 50 | 30 | 60,000 | ✅ | ✅ |

## 🎯 Next Steps (TODO)

### High Priority
1. **Authentication Pages**: Login, signup, forgot password
2. **Link Page Builder**: Create and edit link pages
3. **Rule Builder UI**: Visual rule creation interface
4. **Social OAuth**: Connect Instagram, Facebook, WhatsApp
5. **Webhook Handlers**: Receive platform events
6. **Payment Integration**: Stripe/Razorpay checkout

### Medium Priority
7. **Admin Panel**: User management, system metrics
8. **Email Templates**: Transactional emails
9. **Custom Domains**: CNAME setup for Pro+ plans
10. **API Tokens**: Public API for developers
11. **Workspace/Teams**: Agency plan collaboration

### Low Priority
12. **White-Label Branding**: Custom branding for Agency
13. **A/B Testing**: Test different page variants
14. **Advanced Analytics**: Conversion funnels, cohorts
15. **Mobile App**: React Native companion app

## 📚 API Documentation

### Dashboard Stats
```
GET /api/dashboard/stats?days=7
```

### Analytics
```
GET /api/analytics/page-views?days=7
GET /api/analytics/button-clicks?days=7
GET /api/analytics/reply-usage
GET /api/analytics/platform-stats
```

### Activity
```
GET /api/activity/recent
```

## 🧪 Testing

```bash
# Run tests (TODO)
npm test

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended for Next.js)
```bash
vercel
```

### Docker
```bash
docker build -t replylink .
docker run -p 3000:3000 replylink
```

### Environment Variables
Ensure all production environment variables are set in your deployment platform.

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

## 💬 Support

- Email: support@replylink.io
- Documentation: https://docs.replylink.io
- Discord: https://discord.gg/replylink

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
