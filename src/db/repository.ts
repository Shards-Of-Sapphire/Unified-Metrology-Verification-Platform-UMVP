import { db } from './index.ts';
import { users, applications, certificates, auditLedger, e2eeMessages, gdprConsents, securityThreats } from './schema.ts';
import { eq, desc, asc, and, or, sql } from 'drizzle-orm';


// 1. Applications Repository
export async function dbGetApplications(role?: string, userId?: string) {
  try {
    if (role === 'CITIZEN' && userId) {
      return await db.select().from(applications).where(eq(applications.applicantId, userId));
    }
    return await db.select().from(applications);
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
    const results = await db.insert(applications).values(data).returning();
    return results[0];
  } catch (error) {
    console.error('Database query dbCreateApplication failed:', error);
    throw new Error('Failed to create application in database.', { cause: error });
  }
}

export async function dbUpdateApplication(id: string, data: Partial<typeof applications.$inferInsert>) {
  try {
    const results = await db.update(applications).set(data).where(eq(applications.id, id)).returning();
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbUpdateApplication failed for ${id}:`, error);
    throw new Error('Failed to update application in database.', { cause: error });
  }
}

// 2. Certificates Repository
export async function dbGetCertificates() {
  try {
    return await db.select().from(certificates);
  } catch (error) {
    console.error('Database query dbGetCertificates failed:', error);
    throw new Error('Failed to retrieve certificates from database.', { cause: error });
  }
}

export async function dbGetCertificateById(id: string) {
  try {
    const results = await db.select().from(certificates).where(
      or(eq(certificates.id, id), eq(certificates.certificateNumber, id))
    );
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbGetCertificateById failed for ${id}:`, error);
    throw new Error('Failed to retrieve certificate from database.', { cause: error });
  }
}

export async function dbCreateCertificate(data: typeof certificates.$inferInsert) {
  try {
    const results = await db.insert(certificates).values(data).returning();
    return results[0];
  } catch (error) {
    console.error('Database query dbCreateCertificate failed:', error);
    throw new Error('Failed to issue certificate in database.', { cause: error });
  }
}

export async function dbUpdateCertificatePdf(id: string, pdfData: string) {
  try {
    const results = await db.update(certificates).set({ pdfData }).where(eq(certificates.id, id)).returning();
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbUpdateCertificatePdf failed for ${id}:`, error);
    throw new Error('Failed to store certificate PDF in database.', { cause: error });
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

export async function dbGetUserByEmail(email: string) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  } catch (error) {
    console.error('Database query dbGetUserByEmail failed:', error);
    throw new Error('Failed to retrieve user account.', { cause: error });
  }
}

export async function dbGetUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error('Database query dbGetUserByUid failed:', error);
    throw new Error('Failed to retrieve user account.', { cause: error });
  }
}

export async function dbCreateUser(data: typeof users.$inferInsert) {
  try {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database query dbCreateUser failed:', error);
    throw new Error('Failed to create user account.', { cause: error });
  }
}

export async function dbUpdateUserCredentials(uid: string, email: string, passwordHash: string) {
  try {
    const result = await db.update(users).set({ email, passwordHash }).where(eq(users.uid, uid)).returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query dbUpdateUserCredentials failed:', error);
    throw new Error('Failed to update user credentials.', { cause: error });
  }
}

// 6. GDPR & DPDP Consents
export async function dbGetGdprConsents(userId?: string) {
  try {
    if (userId) {
      return await db.select().from(gdprConsents).where(eq(gdprConsents.userId, userId));
    }
    return await db.select().from(gdprConsents);
  } catch (error) {
    console.error('Database query dbGetGdprConsents failed:', error);
    throw new Error('Failed to retrieve GDPR consent records.', { cause: error });
  }
}

export async function dbCreateGdprConsent(data: typeof gdprConsents.$inferInsert) {
  try {
    const result = await db.insert(gdprConsents).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database query dbCreateGdprConsent failed:', error);
    throw new Error('Failed to record GDPR consent.', { cause: error });
  }
}

export async function dbAnonymizeCitizenData(userId: string) {
  try {
    await db.update(applications)
      .set({
        applicantName: 'ANONYMIZED_CITIZEN_GDPR_ART17',
        businessName: 'ANONYMIZED_ENTERPRISE',
        contactEmail: 'redacted@privacy.gdpr',
        contactPhone: '+91 00000 00000',
        maskedAadhaarOrGstin: 'REDACTED_BY_REQUEST',
      })
      .where(eq(applications.applicantId, userId));

    await db.update(gdprConsents)
      .set({ status: 'REVOKED' })
      .where(eq(gdprConsents.userId, userId));

    return true;
  } catch (error) {
    console.error(`Database anonymization failed for ${userId}:`, error);
    throw new Error('Failed to execute right-to-erasure.', { cause: error });
  }
}

// 7. Security Threats
export async function dbGetSecurityThreats() {
  try {
    return await db.select().from(securityThreats).orderBy(desc(securityThreats.timestamp));
  } catch (error) {
    console.error('Database query dbGetSecurityThreats failed:', error);
    throw new Error('Failed to retrieve security threats.', { cause: error });
  }
}

export async function dbCreateSecurityThreat(data: typeof securityThreats.$inferInsert) {
  try {
    const result = await db.insert(securityThreats).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database query dbCreateSecurityThreat failed:', error);
    throw new Error('Failed to record security threat.', { cause: error });
  }
}

// 8. Dynamic Aggregated Analytics
export async function dbGetAnalyticsCounts() {
  try {
    const [appRes, certRes, auditRes, threatRes] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(applications),
      db.select({ count: sql<number>`count(*)::int` }).from(certificates),
      db.select({ count: sql<number>`count(*)::int` }).from(auditLedger),
      db.select({ count: sql<number>`count(*)::int` }).from(securityThreats),
    ]);

    return {
      totalApplications: appRes[0]?.count || 0,
      activeCertificates: certRes[0]?.count || 0,
      totalAuditBlocks: auditRes[0]?.count || 0,
      securityIncidentsBlocked: threatRes[0]?.count || 0,
    };
  } catch (error) {
    console.error('Database query dbGetAnalyticsCounts failed:', error);
    return null;
  }
}

