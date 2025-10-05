# How to Create an Account and Login

## 🚀 Quick Start (3 Easy Steps)

### Step 1: Open the App
Go to: **http://localhost:5174**

You'll see the landing page with 4 role cards:
- 🔵 Patient
- 🟢 Caregiver  
- 🔴 Healthcare Provider
- 🟣 Insurance Company

### Step 2: Click Your Role
Click on any role card (e.g., "Patient")

You'll be redirected to the login/registration page.

### Step 3: Create Your Account
1. Click the **"Sign Up"** tab
2. Fill in the form:
   ```
   Full Name:    John Doe
   Email:        john@example.com
   Password:     password123
   Role:         (Pre-selected based on your choice!)
   ```
3. Click **"Sign Up"**
4. 🎉 You're in! You'll be redirected to your dashboard.

---

## 🔐 Login Next Time

### From Landing Page:
1. Go to **http://localhost:5174**
2. Click your role card
3. Enter your email and password
4. Click **"Sign In"**

### Direct Login:
1. Go directly to **http://localhost:5174/auth**
2. Enter your credentials
3. Click **"Sign In"**

---

## 🧪 Test Accounts (Already Created)

Don't want to create an account? Use these test accounts:

### Patient Account
```
Email:    patient@test.com
Password: password123
```
→ Navigates to Patient Dashboard

### Caregiver Account
```
Email:    caregiver@test.com
Password: password123
```
→ Navigates to Caregiver Dashboard

### Provider Account
```
Email:    provider@test.com
Password: password123
```
→ Navigates to Provider Dashboard

### Insurer Account
```
Email:    insurer@test.com
Password: password123
```
→ Navigates to Insurer Dashboard

**How to use:**
1. Go to http://localhost:5174/auth
2. Enter any of the credentials above
3. Click "Sign In"
4. You'll be redirected to the appropriate dashboard!

---

## 📱 Complete User Flow

```
Landing Page (/)
    ↓
Click Role Card
    ↓
Login Page (/auth)
    ↓
Sign Up or Sign In
    ↓
Dashboard
    - Patient → /dashboard/patient
    - Caregiver → /dashboard/caregiver
    - Provider → /dashboard/provider
    - Insurer → /dashboard/insurer
```

---

## ✨ What Happens When You Sign Up?

1. **Backend creates your account** in the database
2. **Password is hashed** (secure!)
3. **JWT token is generated** and stored
4. **You're automatically logged in**
5. **Redirected to your role-specific dashboard**

---

## 🔄 What Happens When You Login?

1. **Backend verifies** your email and password
2. **JWT token is generated** and stored in localStorage
3. **User profile is loaded**
4. **You're redirected** to your dashboard
5. **Token persists** - you stay logged in even after page refresh!

---

## 🛠️ Troubleshooting

### "Invalid credentials" error
- Check your email and password
- Passwords are case-sensitive
- Make sure you've created an account first

### Can't access dashboard
- Make sure you're logged in
- Check that the backend is running (http://localhost:3000)
- Try logging out and back in

### Backend not responding
```bash
# Check if backend is running
cd server
npm run dev
```

---

## 🎯 Try It Now!

1. **Open:** http://localhost:5174
2. **Click:** Any role card
3. **Sign Up:** Create your account
4. **Explore:** Your personalized dashboard!

---

## 📊 Account Types & Features

### Patient Account
- View medical records
- Manage appointments
- Access meal plans
- Emergency alerts

### Caregiver Account
- Monitor patients
- Care planning
- Medication schedules
- Grocery lists

### Provider Account
- Patient management
- EMR integration
- Analytics dashboard
- Appointment scheduling

### Insurer Account
- Claims processing
- Policy management
- Risk assessment
- Analytics

---

**Need help?** The app is now fully functional with real authentication! 🚀
