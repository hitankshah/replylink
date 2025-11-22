# 🚀 HOW TO RUN REPLYLINK - SIMPLE COMMANDS

## ⚡ FASTEST WAY TO START (5 STEPS)

### Step 1️⃣: Install Dependencies
```bash
npm install
```

### Step 2️⃣: Create Environment File
Create `.env.local` file in project root with:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/replylink
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-longer-than-32-chars
JWT_SECRET=your-jwt-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3️⃣: Start Database (Choose ONE)

**Option A: Docker (EASIEST)**
```bash
docker run --name replylink-db -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:15
```

**Option B: Local PostgreSQL**
- Install from https://www.postgresql.org/download/
- Run: `psql -U postgres` to verify

### Step 4️⃣: Setup Database Schema
```bash
npm run db:push
```

### Step 5️⃣: Start the App
```bash
npm run dev
```

✅ **Done!** Visit http://localhost:3000

---

## 🔄 ALL COMMANDS

| Command | What It Does |
|---------|------------|
| `npm run dev` | Start development server (main app) |
| `npm run worker` | Start background job processor (separate terminal) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Sync database schema |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open database browser UI |
| `npm run db:seed` | Populate test data |
| `npm run lint` | Check code quality |

---

## 📋 COMPLETE SETUP (DETAILED)

### Prerequisites Check
```bash
# Verify Node.js
node --version    # Should be 18+

# Verify PostgreSQL installed
psql --version

# Verify Git
git --version
```

### Full Setup Process

```bash
# 1. Navigate to project
cd c:\Users\hitan\OneDrive\Desktop\New\ folder\ \(2\)\replylink

# 2. Install all packages
npm install

# 3. Create .env.local file (use editor or command)
# Copy-paste the environment variables above

# 4. Start PostgreSQL (if not running)
# Docker: docker run --name replylink-db -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:15
# Or: postgresql service

# 5. Create database schema
npm run db:push

# 6. (OPTIONAL) View database
npm run db:studio

# 7. Start the application
npm run dev

# 8. (OPTIONAL) In ANOTHER terminal, start workers
npm run worker
```

---

## 🌐 WHAT TO ACCESS

Once running, visit in your browser:

| URL | What You See |
|-----|-------------|
| http://localhost:3000/dashboard | Main dashboard |
| http://localhost:3000/status | Project phase status |
| http://localhost:3000/features | Features matrix |
| http://localhost:3000/core-features | Core features details |
| http://localhost:3000/api-docs | API documentation |

---

## ⚠️ COMMON ISSUES & FIXES

### ❌ "Can't connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres

# If Docker: verify container
docker ps

# Fix connection string in .env.local
DATABASE_URL=postgresql://postgres:password@localhost:5432/replylink
```

### ❌ "Redis connection failed"
```bash
# Check Redis running
redis-cli ping

# If Docker: verify container
docker ps

# Fix connection string in .env.local
REDIS_URL=redis://localhost:6379
```

### ❌ "Cannot find module"
```bash
# Clean reinstall
rm -r node_modules package-lock.json
npm install
```

### ❌ "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

---

## 🎯 TYPICAL WORKFLOW

### Terminal 1 (Main Dev Server)
```bash
npm run dev
# Stays running - displays logs and errors
```

### Terminal 2 (Background Workers) - Optional but Recommended
```bash
npm run worker
# Processes auto-replies, analytics, webhooks
```

### Terminal 3 (Database Browser) - Optional
```bash
npm run db:studio
# Opens http://localhost:5555 for viewing data
```

---

## 🚀 PRODUCTION BUILD

```bash
# Build for production
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

---

## 📊 PROJECT STATUS

- ✅ **Phase 1-7: 100% COMPLETE** (111/111 tasks)
- ✅ Link-in-Bio Pages
- ✅ Auto-Reply Engine  
- ✅ Real-Time Dashboard
- ✅ Multi-Platform Support (Instagram, Facebook, WhatsApp, Twitter, TikTok, LinkedIn)
- ✅ Advanced Analytics
- ✅ Subscription Management (Razorpay + PayPal)

---

## 📚 ADDITIONAL RESOURCES

- **README.md** - Full project documentation
- **QUICKSTART.md** - Detailed quickstart guide
- **TASKS.md** - All completed tasks by phase
- **PHASE_7_COMPLETE.md** - Phase 7 implementation details
- **docs/** - Additional documentation

---

## ✅ QUICK CHECKLIST

Before running:
- [ ] Node.js 18+ installed
- [ ] PostgreSQL running (Docker or local)
- [ ] Redis running (Docker or local)
- [ ] .env.local file created
- [ ] Dependencies installed (`npm install`)

After running:
- [ ] Dev server running on http://localhost:3000
- [ ] Can see dashboard
- [ ] Can see real-time metrics
- [ ] Can access API endpoints

---

**Ready to go!** 🎉

```bash
npm install && npm run db:push && npm run dev
```

One command to rule them all! 🚀
