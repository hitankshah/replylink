# Login Page Documentation

## Overview
A fully functional login page built with Next.js, React Hook Form, and Tailwind CSS with shadcn/ui components.

## Location
`src/app/auth/login/page.tsx`

## Features

### 1. **Email/Password Form with Validation**
- Email validation using Zod schema (must be valid email format)
- Password validation (minimum 6 characters)
- Real-time error messages displayed below each field
- Form validation using React Hook Form + Zod

### 2. **Remember Me Checkbox**
- Persistent state using localStorage
- When checked, saves email to browser for future logins
- Data is cleared when unchecked
- Styled with custom checkbox component

### 3. **Forgot Password Link**
- Direct link to `/auth/forgot-password` page
- Positioned next to "Remember Me" checkbox
- Easy access for password recovery

### 4. **Styling & UI**
- Dark theme with gradient background (slate-900 to slate-800)
- Professional card-based layout
- Fully responsive design (mobile-first)
- Tailwind CSS utilities for styling
- shadcn/ui components for consistent design
- Blue accent color for primary actions
- Icons from lucide-react (Eye/EyeOff for password toggle, Loader for loading state)

### 5. **Password Visibility Toggle**
- Eye icon to show/hide password
- Improves UX on mobile and desktop
- Smooth transitions

### 6. **Loading State**
- Button shows loading spinner during authentication
- Disabled state prevents multiple submissions
- "Signing in..." text during submission

### 7. **Error Handling**
- Display validation errors for each field
- Show authentication errors in alert box
- Field-level error messages for better UX

### 8. **Related Pages**
- `/auth/forgot-password` - Password recovery page
- `/auth/signup` - Account creation page

## Authentication Integration (TODO)
The current implementation includes commented-out NextAuth.js integration:
```typescript
// const response = await signIn("credentials", {
//   email: data.email,
//   password: data.password,
//   redirect: false,
// })
```

To integrate with actual authentication:
1. Set up NextAuth.js credentials provider
2. Uncomment the signIn call
3. Remove the setTimeout simulation

## Component Hierarchy
```
LoginPage (page.tsx)
├── Button (UI component)
├── Input (UI component)
├── Label (UI component)
├── Checkbox (UI component)
└── Icons (lucide-react)
```

## Dependencies
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver
- `zod` - Schema validation
- `lucide-react` - Icons
- `@radix-ui/react-checkbox` - Checkbox primitive
- Tailwind CSS - Styling

## Usage
Navigate to `/auth/login` to access the login page. All form validation happens client-side with user-friendly error messages.
