import { db } from './index.ts';
import { users, applications, certificates, auditLedger, e2eeMessages } from './schema.ts';
import { eq, desc, asc, and, or } from 'drizzle-orm';
import {
  prismaCreateApplication,
  prismaCreateCertificate,
  prismaGetApplications,
  prismaGetCertificateById,
  prismaGetCertificates,
  prismaUpdateApplication,
} from './prismaRepository.ts';

// 1. Applications Repository
export async function dbGetApplications(role?: string, userId?: string) {
  try {
    return await prismaGetApplications(role, userId);
  } catch (error) {
    console.error('Database query dbGetApplications failed:', error);
    throw new Error('Failed to retrieve applications from database.', { cause: error });
  }
}

export async function dbGetApplicationById(id: string) {
  try {
    const results = await db.select().from(applications).where(eq(applications.id, id));
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbGetApplicationById failed for ${id}:`, error);
    throw new Error('Failed to retrieve application from database.', { cause: error });
  }
}

export async function dbCreateApplication(data: typeof applications.$inferInsert) {
  try {
    return await prismaCreateApplication(data as any);
  } catch (error) {
    console.error('Database query dbCreateApplication failed:', error);
    throw new Error('Failed to create application in database.', { cause: error });
  }
}

export async function dbUpdateApplication(id: string, data: Partial<typeof applications.$inferInsert>) {
  try {
    return await prismaUpdateApplication(id, data as any);
  } catch (error) {
    console.error(`Database query dbUpdateApplication failed for ${id}:`, error);
    throw new Error('Failed to update application in database.', { cause: error });
  }
}

// 2. Certificates Repository
export async function dbGetCertificates() {
  try {
    return await prismaGetCertificates();
  } catch (error) {
    console.error('Database query dbGetCertificates failed:', error);
    throw new Error('Failed to retrieve certificates from database.', { cause: error });
  }
}

export async function dbGetCertificateById(id: string) {
  try {
    return await prismaGetCertificateById(id);
  } catch (error) {
    console.error(`Database query dbGetCertificateById failed for ${id}:`, error);
    throw new Error('Failed to retrieve certificate from database.', { cause: error });
  }
}

export async function dbCreateCertificate(data: typeof certificates.$inferInsert) {
  try {
    return await prismaCreateCertificate(data as any);
  } catch (error) {
    console.error('Database query dbCreateCertificate failed:', error);
    throw new Error('Failed to issue certificate in database.', { cause: error });
  }
}

// 3. Audit Ledger Repository
export async function dbGetAuditLedger() {
  try {
    return await db.select().from(auditLedger).orderBy(asc(auditLedger.blockIndex));
  } catch (error) {
    console.error('Database query dbGetAuditLedger failed:', error);
    throw new Error('Failed to retrieve audit ledger from database.', { cause: error });
  }
}

export async function dbAppendAuditBlock(data: typeof auditLedger.$inferInsert) {
  try {
    const results = await db.insert(auditLedger).values(data).returning();
    return results[0];
  } catch (error) {
    console.error('Database query dbAppendAuditBlock failed:', error);
    throw new Error('Failed to record audit block in database.', { cause: error });
  }
}

// 4. E2EE Messages Repository
export async function dbGetE2eeMessages(applicationId: string) {
  try {
    return await db.select().from(e2eeMessages).where(eq(e2eeMessages.applicationId, applicationId));
  } catch (error) {
    console.error(`Database query dbGetE2eeMessages failed for ${applicationId}:`, error);
    throw new Error('Failed to retrieve encrypted messages from database.', { cause: error });
  }
}

export async function dbCreateE2eeMessage(data: typeof e2eeMessages.$inferInsert) {
  try {
    const results = await db.insert(e2eeMessages).values(data).returning();
    return results[0];
  } catch (error) {
    console.error('Database query dbCreateE2eeMessage failed:', error);
    throw new Error('Failed to store encrypted message in database.', { cause: error });
  }
}

// 5. Users Upsert
export async function dbGetOrCreateUser(uid: string, email: string, name: string, role: string = 'CITIZEN') {
  try {
    const result = await db.insert(users)
      .values({ uid, email, name, role })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email, name, role },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query dbGetOrCreateUser failed:', error);
    throw new Error('Failed to sync user profile with database.', { cause: error });
  }
}
