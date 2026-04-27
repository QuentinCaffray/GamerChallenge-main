import type { CookieOptions } from 'express';

const isProd = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.COOKIE_DOMAIN;

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd, // HTTPS seulement en prod
    sameSite: isProd ? 'none' : 'lax',
    domain: isProd ? cookieDomain : undefined,
    path: '/'
  };
}
