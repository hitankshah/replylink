# Login Page - Feature Overview

## 🎯 Page URL
`/auth/login`

## 📋 Form Fields

### 1. Email Address
- **Type:** Email input field
- **Placeholder:** "you@example.com"
- **Validation:** Must be valid email format
- **Error Message:** "Please enter a valid email address"

### 2. Password
- **Type:** Password input field (toggleable)
- **Placeholder:** "••••••••"
- **Show/Hide Toggle:** Eye icon to reveal password
- **Validation:** Minimum 6 characters
- **Error Message:** "Password must be at least 6 characters"

### 3. Remember Me Checkbox
- **Label:** "Remember me"
- **Behavior:** Saves email to localStorage when checked
- **Persistence:** Email auto-fills on future visits if checked

### 4. Forgot Password Link
- **Text:** "Forgot password?"
- **Link:** Routes to `/auth/forgot-password`
- **Styling:** Blue accent color with hover effect

### 5. Sign In Button
- **Label:** "Sign in" (changes to "Signing in..." during submission)
- **State:** Shows spinner during authentication
- **Disabled:** While form is submitting
- **Type:** Primary action (blue background)

## 🎨 Visual Design

### Color Scheme
- **Background:** Gradient (slate-900 → slate-800 → slate-900)
- **Card:** slate-800 with slate-700 border
- **Text:** White for headings, slate-200/300 for labels
- **Accents:** Blue-600 (primary actions)
- **Errors:** Red-400 text on red-900/20 background

### Layout
- **Alignment:** Center of screen (horizontal & vertical)
- **Card Width:** Max 448px (responsive on mobile)
- **Spacing:** 24px padding in card, 6px gap between form fields
- **Border Radius:** 8px on card

### Responsive Design
- **Mobile:** Full width with side padding
- **Tablet & Desktop:** Centered card with max-width

## 🔐 Validation Behavior

1. **Real-time Feedback:** Errors appear as user types
2. **Field-level Errors:** Each field shows its own error message
3. **Submit Protection:** Form cannot be submitted with errors
4. **Loading State:** Button disabled during submission

## 💾 LocalStorage Features

When "Remember Me" is checked:
- `rememberMe`: "true"
- `rememberedEmail`: user's email address

These are cleared when checkbox is unchecked.

## 🔗 Navigation Links

1. **Forgot Password:** `/auth/forgot-password`
2. **Sign Up:** `/auth/signup`
3. **Privacy Policy:** `/privacy`
4. **Terms of Service:** `/terms`

## 📱 Mobile Optimizations

- Responsive padding and sizing
- Touch-friendly checkbox and button sizes
- Optimized input spacing
- Clear visual hierarchy

## 🎭 Component Stack

```
Page (page.tsx)
├─ Form
│  ├─ Email Input with validation
│  ├─ Password Input with toggle
│  ├─ Checkbox (Remember Me)
│  ├─ Links (Forgot Password, Sign Up)
│  └─ Submit Button
└─ Footer (Privacy/Terms links)
```

## 🧪 Testing Checklist

- [ ] Email validation works
- [ ] Password validation works (min 6 chars)
- [ ] Remember Me saves to localStorage
- [ ] Password visibility toggle works
- [ ] Form submits successfully
- [ ] Error messages display correctly
- [ ] Loading state shows during submission
- [ ] Forgot password link navigates correctly
- [ ] Sign up link navigates correctly
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1920px+)
