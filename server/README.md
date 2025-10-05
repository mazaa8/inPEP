# Health Hub Backend API

Backend server for My Health Hub application built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js 20+ 
- PostgreSQL 14+
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/health_hub_db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3000
FRONTEND_URL="http://localhost:5174"
```

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or run migrations (recommended for production)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "PATIENT"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

### Get Profile (use token from login response):
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Database Management

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Generate Prisma Client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate
```

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   └── env.ts             # Environment config
│   ├── controllers/
│   │   └── authController.ts  # Auth logic
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   └── errorHandler.ts   # Error handling
│   ├── routes/
│   │   ├── authRoutes.ts      # Auth routes
│   │   └── index.ts           # Route aggregator
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   └── password.ts        # Password hashing
│   └── server.ts              # Express app entry
├── .env.example               # Environment template
├── package.json
└── tsconfig.json
```

## User Roles

- `PATIENT` - Patients receiving care
- `CAREGIVER` - Family members or professional caregivers
- `PROVIDER` - Healthcare providers (doctors, nurses)
- `INSURER` - Insurance company representatives

## Next Steps

1. Install dependencies: `npm install`
2. Set up PostgreSQL database
3. Configure `.env` file
4. Run `npm run db:push` to create tables
5. Start server: `npm run dev`
6. Test endpoints with cURL or Postman
7. Connect frontend to backend API
