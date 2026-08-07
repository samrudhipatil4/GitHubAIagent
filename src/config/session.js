import session from 'express-session';
import { env } from './env.js';

export const sessionMiddleware = session({
  name: 'connect.sid',
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: env.isProduction ? 'none' : 'lax',
  },
});
