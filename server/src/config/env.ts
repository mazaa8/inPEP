import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5174',
};

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not set. Please create a .env file.');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback-secret-change-in-production') {
  console.warn('⚠️  JWT_SECRET is not set or using default. Please set a secure secret in .env file.');
}
