import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { dbGetOrCreateUser } from '../db/repository.ts';

export type UserRole = 'CITIZEN' | 'LMO' | 'CONTROLLER_ADMIN';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    role: UserRole;
    email?: string;
    badgeNumber?: string;
  };
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // 1. Support fast demo tokens for instant stakeholder simulation
  if (token === 'mock-token-citizen-101' || token.startsWith('mock-token-citizen')) {
    req.user = {
      id: 'usr-cit-101',
      name: 'Rahul Sharma',
      role: 'CITIZEN',
      email: 'rahul.sharma@apexlogistics.in',
    };
    return next();
  }

  if (token === 'mock-token-lmo-4091' || token.startsWith('mock-token-lmo')) {
    req.user = {
      id: 'lmo-malhotra-4091',
      name: 'Inspector Vikram Malhotra',
      role: 'LMO',
      email: 'v.malhotra@doca.gov.in',
      badgeNumber: 'DL-LMO-4091',
    };
    return next();
  }

  if (token === 'mock-token-controller-001' || token.startsWith('mock-token-controller')) {
    req.user = {
      id: 'doca-controller-001',
      name: 'Dr. S. K. Nambiar',
      role: 'CONTROLLER_ADMIN',
      email: 'controller.skn@doca.gov.in',
      badgeNumber: 'DOCA-HQ-001',
    };
    return next();
  }

  // 2. Check if token is Base64 session token (id:role:name:badge:timestamp)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length >= 3 && ['CITIZEN', 'LMO', 'CONTROLLER_ADMIN'].includes(parts[1])) {
      const [id, role, name, badge] = parts;
      req.user = {
        id,
        name: name || id,
        role: role as UserRole,
        badgeNumber: badge || undefined,
      };
      return next();
    }
  } catch {
    // Continue to Firebase ID token check
  }

  // 3. Verify Firebase Auth ID Token (Google Sign-In)
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const role: UserRole = 'CITIZEN';
    req.user = {
      id: decodedToken.uid,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Authenticated Citizen',
      email: decodedToken.email,
      role,
    };

    // Sync to PostgreSQL database asynchronously
    dbGetOrCreateUser(
      decodedToken.uid,
      decodedToken.email || '',
      req.user.name,
      role
    ).catch((err) => console.warn('User sync warning:', err));

    return next();
  } catch (firebaseErr) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token or expired session' });
  }
}
