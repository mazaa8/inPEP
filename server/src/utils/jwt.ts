import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthUser } from '../types/index.js';

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

export const verifyToken = (token: string): AuthUser => {
  return jwt.verify(token, config.jwtSecret) as AuthUser;
};
