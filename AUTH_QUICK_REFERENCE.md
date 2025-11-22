# Authentication Quick Reference

## 🎯 Routes Overview

| Route | Type | Protected | Purpose |
|-------|------|-----------|---------|
| `/auth/login` | Page | No | User login |
| `/auth/signup` | Page | No | User registration |
| `/auth/forgot-password` | Page | No | Password recovery |
| `/api/auth/login` | API | No | Login endpoint |
| `/api/auth/signup` | API | No | Signup endpoint |
| `/api/auth/logout` | API | No* | Logout endpoint |
| `/api/auth/reset-password` | API | No | Reset token generator |
| `/dashboard/*` | Pages | Yes | Protected dashboards |

*Logout validates session but accepts requests

---

## 📝 Form Schemas

### Login Form
```
- email: string (email format)
- password: string (min 6 chars)
- rememberMe: boolean (optional)
```

### Signup Form
```
- name: string (min 2 chars)
- email: string (email format, must be unique)
- password: string (min 8 chars)
- brandName: string (min 1 char)
- timezone: string (required, from list)
- termsAccepted: boolean (must be true)
- privacyAccepted: boolean (must be true)
```

### Forgot Password
```
- email: string (email format)
```

---

## 🔍 Session Management

### Session Token Generation
- Stored in HTTP-only cookie: `sessionToken`
- Expires in: 7 days (default) or 30 days (if Remember Me)
- Secure flag: Enabled in production
- SameSite: Lax

### Session Verification
- Checked on protected routes via middleware
- Validated against database
- Automatic expiry cleanup
- Invalid sessions trigger redirect to /auth/login

---

## 🛡️ Password Security

### Hashing
- Algorithm: bcrypt
- Rounds: 10
- Cost factor: ~100ms per hash

### Strength Levels
1. **Weak** - < 8 chars or basic patterns
2. **Fair** - 8+ chars with letter + number
3. **Good** - 12+ chars with mixed case
4. **Strong** - Mixed case + numbers + symbols
5. **Very Strong** - 12+ chars with all requirements

---

## 📧 Email Sending

### Password Reset Email
- Currently: Logs to console
- Token: 64-character hex string
- Link: `/auth/reset?token={token}`
- Expiry: 24 hours

### Integration Points
```typescript
// In src/app/api/auth/reset-password/route.ts
console.log('Password reset link:', resetLink)
console.log('Send email to:', email)
// TODO: Replace with actual email service
```

---

## 🔐 Protected Route Access

### Access Granted
- Valid session token in cookie
- Session not expired
- User record exists

### Access Denied
- No session token
- Session expired
- Session deleted from database
- User deleted

### Redirect
- Destination: `/auth/login`
- Cookie: Cleared

---

## 🧪 Testing Examples

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "rememberMe": false
  }'
```

### Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "brandName": "Johns Brand",
    "timezone": "America/New_York",
    "termsAccepted": true,
    "privacyAccepted": true
  }'
```

### Test Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sessionToken=<token>"
```

---

## 📦 Signup Flow

1. User fills form (name, email, password, brand, timezone)
2. Password hashed with bcrypt
3. User record created
4. Free subscription created
5. Default link page created
6. Session created
7. HTTP-only cookie set
8. Redirect to /dashboard

---

## 🔄 Password Recovery Flow

1. User enters email
2. System finds user (or generic success)
3. Reset token generated (64-char hex)
4. Token stored with 24h expiry
5. Email sent (console logged)
6. User clicks link with token
7. User enters new password
8. Token validated and deleted
9. Password updated

---

## 🚫 Error Handling

### Generic Errors
- Don't reveal if email exists
- Don't distinguish between invalid email/password
- Don't expose database errors

### Specific Errors
- Validation errors shown to user
- 400: Bad request (missing fields)
- 401: Unauthorized (invalid credentials)
- 409: Conflict (duplicate email)
- 500: Server error (unexpected)

---

## 🎯 Key Implementation Details

### Cookies
- Name: `sessionToken`
- HttpOnly: true (JavaScript cannot access)
- Secure: true (HTTPS only in production)
- SameSite: Lax (CSRF protection)
- Path: / (entire site)

### Database Relations
- User → Session (one-to-many)
- User → PasswordReset (one-to-many)
- Cascade delete on user deletion

### Validation
- Client-side: Zod schema
- Server-side: Duplicate checks, format validation
- Middleware: Session validation

---

## ⚙️ Configuration

### Environment Variables Needed
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key (for future use)
NODE_ENV=development|production
NEXT_PUBLIC_URL=http://localhost:3000
```

### Session Duration
- Default: 7 days
- With Remember Me: 30 days
- Password Reset Token: 24 hours

---

## 📚 Related Files

- Auth utilities: `src/lib/auth.ts`
- Database client: `src/lib/prisma.ts`
- Middleware: `src/middleware.ts`
- Schema: `prisma/schema.prisma`
- Complete docs: `AUTHENTICATION_COMPLETE.md`
