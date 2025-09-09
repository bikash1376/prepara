# Clerk Authentication Setup Guide

## Required Environment Variables

### Backend (.env file)
Add these variables to your backend `.env` file:

```env
# Clerk Configuration
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Database Configuration  
MONGO_URI=mongodb://localhost:27017/testsat

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend (.env file)
You already have this, but make sure it's correct:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## Getting Your Clerk Keys

1. **Sign up/Login to Clerk Dashboard**: Go to https://clerk.com and create an account
2. **Create a New Application**: 
   - Click "Add application"
   - Choose "React" as your framework
   - Give it a name like "TestSAT App"
3. **Get Your Keys**:
   - **Publishable Key**: Found in the "API Keys" section (starts with `pk_test_` or `pk_live_`)
   - **Secret Key**: Found in the "API Keys" section (starts with `sk_test_` or `sk_live_`)

## Clerk Dashboard Configuration

### 1. Configure Sign-in/Sign-up Options
In your Clerk dashboard:
- Go to "User & Authentication" → "Email, Phone, Username"
- Enable "Email address" 
- Enable "Password" 
- Optionally enable "Google" for OAuth

### 2. Set Up Redirects
- Go to "Paths"
- Set Sign-in URL: `/login`
- Set Sign-up URL: `/signup`
- Set After sign-in URL: `/`
- Set After sign-up URL: `/`

### 3. Configure Webhooks (Optional but Recommended)
- Go to "Webhooks"
- Add endpoint: `http://localhost:5000/api/v1/auth/webhook`
- Select events: `user.created`, `user.updated`
- This will sync user data to your MongoDB

## Role Assignment

After users sign up, they'll be prompted to select their role (Student or Admin). The role is stored in Clerk's `publicMetadata` and synced to your MongoDB.

## Testing the Setup

1. Start your backend server: `npm run dev` (in backend folder)
2. Start your frontend: `npm run dev` (in frontend folder)
3. Navigate to `http://localhost:5173/signup`
4. Create a new account
5. Select your role (Student or Admin)
6. Verify you're redirected to the appropriate dashboard

## Key Changes Made

### Backend Changes:
- Replaced JWT authentication with Clerk token verification
- Updated `authController.js` with Clerk-specific functions
- Modified `authMiddleware.js` to use Clerk's `verifyToken`
- Updated routes to handle role assignment and user profile
- Added `clerkId` field to User model

### Frontend Changes:
- Wrapped app with `ClerkProvider` in `main.jsx`
- Replaced custom auth forms with Clerk's `SignIn`/`SignUp` components
- Added role selection flow for new users
- Updated `Navbar` to use Clerk's user data and sign-out
- Implemented `ProtectedRoute` component for role-based access
- Updated all routes with proper authentication guards

## Troubleshooting

1. **"Missing Publishable Key" Error**: Make sure `VITE_CLERK_PUBLISHABLE_KEY` is set in frontend `.env`
2. **"Authentication Failed" Error**: Verify `CLERK_SECRET_KEY` is correct in backend `.env`
3. **Role Not Showing**: Check that the role was properly set in Clerk's metadata
4. **Redirect Issues**: Verify the paths are configured correctly in Clerk dashboard

## Migration Notes

- All existing JWT-based authentication has been replaced
- User sessions are now managed by Clerk
- Role-based access control is maintained through Clerk's metadata
- MongoDB still stores user data for application-specific needs
- The admin/student dashboard separation is preserved
