# Testing Guide - Frontend + Backend Integration

## Current Status
✅ Backend server running on `http://localhost:3000`  
✅ Database configured (SQLite)  
✅ Authentication API working  
✅ Frontend updated with real API integration  

## How to Test

### 1. Backend is Already Running
The backend server is running in the background on port 3000.

Check backend health:
```bash
curl http://localhost:3000/api/health
```

### 2. Start Frontend
Open a new terminal and run:
```bash
npm run dev
```

Frontend will start on `http://localhost:5174`

### 3. Test Authentication Flow

#### Option A: Use the New Login Page
1. Navigate to: `http://localhost:5174/auth`
2. Click "Sign Up" tab
3. Register a new user:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Role: Select any role (Patient, Caregiver, Provider, Insurer)
4. Click "Sign Up"
5. You should be redirected to the appropriate dashboard

#### Option B: Use Existing Test User
1. Navigate to: `http://localhost:5174/auth`
2. Use these credentials:
   - Email: patient@test.com
   - Password: password123
3. Click "Sign In"

### 4. Verify Integration

After logging in, check:
- ✅ You're redirected to a dashboard
- ✅ Your name appears in the UI
- ✅ Token is stored in localStorage (check DevTools → Application → Local Storage)
- ✅ Protected routes work

### 5. Test API Directly (Optional)

#### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123",
    "name": "New User",
    "role": "PATIENT"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123"
  }'
```

#### Get Profile (use token from login):
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## What's Working

### Backend (Port 3000)
- ✅ User registration with role-based profiles
- ✅ User login with JWT tokens
- ✅ Password hashing (bcrypt)
- ✅ Protected endpoints
- ✅ CORS configured for frontend
- ✅ SQLite database (no PostgreSQL needed)

### Frontend (Port 5174)
- ✅ Real API integration
- ✅ Token storage in localStorage
- ✅ Auto-login on page refresh
- ✅ New unified login/register page at `/auth`
- ✅ Error handling
- ✅ Loading states

## Troubleshooting

### Backend not responding
```bash
# Check if backend is running
lsof -ti:3000

# If not running, start it:
cd server
npm run dev
```

### Frontend not connecting
- Check that backend is on port 3000
- Check browser console for CORS errors
- Verify `API_BASE_URL` in `src/config/api.ts`

### Database errors
```bash
cd server
npm run db:push
```

## Next Steps

1. Test the new `/auth` login page
2. Register a new user
3. Login with existing user
4. Verify dashboard access
5. Check that user data persists after page refresh

## Demo Accounts

Already created:
- Email: patient@test.com
- Password: password123
- Role: PATIENT

You can create more accounts using the registration form!
