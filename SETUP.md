# ReplyLink - Quick Setup Guide

## Step 1: Create .env File

Create a file named `.env` in the root directory with this content:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://postgres:password@localhost:5432/replylink"

# Auth (REQUIRED)
JWT_SECRET="your-super-secret-jwt-key-change-this-now"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-this-now"

# App URL (REQUIRED)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional (can add later)
REDIS_URL="redis://localhost:6379"
PUSHER_APP_ID=""
PUSHER_SECRET=""
NEXT_PUBLIC_PUSHER_APP_KEY=""
PUSHER_CLUSTER="us2"
```

## Step 2: Setup Database

### Option A: Use Local PostgreSQL
```bash
# Install PostgreSQL if you don't have it
# Then create database:
createdb replylink
```

### Option B: Use Free Cloud Database (Recommended for testing)
1. Go to https://neon.tech (free PostgreSQL)
2. Create account
3. Create new project
4. Copy connection string
5. Paste in `.env` as `DATABASE_URL`

## Step 3: Run Migrations

```bash
npm run db:push
```

## Step 4: Start the App

```bash
npm run dev
```

## Step 5: Create Account

1. Go to http://localhost:3000/auth/signup
2. Create account with email/password
3. Login at http://localhost:3000/auth/login
4. Go to http://localhost:3000/dashboard/pages
5. Click "Create New Page"

## Testing the Complete Flow

1. **Create Page**: Username "johndoe", Title "John's Links"
2. **Add Buttons**: 
   - Instagram: johndoe
   - Website: https://example.com
   - Email: john@example.com
3. **Save** the page
4. **View Public Page**: http://localhost:3000/johndoe
5. **Download QR Code**: From pages list menu
6. **Share**: Copy the public URL and share it!

---

## Quick Test (No Database Needed)

If you just want to see the UI without database:
- The pages list will show empty state
- You can see the design and layout
- Full functionality requires database setup above
