# Backend Setup Guide

Follow these steps to get your backend running:

## Step 1: Install PostgreSQL

### macOS (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Create Database:
```bash
# Connect to PostgreSQL
psql postgres

# In PostgreSQL shell, create database:
CREATE DATABASE health_hub_db;

# Create user (optional, or use default postgres user):
CREATE USER health_hub_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE health_hub_db TO health_hub_user;

# Exit PostgreSQL shell
\q
```

## Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 3: Configure Environment

Create `.env` file in the `server/` directory:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/health_hub_db"
JWT_SECRET="change-this-to-a-random-secret-string"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5174"
```

## Step 4: Set Up Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates all tables)
npm run db:push
```

You should see:
```
✅ Database schema created successfully
```

## Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3000
📝 Environment: development
🔗 Frontend URL: http://localhost:5174
```

## Step 6: Test the API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-05T...",
  "uptime": 1.234
}
```

## Step 7: Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "PATIENT"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User",
    "role": "PATIENT"
  }
}
```

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running: `brew services list`
- Check DATABASE_URL in `.env` matches your PostgreSQL credentials
- Verify database exists: `psql -l`

### Port Already in Use
- Backend uses port 3000 by default
- Change PORT in `.env` if needed
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### Prisma Client Not Generated
```bash
npm run db:generate
```

## Next Steps

Once the backend is running:
1. Keep this terminal open (backend server running)
2. Open a new terminal for the frontend
3. We'll connect the frontend to this backend API
