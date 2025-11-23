# ReplyLink - Production Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- PostgreSQL database (managed or self-hosted)
- Redis instance (Upstash, Redis Cloud, or self-hosted)
- Domain name with DNS access
- SSL certificate (Let's Encrypt recommended)

## Environment Variables

Create a `.env.production` file with the following:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/replylink"

# Redis
REDIS_URL="redis://host:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Sentry (Error Tracking)
SENTRY_DSN="https://your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn"

# Stripe (Payments)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Meta/Facebook APIs
META_APP_ID="your-app-id"
META_APP_SECRET="your-app-secret"
META_WEBHOOK_VERIFY_TOKEN="your-verify-token"

# Pusher (Real-time)
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"

# App Config
NODE_ENV="production"
LOG_LEVEL="INFO"
```

## Deployment Steps

### 1. Build Docker Image

```bash
docker build -t replylink:latest .
```

### 2. Run Database Migrations

```bash
docker run --rm \
  --env-file .env.production \
  replylink:latest \
  npx prisma migrate deploy
```

### 3. Start Application

**Using Docker Compose:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Using Docker Run:**

```bash
docker run -d \
  --name replylink \
  --env-file .env.production \
  -p 3000:3000 \
  replylink:latest
```

### 4. Set Up Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Configure SSL with Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Health Checks

Monitor application health:

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-23T12:30:00.000Z",
  "checks": {
    "database": { "status": "up", "latency": 5 },
    "redis": { "status": "up", "latency": 2 },
    "queue": { "status": "up", "latency": 1 }
  },
  "uptime": 86400
}
```

## Monitoring & Logging

### View Logs

```bash
docker logs -f replylink
```

### Sentry Dashboard

Monitor errors at: https://sentry.io/organizations/your-org/issues/

### Database Monitoring

```bash
# Check active connections
docker exec -it postgres psql -U user -d replylink -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
docker exec -it postgres psql -U user -d replylink -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Backup & Recovery

### Database Backup

```bash
# Automated daily backup
docker exec postgres pg_dump -U user replylink > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i postgres psql -U user replylink < backup_20251123.sql
```

### Redis Backup

```bash
# Save snapshot
docker exec redis redis-cli BGSAVE

# Copy RDB file
docker cp redis:/data/dump.rdb ./redis_backup_$(date +%Y%m%d).rdb
```

## Scaling

### Horizontal Scaling

Use a load balancer (AWS ALB, Nginx) to distribute traffic across multiple instances:

```bash
# Start multiple instances
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Database Connection Pooling

Prisma automatically handles connection pooling. Adjust in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 20
}
```

## Security Checklist

- [x] HTTPS enabled with valid SSL certificate
- [x] Environment variables secured (not in version control)
- [x] CSRF protection enabled
- [x] Rate limiting configured
- [x] Security headers set (HSTS, XSS Protection, etc.)
- [x] Database credentials rotated regularly
- [x] API tokens encrypted at rest
- [x] Sentry error tracking active
- [x] Regular security updates applied

## Troubleshooting

### Application Won't Start

1. Check logs: `docker logs replylink`
2. Verify environment variables
3. Test database connection: `docker exec replylink npx prisma db pull`

### High Memory Usage

1. Check for memory leaks in logs
2. Restart application: `docker restart replylink`
3. Increase container memory limit in `docker-compose.yml`

### Slow Performance

1. Check `/api/health` endpoint for degraded services
2. Review Sentry for performance issues
3. Analyze database slow queries
4. Check Redis cache hit rate

## Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild image
docker build -t replylink:latest .

# Stop old container
docker stop replylink

# Start new container
docker run -d --name replylink --env-file .env.production -p 3000:3000 replylink:latest

# Run migrations if needed
docker exec replylink npx prisma migrate deploy
```

### Database Maintenance

```bash
# Vacuum database
docker exec postgres psql -U user -d replylink -c "VACUUM ANALYZE;"

# Reindex
docker exec postgres psql -U user -d replylink -c "REINDEX DATABASE replylink;"
```

## Support

For issues, contact: support@replylink.com
Documentation: https://docs.replylink.com
