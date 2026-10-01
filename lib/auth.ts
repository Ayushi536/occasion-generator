import crypto from 'crypto';
import { cookies, headers } from 'next/headers';
import { db } from './db';
import { UserSession, UserRecord } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'wishly-super-secret-production-key-2026-secure';

export function signToken(user: UserRecord): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 7; // 7 days
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp,
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: decodedPayload.id,
      email: decodedPayload.email,
      name: decodedPayload.name,
      role: decodedPayload.role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  let token: string | undefined;

  // 1. Check Authorization Bearer header (works reliably inside iframes & APIs)
  try {
    const headerList = await headers();
    const authHeader = headerList.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.substring(7).trim();
    }
  } catch {
    // Ignore header lookup failure
  }

  // 2. Fall back to cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('wishly_token')?.value;
    } catch {
      // Ignore cookie lookup failure
    }
  }

  if (!token) return null;
  const session = verifyToken(token);
  if (!session) return null;
  const user = db.getUserById(session.id);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
