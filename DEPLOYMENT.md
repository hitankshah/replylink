# 🚀 ReplyLink Deployment Guide

Complete guide for deploying ReplyLink to production.

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] PostgreSQL database (Supabase, Railway, or self-hosted)
- [ ] Redis instance (Upstash, Railway, or self-hosted)
- [ ] Pusher account
- [ ] Meta Developer App (for Instagram/Facebook/WhatsApp)
- [ ] Stripe account (for payments)
- [ ] Domain name (optional)

### Environment Variables
Ensure all required environment variables are set in your deployment platform.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Link Project
```bash
cd replylink
vercel link
```

#### Step 3: Set Environment Variables
```bash
# Add all environment variables from .env.example
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_PUSHER_APP_KEY
vercel env add PUSHER_SECRET
# ... add all other variables
```

#### Step 4: Deploy
```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

#### Important Notes for Vercel:
- Background workers cannot run on Vercel
- Deploy workers separately (see below)
- Use Vercel's built-in PostgreSQL or external DB
- Redis can be Upstash (official Vercel integration)

### Option 2: Railway

#### Step 1: Install Railway CLI
```bash
npm i -g @railway/cli
```

#### Step 2: Login & Initialize
```bash
railway login
railway init
```

#### Step 3: Add PostgreSQL & Redis
```bash
railway add --plugin postgresql
railway add --plugin redis
```

#### Step 4: Set Environment Variables
```bash
# Variables are automatically set from Railway plugins
# Add other custom variables in Railway dashboard
```

#### Step 5: Deploy
```bash
railway up
```

#### Important Notes for Railway:
- Can run both app and workers in same project
- Use Railway's PostgreSQL and Redis plugins
- Configure worker as separate service

### Option 3: Docker + Any VPS

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build app
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  worker:
    build: .
    command: npm run worker
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=replylink
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Step 3: Deploy
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🔧 Database Setup (All Platforms)

### Run Migrations
```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### Seed Initial Data (Optional)
```bash
npm run db:seed
```

## ⚙️ Background Workers

### Separate Worker Deployment

If your platform doesn't support long-running processes (like Vercel), deploy workers separately:

#### Option A: Separate Railway Service
1. Create new Railway service
2. Use same codebase
3. Set start command to `npm run worker`
4. Link to same DATABASE_URL and REDIS_URL

#### Option B: Separate VPS/Docker Container
```bash
# On separate server
git clone <repo>
cd replylink
npm install
npm run worker
```

#### Option C: Serverless Workers (Cloudflare Workers, AWS Lambda)
- Convert workers to serverless functions
- Trigger via HTTP endpoints or scheduled jobs

## 🔐 Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Use strong passwords
- [ ] Enable 2FA for all services
- [ ] Audit environment variables

## 📊 Monitoring & Logging

### Recommended Tools
- **Application Monitoring**: Sentry, LogRocket
- **Performance**: Vercel Analytics, New Relic
- **Logging**: Papertrail, Logtail
- **Uptime**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry

### Setup Example (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🌍 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS (A or CNAME record)
4. SSL is automatic

### Railway
1. Go to Service Settings → Networking
2. Add custom domain
3. Configure DNS
4. SSL is automatic

### Manual (VPS)
1. Point domain A record to server IP
2. Install Nginx/Caddy
3. Configure reverse proxy
4. Install SSL with Let's Encrypt

## 📝 Post-Deployment

### Verify Deployment
- [ ] Visit the deployed URL
- [ ] Test login/signup
- [ ] Check dashboard loads
- [ ] Verify real-time updates work
- [ ] Test API endpoints
- [ ] Check background workers are running
- [ ] Verify webhooks receive events

### Monitor Performance
```bash
# Check worker status
pm2 status  # if using PM2

# Check logs
docker-compose logs -f worker

# Database queries
npm run db:studio
```

## 🆘 Troubleshooting

### Common Issues

#### Workers not processing jobs
- Check Redis connection
- Verify worker process is running
- Check worker logs for errors

#### Database connection failed
- Verify DATABASE_URL is correct
- Check database is accessible from deployment
- Ensure Prisma client is generated

#### Real-time updates not working
- Verify Pusher credentials
- Check browser console for errors
- Ensure CORS is configured

#### Build failures
- Check all dependencies are installed
- Verify TypeScript has no errors
- Ensure environment variables are set

## 📮 Support

For deployment issues:
- Check logs first
- Review environment variables
- Test locally with production settings
- Contact support: deploy@replylink.io

---

**Remember**: Always test in staging before deploying to production!
