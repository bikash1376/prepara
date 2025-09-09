# Clerk Token Verification Error Fix

## The Problem
You're getting this error:
```
TokenVerificationError: Unable to find a signing key in JWKS that matches the kid='undefined'
```

This indicates a mismatch between your Clerk keys or incorrect key configuration.

## Solution Steps

### 1. Verify Your Clerk Keys
Go to your Clerk Dashboard → API Keys and ensure:

**Backend .env file should have:**
```env
CLERK_SECRET_KEY=sk_test_... (or sk_live_...)
```

**Frontend .env file should have:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
```

### 2. Key Matching Requirements
- Both keys must be from the SAME Clerk application
- Both keys must be from the SAME environment (test or live)
- The secret key must correspond to the publishable key

### 3. Common Issues
1. **Mixed environments**: Using test publishable key with live secret key (or vice versa)
2. **Wrong application**: Keys from different Clerk applications
3. **Typos**: Extra spaces or missing characters in the keys

### 4. How to Fix
1. Delete both keys from your .env files
2. Go to Clerk Dashboard → Your App → API Keys
3. Copy the **Publishable Key** to frontend .env as `VITE_CLERK_PUBLISHABLE_KEY`
4. Copy the **Secret Key** to backend .env as `CLERK_SECRET_KEY`
5. Restart both servers

### 5. Verification
After updating keys:
1. Restart backend: `npm run dev`
2. Restart frontend: `npm run dev`
3. Try signing in again

The token verification should work correctly once the keys match properly.
