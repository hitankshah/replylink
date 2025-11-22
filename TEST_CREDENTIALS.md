# 🔐 Test Credentials for ReplyLink

## ⚠️ IMPORTANT: Development/Testing Only
These credentials are for **local development and testing ONLY**. They use a bypass system that should be completely removed before production deployment.

Delete `src/lib/testBypass.ts` and revert login API changes before deploying to production!

---

## Admin Credentials

**Email:** `admin@replylink.local`  
**Password:** `admin123`  
**Role:** ADMIN

This bypass allows you to:
- Access the `/admin` dashboard
- View all users
- View system metrics and health status
- Manage admin features

### How to Test Admin Panel:
1. Go to `/login` (or login page)
2. Enter email: `admin@replylink.local`
3. Enter password: `admin123`
4. Click Login
5. You'll get a JWT token and can access `/admin` routes

---

## Regular User Credentials (Optional)

**Email:** `user@replylink.local`  
**Password:** `user123`  
**Role:** USER

This credential is for testing regular user functionality.

---

## How The Bypass Works

The bypass is implemented in:
- `src/lib/testBypass.ts` - Test credential definitions and verification
- `src/app/api/auth/login/route.ts` - Modified to check bypass before database

When you login with bypass credentials:
1. The login API checks `verifyTestBypass()` first
2. If valid, it generates a JWT token immediately (no database lookup)
3. The token contains test user ID and email
4. You get a warning message: "🔐 TEST BYPASS: Using test credentials"

---

## Token Example

After logging in with admin bypass, you'll receive:

```json
{
  "success": true,
  "user": {
    "id": "test-admin-user-001",
    "email": "admin@replylink.local",
    "name": "Test Admin",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "🔐 TEST BYPASS: Using test credentials. Do not use in production!"
}
```

Use this token in API requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/api/admin/users
```

---

## Admin Panel Features Accessible

- ✅ `/admin/users` - User management, plan changes, suspend/reactivate
- ✅ `/admin/system` - System metrics, health checks, queue statistics
- ✅ `/admin/settings` - (If implemented)
- ✅ `/admin/alerts` - (If implemented)

---

## For Production Deployment

**BEFORE deploying to production:**

1. Delete `src/lib/testBypass.ts`
2. Revert changes to `src/app/api/auth/login/route.ts`
3. Remove seed script or modify it for real admin creation
4. Implement proper admin user management

Replace test credentials with:
- Database-backed user roles (add `role` field to User model if not already present)
- Environment variable-based admin emails
- Proper OAuth/SSO for admin access
- Audit logging for admin actions

---

## Cleanup Checklist for Production

- [ ] Remove `src/lib/testBypass.ts`
- [ ] Remove bypass logic from login API
- [ ] Test with real database users
- [ ] Add proper role management UI
- [ ] Implement admin onboarding workflow
- [ ] Add audit logging for admin actions
- [ ] Remove this file from codebase

