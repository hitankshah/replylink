# ⚡ ReplyLink Quick Start Guide

Get ReplyLink running locally in **5 minutes**!

## 🎯 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** 18+ ([Download](https://nodejs.org))
- ✅ **PostgreSQL** database ([Supabase Free Tier](https://supabase.com) recommended)
- ✅ **Redis** ([Upstash Free Tier](https://upstash.com) recommended)
- ✅ **Git** ([Download](https://git-scm.com))

## 📦 Step 1: Clone & Install

```bash
# Navigate to project directory
cd replylink

# Install dependencies
npm install

# This will install:
# - Next.js 14
# - Prisma
# - BullMQ & Redis
# - Tailwind CSS
# - All other dependencies (~2-3 minutes)
```

## 🔧 Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Open .env in your editor
# Update these REQUIRED variables:
```

**Minimum Required Configuration:**

```env
# 1. Database (Get from Supabase or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/replylink"

# 2. Redis (Get from Upstash or local Redis)
REDIS_URL="redis://localhost:6379"

# 3. Authentication Secret (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
JWT_SECRET="your-jwt-secret-key-min-32-chars"

# 4. App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Optional (for full functionality):**

```env
# Pusher (Create free account at pusher.com)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"

# Meta/Facebook (Create app at developers.facebook.com)
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"

# Stripe (Get from stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 🗄️ Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npm run db:push

# ✅ This creates all tables, indexes, and relationships!

# Optional: Open Prisma Studio to view your database
npm run db:studio
# Visit http://localhost:5555
```

## 🚀 Step 4: Start Development Server

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# ✅ App running at http://localhost:3000
```

```bash
# Terminal 2: Start background workers (optional for now)
npm run worker

# ✅ Workers processing jobs
```

## 🎉 Step 5: Visit the Application

Open your browser to:

- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

## 🧪 Quick Test

1. **Open the Dashboard**: http://localhost:3000/dashboard
2. You should see:
   - ✅ Stats cards with numbers
   - ✅ Charts rendering
   - ✅ Live activity feed
   - ✅ Beautiful UI with gradients

## 🔍 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
```bash
# Solution: Generate Prisma client
npx prisma generate
```

### Issue: "Database connection failed"
```bash
# Solution: Check your DATABASE_URL
# Make sure PostgreSQL is running
# Test connection:
npx prisma db push
```

### Issue: "Redis connection error"
```bash
# Solution: Make sure Redis is running
# If using Docker:
docker run -p 6379:6379 redis:alpine

# Or install locally and start:
redis-server
```

### Issue: "Module not found" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Charts not rendering
```bash
# Recharts needs window object
# Make sure you're using 'use client' directive
# Already configured in our components ✅
```

## 📚 What You Have Now

### ✅ Working Features

1. **Beautiful Landing Page**
   - Premium design with gradients
   - Feature showcase
   - Call-to-action sections

2. **Dynamic Dashboard**
   - Real-time statistics
   - Interactive charts
   - Live activity feed
   - Platform overview

3. **Complete Backend**
   - Prisma ORM with full schema
   - Redis caching & queues
   - Background workers
   - API endpoints

4. **Database Models**
   - Users & Authentication
   - Link Pages & Buttons
   - Social Accounts
   - Auto-Reply Rules
   - Analytics tracking
   - Subscription management

### 🚧 TODO (Next Steps)

1. **Authentication Pages**
   - Login/Signup forms
   - Password reset

2. **Link Page Builder**
   - Create/edit pages
   - Add buttons
   - Customize themes

3. **Rule Builder**
   - Create auto-reply rules
   - Visual trigger/action setup

4. **Social OAuth**
   - Connect Instagram
   - Connect Facebook
   - Connect WhatsApp

## 🎯 Next Development Steps

### Week 1: Authentication
1. Create login page (`src/app/auth/login/page.tsx`)
2. Create signup page (`src/app/auth/signup/page.tsx`)
3. Implement auth API routes
4. Add protected route middleware

### Week 2: Link Pages
1. Create page builder UI
2. Implement page CRUD APIs
3. Create public page view
4. Add analytics tracking

### Week 3: Auto-Reply
1. Build rule creation UI
2. Implement social OAuth flows
3. Set up webhook handlers
4. Test end-to-end flow

## 💡 Tips for Development

### Use Prisma Studio
```bash
npm run db:studio
```
Best way to view and edit your database during development!

### Hot Reload
Next.js has built-in hot reload. Just save your files and see changes instantly!

### TypeScript Autocomplete
Thanks to TypeScript and Prisma, you get full autocomplete for:
- Database models
- API types
- Component props

### Real-Time Testing
If you configured Pusher, you can test real-time features:
1. Open 2 browser windows
2. Trigger an event in one
3. See it update in the other!

## 📖 Documentation

- **README.md** - Project overview
- **STRUCTURE.md** - Complete file structure
- **API.md** - API documentation
- **DEPLOYMENT.md** - Deployment guide

## 🆘 Get Help

- **Issues**: Check existing issues or create new one
- **Documentation**: Read the detailed guides
- **Community**: Join our Discord (coming soon)

## 🎊 You're Ready!

You now have a **fully functional SaaS foundation**!

Start building your features and customize to your needs.

---

**Happy Coding! 🚀**

Need help? Check the README or reach out to support@replylink.io
