import { pool } from './index.ts';
import {
  INITIAL_APPLICATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_AUDIT_TRAILS,
  INITIAL_E2EE_MESSAGES,
  INITIAL_GDPR_CONSENTS,
  INITIAL_SECURITY_THREATS,
} from '../data/mockDatabase.ts';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.scryptSync(password, 'umvp-password-salt', 64).toString('hex');
}

export async function initDatabase(): Promise<{
  success: boolean;
  tables: string[];
  seeded: boolean;
  message: string;
}> {
  try {
    // 1. Create tables with IF NOT EXISTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        password_hash TEXT,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'CITIZEN',
        badge_number TEXT,
        jurisdiction TEXT,
        phone TEXT,
        business_name TEXT,
        gstin TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        application_number TEXT NOT NULL,
        applicant_id TEXT NOT NULL,
        applicant_name TEXT NOT NULL,
        business_name TEXT NOT NULL,
        masked_aadhaar_or_gstin TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        instrument_category TEXT NOT NULL,
        model_number TEXT NOT NULL,
        serial_number TEXT NOT NULL,
        capacity_or_range TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        installation_address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'SUBMITTED',
        submission_date TEXT NOT NULL,
        allocated_lmo_id TEXT,
        allocated_lmo_name TEXT,
        scheduled_inspection_date TEXT,
        field_notes TEXT,
        inspection_latitude TEXT,
        inspection_longitude TEXT,
        inspection_geotag_timestamp TEXT,
        inspection_photo_url TEXT,
        certificate_id TEXT,
        fees_paid TEXT DEFAULT 'true',
        gdpr_consent_recorded TEXT DEFAULT 'true',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        certificate_number TEXT NOT NULL,
        application_id TEXT NOT NULL,
        instrument_category TEXT NOT NULL,
        model_number TEXT NOT NULL,
        serial_number TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        business_name TEXT NOT NULL,
        installation_address TEXT NOT NULL,
        issuing_lmo_id TEXT NOT NULL,
        issuing_lmo_name TEXT NOT NULL,
        issuing_lmo_badge TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        issued_at TEXT NOT NULL,
        valid_until TEXT NOT NULL,
        seal_number TEXT NOT NULL,
        hmac_signature TEXT NOT NULL,
        qr_payload TEXT NOT NULL,
        tamper_proof_hash TEXT NOT NULL,
        pdf_data TEXT,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audit_ledger (
        id SERIAL PRIMARY KEY,
        block_index INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        details TEXT NOT NULL,
        previous_hash TEXT NOT NULL,
        hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS e2ee_messages (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        recipient_role TEXT NOT NULL,
        ciphertext TEXT NOT NULL,
        iv TEXT NOT NULL,
        tag TEXT NOT NULL,
        key_id TEXT NOT NULL,
        sent_at TEXT NOT NULL,
        is_read TEXT DEFAULT 'false',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS gdpr_consents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        purpose TEXT NOT NULL,
        legal_basis TEXT NOT NULL DEFAULT 'CONSENT',
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        ip_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS security_threats (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        threat_type TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'MEDIUM',
        actor_ip TEXT NOT NULL,
        actor_role TEXT,
        description TEXT NOT NULL,
        mitigation_action TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Check and seed if applications table is empty
    const appCountRes = await pool.query('SELECT COUNT(*)::int as count FROM applications;');
    const count = appCountRes.rows[0]?.count || 0;
    let seeded = false;

    if (count === 0) {
      console.log('📦 Database initialized. Seeding initial baseline metrology data...');

      // Seed Users
      const defaultUsers = [
        {
          uid: 'usr-cit-101',
          email: 'rahul.sharma@apexlogistics.in',
          passwordHash: hashPassword('GovtSecure@2026'),
          name: 'Rahul Sharma',
          role: 'CITIZEN',
          businessName: 'Apex Logistics & Retail Hub',
          gstin: '07AAACA1234F1Z5',
          phone: '+91 98110 44552',
          address: 'Shed 14, Okhla Industrial Area Phase-III',
          city: 'New Delhi',
          state: 'Delhi NCT',
          pincode: '110020',
        },
        {
          uid: 'lmo-malhotra-4091',
          email: 'v.malhotra@doca.gov.in',
          passwordHash: hashPassword('GovtSecure@2026'),
          name: 'Inspector Vikram Malhotra',
          role: 'LMO',
          badgeNumber: 'DL-LMO-4091',
          jurisdiction: 'South Delhi Enforcement Division',
          phone: '+91 99110 01122',
        },
        {
          uid: 'doca-controller-001',
          email: 'controller.skn@doca.gov.in',
          passwordHash: hashPassword('GovtSecure@2026'),
          name: 'Dr. S. K. Nambiar',
          role: 'CONTROLLER_ADMIN',
          badgeNumber: 'DOCA-HQ-001',
          jurisdiction: 'Central Metrology Directorate (All India)',
        },
        {
          uid: 'gatc-lab-004',
          email: 'gatc.lab04@doca.gov.in',
          passwordHash: hashPassword('GovtSecure@2026'),
          name: 'Er. Suresh R. Kumar (GATC #04)',
          role: 'GATC',
          badgeNumber: 'GATC-DELHI-04',
          jurisdiction: 'GATC Metrology Lab #04 (Northern Region)',
        },
      ];

      for (const u of defaultUsers) {
        await pool.query(
          `INSERT INTO users (uid, email, password_hash, name, role, badge_number, jurisdiction, phone, business_name, gstin, address, city, state, pincode)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (uid) DO NOTHING;`,
          [
            u.uid,
            u.email,
            u.passwordHash,
            u.name,
            u.role,
            u.badgeNumber || null,
            u.jurisdiction || null,
            u.phone || null,
            u.businessName || null,
            u.gstin || null,
            u.address || null,
            u.city || null,
            u.state || null,
            u.pincode || null,
          ]
        );
      }

      // Seed Applications
      for (const app of INITIAL_APPLICATIONS) {
        await pool.query(
          `INSERT INTO applications (
            id, application_number, applicant_id, applicant_name, business_name,
            masked_aadhaar_or_gstin, contact_email, contact_phone, instrument_category,
            model_number, serial_number, capacity_or_range, manufacturer, installation_address,
            city, state, pincode, status, submission_date, allocated_lmo_id, allocated_lmo_name,
            scheduled_inspection_date, field_notes, inspection_latitude, inspection_longitude,
            inspection_geotag_timestamp, inspection_photo_url, certificate_id, fees_paid, gdpr_consent_recorded
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
          ON CONFLICT (id) DO NOTHING;`,
          [
            app.id,
            app.applicationNumber,
            app.applicantId,
            app.applicantName,
            app.businessName,
            app.maskedAadhaarOrGstin,
            app.contactEmail,
            app.contactPhone,
            app.instrumentCategory,
            app.modelNumber,
            app.serialNumber,
            app.capacityOrRange,
            app.manufacturer,
            app.installationAddress,
            app.city,
            app.state,
            app.pincode,
            app.status,
            app.submissionDate,
            app.allocatedLmoId || null,
            app.allocatedLmoName || null,
            app.scheduledInspectionDate || null,
            app.fieldNotes || null,
            app.inspectionGeotag?.latitude ? String(app.inspectionGeotag.latitude) : null,
            app.inspectionGeotag?.longitude ? String(app.inspectionGeotag.longitude) : null,
            app.inspectionGeotag?.timestamp || null,
            app.inspectionPhotoUrl || null,
            app.certificateId || null,
            app.feesPaid ? 'true' : 'false',
            app.gdprConsentRecorded ? 'true' : 'false',
          ]
        );
      }

      // Seed Certificates
      for (const cert of INITIAL_CERTIFICATES) {
        await pool.query(
          `INSERT INTO certificates (
            id, certificate_number, application_id, instrument_category, model_number,
            serial_number, owner_name, business_name, installation_address, issuing_lmo_id,
            issuing_lmo_name, issuing_lmo_badge, jurisdiction, issued_at, valid_until,
            seal_number, hmac_signature, qr_payload, tamper_proof_hash, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
          ON CONFLICT (id) DO NOTHING;`,
          [
            cert.id,
            cert.certificateNumber,
            cert.applicationId,
            cert.instrumentCategory,
            cert.modelNumber,
            cert.serialNumber,
            cert.ownerName,
            cert.businessName,
            cert.installationAddress,
            cert.issuingLmoId,
            cert.issuingLmoName,
            cert.issuingLmoBadge,
            cert.jurisdiction,
            cert.issuedAt,
            cert.validUntil,
            cert.sealNumber,
            cert.hmacSignature,
            cert.qrPayload,
            cert.tamperProofHash,
            cert.status,
          ]
        );
      }

      // Seed Audit Ledger
      for (const b of INITIAL_AUDIT_TRAILS) {
        await pool.query(
          `INSERT INTO audit_ledger (
            block_index, timestamp, actor_id, actor_role, action, resource_type,
            resource_id, ip_address, details, previous_hash, hash
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
          [
            b.index,
            b.timestamp,
            b.actorId,
            b.actorRole,
            b.action,
            b.resourceType,
            b.resourceId,
            b.ipAddress,
            b.details,
            b.previousHash,
            b.hash,
          ]
        );
      }

      // Seed E2EE Messages
      for (const msg of INITIAL_E2EE_MESSAGES) {
        await pool.query(
          `INSERT INTO e2ee_messages (
            id, application_id, sender_id, sender_role, sender_name,
            recipient_id, recipient_role, ciphertext, iv, tag, key_id, sent_at, is_read
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING;`,
          [
            msg.id,
            msg.applicationId,
            msg.senderId,
            msg.senderRole,
            msg.senderName,
            msg.recipientId,
            msg.recipientRole,
            msg.encryptedPayload,
            msg.iv,
            'auth-tag-aes-256-gcm',
            'kid-stakeholder-e2ee-2026',
            msg.timestamp,
            'false',
          ]
        );
      }

      // Seed GDPR Consents
      for (const c of INITIAL_GDPR_CONSENTS) {
        await pool.query(
          `INSERT INTO gdpr_consents (
            id, user_id, timestamp, purpose, legal_basis, status, ip_address
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;`,
          [c.id, c.userId, c.timestamp, c.purpose, c.legalBasis, c.status, c.ipAddress]
        );
      }

      // Seed Security Threats
      for (const t of INITIAL_SECURITY_THREATS) {
        await pool.query(
          `INSERT INTO security_threats (
            id, timestamp, threat_type, severity, actor_ip, actor_role, description, mitigation_action
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;`,
          [t.id, t.timestamp, t.threatType, t.severity, t.actorIp, t.actorRole || null, t.description, t.mitigationAction]
        );
      }

      seeded = true;
      console.log('✅ Baseline metrology database successfully seeded.');
    }

    const tables = [
      'users',
      'applications',
      'certificates',
      'audit_ledger',
      'e2ee_messages',
      'gdpr_consents',
      'security_threats',
    ];

    return {
      success: true,
      tables,
      seeded,
      message: 'Database schema verified and active.',
    };
  } catch (error: any) {
    console.error('Database initialization error:', error.message);
    return {
      success: false,
      tables: [],
      seeded: false,
      message: error.message,
    };
  }
}

// Support standalone execution
if (process.argv[1] && (process.argv[1].endsWith('init.ts') || process.argv[1].endsWith('init.js'))) {
  initDatabase().then((res) => {
    console.log('Initialization result:', res);
    process.exit(res.success ? 0 : 1);
  });
}

