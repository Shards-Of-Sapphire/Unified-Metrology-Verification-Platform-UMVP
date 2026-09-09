import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// Users table with Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('CITIZEN'), // 'CITIZEN' | 'LMO_OFFICER' | 'CONTROLLER_ADMIN'
  badgeNumber: text('badge_number'),
  jurisdiction: text('jurisdiction'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Metrology Applications table
export const applications = pgTable('applications', {
  id: text('id').primaryKey(), // e.g. APP-2026-9041
  applicationNumber: text('application_number').notNull(),
  applicantId: text('applicant_id').notNull(),
  applicantName: text('applicant_name').notNull(),
  businessName: text('business_name').notNull(),
  maskedAadhaarOrGstin: text('masked_aadhaar_or_gstin').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  instrumentCategory: text('instrument_category').notNull(),
  modelNumber: text('model_number').notNull(),
  serialNumber: text('serial_number').notNull(),
  capacityOrRange: text('capacity_or_range').notNull(),
  manufacturer: text('manufacturer').notNull(),
  installationAddress: text('installation_address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  status: text('status').notNull().default('SUBMITTED'),
  submissionDate: text('submission_date').notNull(),
  allocatedLmoId: text('allocated_lmo_id'),
  allocatedLmoName: text('allocated_lmo_name'),
  scheduledInspectionDate: text('scheduled_inspection_date'),
  fieldNotes: text('field_notes'),
  inspectionLatitude: text('inspection_latitude'),
  inspectionLongitude: text('inspection_longitude'),
  inspectionGeotagTimestamp: text('inspection_geotag_timestamp'),
  inspectionPhotoUrl: text('inspection_photo_url'),
  certificateId: text('certificate_id'),
  feesPaid: text('fees_paid').default('true'),
  gdprConsentRecorded: text('gdpr_consent_recorded').default('true'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Digital Verification Certificates table
export const certificates = pgTable('certificates', {
  id: text('id').primaryKey(), // e.g. CERT-DL-2026-8819
  certificateNumber: text('certificate_number').notNull(),
  applicationId: text('application_id').notNull(),
  instrumentCategory: text('instrument_category').notNull(),
  modelNumber: text('model_number').notNull(),
  serialNumber: text('serial_number').notNull(),
  ownerName: text('owner_name').notNull(),
  businessName: text('business_name').notNull(),
  installationAddress: text('installation_address').notNull(),
  issuingLmoId: text('issuing_lmo_id').notNull(),
  issuingLmoName: text('issuing_lmo_name').notNull(),
  issuingLmoBadge: text('issuing_lmo_badge').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  issuedAt: text('issued_at').notNull(),
  validUntil: text('valid_until').notNull(),
  sealNumber: text('seal_number').notNull(),
  hmacSignature: text('hmac_signature').notNull(),
  qrPayload: text('qr_payload').notNull(),
  tamperProofHash: text('tamper_proof_hash').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cryptographic SHA-256 Audit Ledger Blocks
export const auditLedger = pgTable('audit_ledger', {
  id: serial('id').primaryKey(),
  blockIndex: integer('block_index').notNull(),
  timestamp: text('timestamp').notNull(),
  actorId: text('actor_id').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  ipAddress: text('ip_address').notNull(),
  details: text('details').notNull(),
  previousHash: text('previous_hash').notNull(),
  hash: text('hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// End-to-End Encrypted Communications
export const e2eeMessages = pgTable('e2ee_messages', {
  id: text('id').primaryKey(),
  applicationId: text('application_id').notNull(),
  senderId: text('sender_id').notNull(),
  senderRole: text('sender_role').notNull(),
  senderName: text('sender_name').notNull(),
  recipientId: text('recipient_id').notNull(),
  recipientRole: text('recipient_role').notNull(),
  ciphertext: text('ciphertext').notNull(),
  iv: text('iv').notNull(),
  tag: text('tag').notNull(),
  keyId: text('key_id').notNull(),
  sentAt: text('sent_at').notNull(),
  isRead: text('is_read').default('false'),
  createdAt: timestamp('created_at').defaultNow(),
});
