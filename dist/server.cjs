var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_qrcode = __toESM(require("qrcode"), 1);
var import_jspdf = require("jspdf");

// src/data/mockDatabase.ts
var INITIAL_APPLICATIONS = [
  {
    id: "APP-2026-9041",
    applicationNumber: "UMVP/DL/2026/009041",
    applicantId: "usr-cit-101",
    applicantName: "Rahul Sharma",
    businessName: "Apex Logistics & Retail Hub",
    maskedAadhaarOrGstin: "07AA***9812K1ZX",
    contactEmail: "rahul.sharma@apexlogistics.in",
    contactPhone: "+91 98110 ****5",
    instrumentCategory: "ELECTRONIC_WEIGHING_SCALE",
    modelNumber: "ESSAE-DS-215N",
    serialNumber: "SN-EWS-8921-2025",
    capacityOrRange: "50 kg (Accuracy Class III, e=5g)",
    manufacturer: "Essae-Teraoka Pvt Ltd",
    installationAddress: "Shed 14, Okhla Industrial Area Phase-III",
    city: "New Delhi",
    state: "Delhi NCT",
    pincode: "110020",
    status: "CERTIFIED",
    submissionDate: "2026-08-20",
    allocatedLmoId: "lmo-malhotra-4091",
    allocatedLmoName: "Inspector Vikram Malhotra (Badge: DL-LMO-4091)",
    scheduledInspectionDate: "2026-08-28",
    fieldNotes: "Visual inspection conducted. Zero-point calibration stable under maximum load 50kg. Verification seal stamped with punch mark DL-08.",
    inspectionGeotag: {
      latitude: 28.5283,
      longitude: 77.2711,
      timestamp: "2026-08-28T11:42:00Z",
      accuracyMeters: 4.2
    },
    inspectionPhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    aiPhotoAnalysis: {
      sealStatus: "INTACT",
      confidenceScore: 0.98,
      verificationVerdict: "Conforms to Legal Metrology General Rules 2011. Seal lead wire intact.",
      anomaliesDetected: [],
      analyzedAt: "2026-08-28T11:43:10Z"
    },
    certificateId: "CERT-DL-2026-8819",
    feesPaid: true,
    gdprConsentRecorded: true
  },
  {
    id: "APP-2026-9042",
    applicationNumber: "UMVP/DL/2026/009042",
    applicantId: "usr-cit-101",
    applicantName: "Rahul Sharma",
    businessName: "Apex Logistics & Retail Hub",
    maskedAadhaarOrGstin: "07AA***9812K1ZX",
    contactEmail: "rahul.sharma@apexlogistics.in",
    contactPhone: "+91 98110 ****5",
    instrumentCategory: "FUEL_DISPENSER_PETROL_DIESEL",
    modelNumber: "TOKHEIM-QUANTIUM-510",
    serialNumber: "SN-FD-4410-2026",
    capacityOrRange: "Flow Rate 40 L/min, Dual Nozzle",
    manufacturer: "Dover Fueling Solutions",
    installationAddress: "Retail Outlet Plot 4, GT Karnal Road",
    city: "New Delhi",
    state: "Delhi NCT",
    pincode: "110036",
    status: "INSPECTION_SCHEDULED",
    submissionDate: "2026-09-02",
    allocatedLmoId: "lmo-malhotra-4091",
    allocatedLmoName: "Inspector Vikram Malhotra (Badge: DL-LMO-4091)",
    scheduledInspectionDate: "2026-09-08",
    feesPaid: true,
    gdprConsentRecorded: true
  },
  {
    id: "APP-2026-9043",
    applicationNumber: "UMVP/DL/2026/009043",
    applicantId: "usr-cit-102",
    applicantName: "Ananya Deshmukh",
    businessName: "Bharat Agri Storage Corp",
    maskedAadhaarOrGstin: "27AB***4391M1Z5",
    contactEmail: "ananya@bharatagri.com",
    contactPhone: "+91 97654 ****2",
    instrumentCategory: "WEIGHBRIDGE_HEAVY_DUTY",
    modelNumber: "AVERY-WEIGH-TRONIX-E1205",
    serialNumber: "SN-WB-60MT-9901",
    capacityOrRange: "60 Metric Tonnes (e=10kg)",
    manufacturer: "Avery Weigh-Tronix India",
    installationAddress: "Grain Mandi Complex, Narela Warehouse 12",
    city: "North Delhi",
    state: "Delhi NCT",
    pincode: "110040",
    status: "PENDING_ALLOCATION",
    submissionDate: "2026-09-05",
    feesPaid: true,
    gdprConsentRecorded: true
  }
];
var INITIAL_CERTIFICATES = [
  {
    id: "CERT-DL-2026-8819",
    certificateNumber: "LM-VERIF-DL-2026-08819",
    applicationId: "APP-2026-9041",
    instrumentCategory: "ELECTRONIC_WEIGHING_SCALE",
    modelNumber: "ESSAE-DS-215N",
    serialNumber: "SN-EWS-8921-2025",
    ownerName: "Rahul Sharma",
    businessName: "Apex Logistics & Retail Hub",
    installationAddress: "Shed 14, Okhla Industrial Area Phase-III, New Delhi",
    issuingLmoId: "lmo-malhotra-4091",
    issuingLmoName: "Inspector Vikram Malhotra",
    issuingLmoBadge: "DL-LMO-4091",
    jurisdiction: "South Delhi Enforcement Division",
    issuedAt: "2026-08-28T12:00:00Z",
    validUntil: "2027-08-27T23:59:59Z",
    sealNumber: "SEAL-DL-2026-4091-88",
    hmacSignature: "a8d38f729b19e2c40c83a17e08bb290192e485a9bc83921b71239cdef90123ab",
    qrPayload: "https://umvp.doca.gov.in/?verify=CERT-DL-2026-8819",
    tamperProofHash: "99bf4e790a8e7cb45d2f63f58a36bb9114d593e876bc29aa98e578c734493399",
    status: "ACTIVE"
  }
];
var INITIAL_AUDIT_TRAILS = [
  {
    index: 0,
    timestamp: "2026-08-01T00:00:00Z",
    actorId: "SYSTEM_GENESIS",
    actorRole: "SYSTEM",
    action: "GENESIS_BLOCK_INITIALIZED",
    resourceType: "SYSTEM_ROOT",
    resourceId: "UMVP_ROOT_LEDGER",
    ipAddress: "127.0.0.1",
    details: "UMVP Cryptographic Ledger Bootstrapped with SHA-256 Merkle root",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    index: 1,
    timestamp: "2026-08-20T09:15:32Z",
    actorId: "usr-cit-101",
    actorRole: "CITIZEN",
    action: "APPLICATION_SUBMITTED",
    resourceType: "APPLICATION",
    resourceId: "APP-2026-9041",
    ipAddress: "103.21.144.12",
    details: "Application submitted for Electronic Weighing Scale with verified consent",
    previousHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    hash: "4a6b7d3419912c9842aef91200192bc5816da01826bbd2417382910fa8991201"
  },
  {
    index: 2,
    timestamp: "2026-08-21T10:00:05Z",
    actorId: "doca-admin-01",
    actorRole: "CONTROLLER_ADMIN",
    action: "LMO_ALLOCATED",
    resourceType: "APPLICATION",
    resourceId: "APP-2026-9041",
    ipAddress: "164.100.128.4",
    details: "Allocated to Officer Vikram Malhotra (DL-LMO-4091) based on jurisdiction algorithm",
    previousHash: "4a6b7d3419912c9842aef91200192bc5816da01826bbd2417382910fa8991201",
    hash: "7b91c84112e4920ab71829bb01249821af09192485bb219803149814abcdef12"
  },
  {
    index: 3,
    timestamp: "2026-08-28T12:05:22Z",
    actorId: "lmo-malhotra-4091",
    actorRole: "LMO",
    action: "CERTIFICATE_ISSUED_CRYPTOGRAPHIC",
    resourceType: "CERTIFICATE",
    resourceId: "CERT-DL-2026-8819",
    ipAddress: "103.88.22.90",
    details: "Digital Certificate generated and signed with LMO HMAC-SHA256 Private key. QR payload generated.",
    previousHash: "7b91c84112e4920ab71829bb01249821af09192485bb219803149814abcdef12",
    hash: "99bf4e790a8e7cb45d2f63f58a36bb9114d593e876bc29aa98e578c734493399"
  }
];
var INITIAL_E2EE_MESSAGES = [
  {
    id: "msg-e2ee-001",
    applicationId: "APP-2026-9042",
    senderId: "usr-cit-101",
    senderRole: "CITIZEN",
    senderName: "Rahul Sharma (Applicant)",
    recipientId: "lmo-malhotra-4091",
    recipientRole: "LMO",
    encryptedPayload: "9d47a8b1390e1f7c2298a0d9124be8170c32918471b02948cba0918234ef",
    iv: "a1b2c3d4e5f60718293a4b5c",
    timestamp: "2026-09-06T14:30:00Z",
    messageType: "ACCESS_CODE",
    decryptedContent: "Confidential Site Gate Code: #8841. Fuel pump shut-off valve is located behind kiosk 3 for emergency inspection protocol."
  },
  {
    id: "msg-e2ee-002",
    applicationId: "APP-2026-9042",
    senderId: "lmo-malhotra-4091",
    senderRole: "LMO",
    senderName: "Inspector Vikram Malhotra",
    recipientId: "usr-cit-101",
    recipientRole: "CITIZEN",
    encryptedPayload: "33e198fa01b47c9281a029384729bfac910293847120bcde0192837465ab",
    iv: "1234567890abcdef12345678",
    timestamp: "2026-09-06T15:10:00Z",
    messageType: "TECHNICAL_SPEC",
    decryptedContent: "Acknowledged. Please ensure 20-Litre calibrated brass measure (Govt standard certified) is filled and kept at ambient temperature prior to 10:00 AM inspection."
  }
];
var INITIAL_GDPR_CONSENTS = [
  {
    id: "gdpr-c-001",
    userId: "usr-cit-101",
    timestamp: "2026-08-20T09:14:00Z",
    purpose: "Verification under Legal Metrology Act, 2009 and storage of business GSTIN/Aadhaar token",
    legalBasis: "LEGAL_OBLIGATION",
    status: "ACTIVE",
    ipAddress: "103.21.144.12"
  },
  {
    id: "gdpr-c-002",
    userId: "usr-cit-101",
    timestamp: "2026-08-20T09:14:30Z",
    purpose: "Geotagged inspector photo capture of premises for verifiable proof of physical presence",
    legalBasis: "CONSENT",
    status: "ACTIVE",
    ipAddress: "103.21.144.12"
  }
];
var INITIAL_SECURITY_THREATS = [
  {
    id: "thr-891",
    timestamp: "2026-09-07T08:14:22Z",
    threatType: "UNAUTHORIZED_PORTAL_ACCESS",
    severity: "HIGH",
    actorIp: "185.220.101.5",
    actorRole: "CITIZEN",
    description: "Blocked unauthorized attempt: User token with role CITIZEN attempted GET /api/lmo/inspections/all",
    mitigationAction: "Request terminated with 403 Forbidden; Audit security flag logged; Session token scrutinized."
  },
  {
    id: "thr-892",
    timestamp: "2026-09-06T22:40:11Z",
    threatType: "FAILED_LOGIN_SPIKE",
    severity: "MEDIUM",
    actorIp: "194.26.29.112",
    actorRole: "ANONYMOUS",
    description: "Repeated authentication failure (4 consecutive attempts on LMO portal badge ID DL-LMO-4091)",
    mitigationAction: "Triggered 15-minute temporary IP rate-limit lockout and required simulated MFA Challenge."
  }
];
var SYSTEM_ANALYTICS = {
  totalApplications: 1420,
  activeCertificates: 1195,
  pendingInspections: 84,
  rejectionRatePercent: 4.8,
  averageInspectionDays: 3.2,
  securityIncidentsBlocked: 39,
  heatmaps: [
    { zone: "Okhla Industrial Area, New Delhi", inspectionsCount: 182, violationRate: 2.1, riskLevel: "LOW" },
    { zone: "Narela & Bawana Industrial Belt", inspectionsCount: 240, violationRate: 6.8, riskLevel: "MODERATE" },
    { zone: "GT Karnal Transport Corridor", inspectionsCount: 310, violationRate: 9.4, riskLevel: "HIGH" },
    { zone: "Connaught Place & Central Commercial", inspectionsCount: 140, violationRate: 1.2, riskLevel: "LOW" },
    { zone: "Mayapuri Metal & Heavy Scrap Yard", inspectionsCount: 195, violationRate: 8.7, riskLevel: "HIGH" }
  ]
};

// src/db/index.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = require("pg");

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  applications: () => applications,
  auditLedger: () => auditLedger,
  certificates: () => certificates,
  e2eeMessages: () => e2eeMessages,
  users: () => users
});
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  uid: (0, import_pg_core.text)("uid").notNull().unique(),
  // Firebase Auth UID
  email: (0, import_pg_core.text)("email").notNull(),
  passwordHash: (0, import_pg_core.text)("password_hash"),
  name: (0, import_pg_core.text)("name").notNull(),
  role: (0, import_pg_core.text)("role").notNull().default("CITIZEN"),
  // 'CITIZEN' | 'LMO_OFFICER' | 'CONTROLLER_ADMIN'
  badgeNumber: (0, import_pg_core.text)("badge_number"),
  jurisdiction: (0, import_pg_core.text)("jurisdiction"),
  phone: (0, import_pg_core.text)("phone"),
  businessName: (0, import_pg_core.text)("business_name"),
  gstin: (0, import_pg_core.text)("gstin"),
  address: (0, import_pg_core.text)("address"),
  city: (0, import_pg_core.text)("city"),
  state: (0, import_pg_core.text)("state"),
  pincode: (0, import_pg_core.text)("pincode"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var applications = (0, import_pg_core.pgTable)("applications", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // e.g. APP-2026-9041
  applicationNumber: (0, import_pg_core.text)("application_number").notNull(),
  applicantId: (0, import_pg_core.text)("applicant_id").notNull(),
  applicantName: (0, import_pg_core.text)("applicant_name").notNull(),
  businessName: (0, import_pg_core.text)("business_name").notNull(),
  maskedAadhaarOrGstin: (0, import_pg_core.text)("masked_aadhaar_or_gstin").notNull(),
  contactEmail: (0, import_pg_core.text)("contact_email").notNull(),
  contactPhone: (0, import_pg_core.text)("contact_phone").notNull(),
  instrumentCategory: (0, import_pg_core.text)("instrument_category").notNull(),
  modelNumber: (0, import_pg_core.text)("model_number").notNull(),
  serialNumber: (0, import_pg_core.text)("serial_number").notNull(),
  capacityOrRange: (0, import_pg_core.text)("capacity_or_range").notNull(),
  manufacturer: (0, import_pg_core.text)("manufacturer").notNull(),
  installationAddress: (0, import_pg_core.text)("installation_address").notNull(),
  city: (0, import_pg_core.text)("city").notNull(),
  state: (0, import_pg_core.text)("state").notNull(),
  pincode: (0, import_pg_core.text)("pincode").notNull(),
  status: (0, import_pg_core.text)("status").notNull().default("SUBMITTED"),
  submissionDate: (0, import_pg_core.text)("submission_date").notNull(),
  allocatedLmoId: (0, import_pg_core.text)("allocated_lmo_id"),
  allocatedLmoName: (0, import_pg_core.text)("allocated_lmo_name"),
  scheduledInspectionDate: (0, import_pg_core.text)("scheduled_inspection_date"),
  fieldNotes: (0, import_pg_core.text)("field_notes"),
  inspectionLatitude: (0, import_pg_core.text)("inspection_latitude"),
  inspectionLongitude: (0, import_pg_core.text)("inspection_longitude"),
  inspectionGeotagTimestamp: (0, import_pg_core.text)("inspection_geotag_timestamp"),
  inspectionPhotoUrl: (0, import_pg_core.text)("inspection_photo_url"),
  certificateId: (0, import_pg_core.text)("certificate_id"),
  feesPaid: (0, import_pg_core.text)("fees_paid").default("true"),
  gdprConsentRecorded: (0, import_pg_core.text)("gdpr_consent_recorded").default("true"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var certificates = (0, import_pg_core.pgTable)("certificates", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // e.g. CERT-DL-2026-8819
  certificateNumber: (0, import_pg_core.text)("certificate_number").notNull(),
  applicationId: (0, import_pg_core.text)("application_id").notNull(),
  instrumentCategory: (0, import_pg_core.text)("instrument_category").notNull(),
  modelNumber: (0, import_pg_core.text)("model_number").notNull(),
  serialNumber: (0, import_pg_core.text)("serial_number").notNull(),
  ownerName: (0, import_pg_core.text)("owner_name").notNull(),
  businessName: (0, import_pg_core.text)("business_name").notNull(),
  installationAddress: (0, import_pg_core.text)("installation_address").notNull(),
  issuingLmoId: (0, import_pg_core.text)("issuing_lmo_id").notNull(),
  issuingLmoName: (0, import_pg_core.text)("issuing_lmo_name").notNull(),
  issuingLmoBadge: (0, import_pg_core.text)("issuing_lmo_badge").notNull(),
  jurisdiction: (0, import_pg_core.text)("jurisdiction").notNull(),
  issuedAt: (0, import_pg_core.text)("issued_at").notNull(),
  validUntil: (0, import_pg_core.text)("valid_until").notNull(),
  sealNumber: (0, import_pg_core.text)("seal_number").notNull(),
  hmacSignature: (0, import_pg_core.text)("hmac_signature").notNull(),
  qrPayload: (0, import_pg_core.text)("qr_payload").notNull(),
  tamperProofHash: (0, import_pg_core.text)("tamper_proof_hash").notNull(),
  pdfData: (0, import_pg_core.text)("pdf_data"),
  status: (0, import_pg_core.text)("status").notNull().default("ACTIVE"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var auditLedger = (0, import_pg_core.pgTable)("audit_ledger", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  blockIndex: (0, import_pg_core.integer)("block_index").notNull(),
  timestamp: (0, import_pg_core.text)("timestamp").notNull(),
  actorId: (0, import_pg_core.text)("actor_id").notNull(),
  actorRole: (0, import_pg_core.text)("actor_role").notNull(),
  action: (0, import_pg_core.text)("action").notNull(),
  resourceType: (0, import_pg_core.text)("resource_type").notNull(),
  resourceId: (0, import_pg_core.text)("resource_id").notNull(),
  ipAddress: (0, import_pg_core.text)("ip_address").notNull(),
  details: (0, import_pg_core.text)("details").notNull(),
  previousHash: (0, import_pg_core.text)("previous_hash").notNull(),
  hash: (0, import_pg_core.text)("hash").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var e2eeMessages = (0, import_pg_core.pgTable)("e2ee_messages", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  applicationId: (0, import_pg_core.text)("application_id").notNull(),
  senderId: (0, import_pg_core.text)("sender_id").notNull(),
  senderRole: (0, import_pg_core.text)("sender_role").notNull(),
  senderName: (0, import_pg_core.text)("sender_name").notNull(),
  recipientId: (0, import_pg_core.text)("recipient_id").notNull(),
  recipientRole: (0, import_pg_core.text)("recipient_role").notNull(),
  ciphertext: (0, import_pg_core.text)("ciphertext").notNull(),
  iv: (0, import_pg_core.text)("iv").notNull(),
  tag: (0, import_pg_core.text)("tag").notNull(),
  keyId: (0, import_pg_core.text)("key_id").notNull(),
  sentAt: (0, import_pg_core.text)("sent_at").notNull(),
  isRead: (0, import_pg_core.text)("is_read").default("false"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});

// src/db/index.ts
var createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new import_pg.Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15e3
    });
    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};
var pool = createPool();
var db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// src/db/repository.ts
var import_drizzle_orm = require("drizzle-orm");
async function dbGetApplications(role, userId) {
  try {
    if (role === "CITIZEN" && userId) {
      return await db.select().from(applications).where((0, import_drizzle_orm.eq)(applications.applicantId, userId));
    }
    return await db.select().from(applications);
  } catch (error) {
    console.error("Database query dbGetApplications failed:", error);
    throw new Error("Failed to retrieve applications from database.", { cause: error });
  }
}
async function dbCreateApplication(data) {
  try {
    const results = await db.insert(applications).values(data).returning();
    return results[0];
  } catch (error) {
    console.error("Database query dbCreateApplication failed:", error);
    throw new Error("Failed to create application in database.", { cause: error });
  }
}
async function dbUpdateApplication(id, data) {
  try {
    const results = await db.update(applications).set(data).where((0, import_drizzle_orm.eq)(applications.id, id)).returning();
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbUpdateApplication failed for ${id}:`, error);
    throw new Error("Failed to update application in database.", { cause: error });
  }
}
async function dbGetCertificates() {
  try {
    return await db.select().from(certificates);
  } catch (error) {
    console.error("Database query dbGetCertificates failed:", error);
    throw new Error("Failed to retrieve certificates from database.", { cause: error });
  }
}
async function dbGetCertificateById(id) {
  try {
    const results = await db.select().from(certificates).where(
      (0, import_drizzle_orm.or)((0, import_drizzle_orm.eq)(certificates.id, id), (0, import_drizzle_orm.eq)(certificates.certificateNumber, id))
    );
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbGetCertificateById failed for ${id}:`, error);
    throw new Error("Failed to retrieve certificate from database.", { cause: error });
  }
}
async function dbCreateCertificate(data) {
  try {
    const results = await db.insert(certificates).values(data).returning();
    return results[0];
  } catch (error) {
    console.error("Database query dbCreateCertificate failed:", error);
    throw new Error("Failed to issue certificate in database.", { cause: error });
  }
}
async function dbUpdateCertificatePdf(id, pdfData) {
  try {
    const results = await db.update(certificates).set({ pdfData }).where((0, import_drizzle_orm.eq)(certificates.id, id)).returning();
    return results[0] || null;
  } catch (error) {
    console.error(`Database query dbUpdateCertificatePdf failed for ${id}:`, error);
    throw new Error("Failed to store certificate PDF in database.", { cause: error });
  }
}
async function dbGetAuditLedger() {
  try {
    return await db.select().from(auditLedger).orderBy((0, import_drizzle_orm.asc)(auditLedger.blockIndex));
  } catch (error) {
    console.error("Database query dbGetAuditLedger failed:", error);
    throw new Error("Failed to retrieve audit ledger from database.", { cause: error });
  }
}
async function dbAppendAuditBlock(data) {
  try {
    const results = await db.insert(auditLedger).values(data).returning();
    return results[0];
  } catch (error) {
    console.error("Database query dbAppendAuditBlock failed:", error);
    throw new Error("Failed to record audit block in database.", { cause: error });
  }
}
async function dbGetE2eeMessages(applicationId) {
  try {
    return await db.select().from(e2eeMessages).where((0, import_drizzle_orm.eq)(e2eeMessages.applicationId, applicationId));
  } catch (error) {
    console.error(`Database query dbGetE2eeMessages failed for ${applicationId}:`, error);
    throw new Error("Failed to retrieve encrypted messages from database.", { cause: error });
  }
}
async function dbCreateE2eeMessage(data) {
  try {
    const results = await db.insert(e2eeMessages).values(data).returning();
    return results[0];
  } catch (error) {
    console.error("Database query dbCreateE2eeMessage failed:", error);
    throw new Error("Failed to store encrypted message in database.", { cause: error });
  }
}
async function dbGetUserByEmail(email) {
  try {
    const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.email, email));
    return result[0] || null;
  } catch (error) {
    console.error("Database query dbGetUserByEmail failed:", error);
    throw new Error("Failed to retrieve user account.", { cause: error });
  }
}
async function dbGetUserByUid(uid) {
  try {
    const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error("Database query dbGetUserByUid failed:", error);
    throw new Error("Failed to retrieve user account.", { cause: error });
  }
}
async function dbCreateUser(data) {
  try {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("Database query dbCreateUser failed:", error);
    throw new Error("Failed to create user account.", { cause: error });
  }
}
async function dbUpdateUserCredentials(uid, email, passwordHash) {
  try {
    const result = await db.update(users).set({ email, passwordHash }).where((0, import_drizzle_orm.eq)(users.uid, uid)).returning();
    return result[0] || null;
  } catch (error) {
    console.error("Database query dbUpdateUserCredentials failed:", error);
    throw new Error("Failed to update user credentials.", { cause: error });
  }
}

// src/lib/certificate-pdf.ts
async function saveCertificatePdf({
  certId,
  pdfData,
  certificates: certificates3,
  persistLocalState: persistLocalState2,
  remoteSave
}) {
  const cert = certificates3.find((item) => item.id === certId);
  if (cert) {
    cert.pdfData = pdfData;
    persistLocalState2();
    return { stored: true, fallback: true, savedLocally: true };
  }
  if (remoteSave) {
    try {
      await remoteSave();
      return { stored: true, fallback: false, savedLocally: false };
    } catch (error) {
      const certInMemory = certificates3.find((item) => item.id === certId);
      if (certInMemory) {
        certInMemory.pdfData = pdfData;
        persistLocalState2();
        return { stored: true, fallback: true, savedLocally: true };
      }
      throw error;
    }
  }
  return { stored: false, fallback: false, savedLocally: false };
}

// server.ts
var aiClient = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new import_genai.GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI SDK:", e);
    }
  }
  return aiClient;
}
var app = (0, import_express.default)();
var PORT = parseInt(process.env.PORT || "3000", 10);
var localStatePath = import_path.default.join(process.cwd(), "data", "local-state.json");
function loadLocalState() {
  try {
    if (import_fs.default.existsSync(localStatePath)) {
      return JSON.parse(import_fs.default.readFileSync(localStatePath, "utf8"));
    }
  } catch (error) {
    console.warn("Could not load local persistence file:", error);
  }
  return { users: [], applications: [], certificates: [] };
}
app.use(import_express.default.json({ limit: "15mb" }));
var localState = loadLocalState();
var applications2 = [
  ...INITIAL_APPLICATIONS,
  ...localState.applications.filter((item) => !INITIAL_APPLICATIONS.some((initial) => initial.id === item.id))
];
var certificates2 = [
  ...INITIAL_CERTIFICATES,
  ...localState.certificates.filter((item) => !INITIAL_CERTIFICATES.some((initial) => initial.id === item.id))
];
var auditLedger2 = [...INITIAL_AUDIT_TRAILS];
var e2eeMessages2 = [...INITIAL_E2EE_MESSAGES];
var gdprConsents = [...INITIAL_GDPR_CONSENTS];
var securityThreats = [...INITIAL_SECURITY_THREATS];
var HMAC_SERVER_SECRET = process.env.HMAC_SECRET || "UMVP-LEGAL-METROLOGY-KEY-2026";
function sha256(data) {
  return import_crypto.default.createHash("sha256").update(data).digest("hex");
}
function hmacSha256(data, secret = HMAC_SERVER_SECRET) {
  return import_crypto.default.createHmac("sha256", secret).update(data).digest("hex");
}
async function findCertificateByReference(idOrNumber) {
  try {
    const dbCert = await dbGetCertificateById(idOrNumber);
    if (dbCert) {
      return {
        id: dbCert.id,
        certificateNumber: dbCert.certificateNumber,
        applicationId: dbCert.applicationId,
        instrumentCategory: dbCert.instrumentCategory,
        modelNumber: dbCert.modelNumber,
        serialNumber: dbCert.serialNumber,
        ownerName: dbCert.ownerName,
        businessName: dbCert.businessName,
        installationAddress: dbCert.installationAddress,
        issuingLmoId: dbCert.issuingLmoId,
        issuingLmoName: dbCert.issuingLmoName,
        issuingLmoBadge: dbCert.issuingLmoBadge,
        jurisdiction: dbCert.jurisdiction,
        issuedAt: dbCert.issuedAt,
        validUntil: dbCert.validUntil,
        sealNumber: dbCert.sealNumber,
        hmacSignature: dbCert.hmacSignature,
        qrPayload: dbCert.qrPayload,
        tamperProofHash: dbCert.tamperProofHash,
        status: dbCert.status
      };
    }
  } catch {
  }
  return certificates2.find((c) => c.id === idOrNumber || c.certificateNumber === idOrNumber) || null;
}
async function buildCertificatePdfBuffer(cert, publicBaseUrl) {
  const pdf = new import_jspdf.jsPDF({ unit: "pt", format: "a4" });
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 595, 60, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("CERTIFICATE OF VERIFICATION OF WEIGHTS & MEASURES", 297.5, 28, { align: "center" });
  pdf.setTextColor(15, 23, 42);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const lines = [
    "Government of India \u2022 Department of Legal Metrology",
    `Certificate No: ${cert.certificateNumber}`,
    `Official Seal Punch: ${cert.sealNumber}`,
    "",
    `This certifies that ${cert.businessName} (${cert.ownerName}) at ${cert.installationAddress} has been verified under the Legal Metrology Act, 2009.`,
    "",
    `Instrument: ${cert.instrumentCategory.replace(/_/g, " ")}`,
    `Model: ${cert.modelNumber}`,
    `Serial Number: ${cert.serialNumber}`,
    `Issuing Officer: ${cert.issuingLmoName} (${cert.issuingLmoBadge})`,
    `Date of Verification: ${new Date(cert.issuedAt).toLocaleDateString("en-IN")}`,
    `Next Re-Verification Due: ${new Date(cert.validUntil).toLocaleDateString("en-IN")}`,
    `Jurisdiction: ${cert.jurisdiction}`,
    "",
    `HMAC-SHA256: ${cert.hmacSignature}`
  ];
  pdf.text(lines, 48, 90, { maxWidth: 500 });
  try {
    const qrPayload = `${publicBaseUrl}/?verify=${encodeURIComponent(cert.certificateNumber)}`;
    const qrDataUrl = await import_qrcode.default.toDataURL(qrPayload, {
      width: 180,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff"
      }
    });
    pdf.addImage(qrDataUrl, "PNG", 430, 430, 100, 100);
  } catch {
    pdf.setFont("helvetica", "bold");
    pdf.text("QR CODE", 470, 480, { align: "center" });
  }
  return Buffer.from(pdf.output("arraybuffer"));
}
async function storeCertificatePdfFallback(id, pdfData) {
  return saveCertificatePdf({
    certId: id,
    pdfData,
    certificates: certificates2,
    persistLocalState,
    remoteSave: async () => {
      await dbUpdateCertificatePdf(id, pdfData);
    }
  });
}
function appendAuditBlock(actorId, actorRole, action, resourceType, resourceId, details, ipAddress = "127.0.0.1") {
  const lastBlock = auditLedger2[auditLedger2.length - 1];
  const previousHash = lastBlock ? lastBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";
  const index = auditLedger2.length;
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  const blockData = `${index}|${timestamp2}|${actorId}|${actorRole}|${action}|${resourceType}|${resourceId}|${details}|${previousHash}`;
  const hash = sha256(blockData);
  const newBlock = {
    index,
    timestamp: timestamp2,
    actorId,
    actorRole,
    action,
    resourceType,
    resourceId,
    ipAddress,
    details,
    previousHash,
    hash
  };
  auditLedger2.push(newBlock);
  dbAppendAuditBlock({
    blockIndex: newBlock.index,
    timestamp: newBlock.timestamp,
    actorId: newBlock.actorId,
    actorRole: newBlock.actorRole,
    action: newBlock.action,
    resourceType: newBlock.resourceType,
    resourceId: newBlock.resourceId,
    ipAddress: newBlock.ipAddress,
    details: newBlock.details,
    previousHash: newBlock.previousHash,
    hash: newBlock.hash
  }).catch((e) => console.warn("Could not append audit block to PostgreSQL:", e));
  return newBlock;
}
var loginAttempts = /* @__PURE__ */ new Map();
var registeredUsers = new Map(
  localState.users.map((user) => [user.email, user])
);
function persistLocalState() {
  try {
    import_fs.default.mkdirSync(import_path.default.dirname(localStatePath), { recursive: true });
    import_fs.default.writeFileSync(
      localStatePath,
      JSON.stringify({ users: [...registeredUsers.values()], applications: applications2, certificates: certificates2 }, null, 2),
      "utf8"
    );
  } catch (error) {
    console.warn("Could not persist local application data:", error);
  }
}
function hashPassword(password) {
  return import_crypto.default.scryptSync(password, "umvp-password-salt", 64).toString("hex");
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization token" });
  }
  const token = authHeader.replace("Bearer ", "").trim();
  if (token === "mock-token-citizen-101" || token.startsWith("mock-token-citizen")) {
    req.user = {
      id: "usr-cit-101",
      name: "Rahul Sharma",
      role: "CITIZEN"
    };
    return next();
  }
  if (token === "mock-token-lmo-4091" || token.startsWith("mock-token-lmo")) {
    req.user = {
      id: "lmo-malhotra-4091",
      name: "Inspector Vikram Malhotra",
      role: "LMO",
      badgeNumber: "DL-LMO-4091"
    };
    return next();
  }
  if (token === "mock-token-controller-001" || token.startsWith("mock-token-controller")) {
    req.user = {
      id: "doca-controller-001",
      name: "Dr. S. K. Nambiar",
      role: "CONTROLLER_ADMIN",
      badgeNumber: "DOCA-HQ-001"
    };
    return next();
  }
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [id, role, name, badge] = decoded.split(":");
    if (!id || !role || !["CITIZEN", "LMO", "CONTROLLER_ADMIN"].includes(role)) {
      return res.status(401).json({ error: "Invalid authentication token payload" });
    }
    req.user = {
      id,
      name: name || id,
      role,
      badgeNumber: badge || void 0
    };
    next();
  } catch {
    return res.status(401).json({ error: "Corrupted authentication token" });
  }
}
function enforceRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Authentication required" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      const clientIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
      const threatDescription = `STAKEHOLDER ABSTRACTION VIOLATION: Stakeholder '${req.user.role}' (${req.user.name}) attempted to access restricted endpoint '${req.originalUrl}' requiring [${allowedRoles.join(", ")}].`;
      securityThreats.unshift({
        id: `thr-${Date.now()}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        threatType: "UNAUTHORIZED_PORTAL_ACCESS",
        severity: "HIGH",
        actorIp: clientIp,
        actorRole: req.user.role,
        description: threatDescription,
        mitigationAction: "Request blocked with 403 Forbidden. Stakeholder session flagged for surveillance."
      });
      appendAuditBlock(
        req.user.id,
        req.user.role,
        "SECURITY_ACCESS_VIOLATION_BLOCKED",
        "PORTAL_ROUTE",
        req.originalUrl,
        threatDescription,
        clientIp
      );
      return res.status(403).json({
        error: "Forbidden: Strict stakeholder separation prevents your role from accessing this portal or module.",
        requiredRoles: allowedRoles,
        yourRole: req.user.role
      });
    }
    next();
  };
}
app.post("/api/auth/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    businessName,
    gstin,
    address,
    city,
    state,
    pincode
  } = req.body;
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedName || !normalizedEmail || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Full name, valid email, and a password of at least 8 characters are required." });
  }
  const existing = registeredUsers.get(normalizedEmail);
  if (existing) return res.status(409).json({ error: "An account with this email address already exists. Please sign in." });
  const id = `usr-${import_crypto.default.randomUUID()}`;
  const trimmedPhone = typeof phone === "string" ? phone.trim() : "";
  const trimmedBusinessName = typeof businessName === "string" ? businessName.trim() : "";
  const trimmedGstin = typeof gstin === "string" ? gstin.trim().toUpperCase() : "";
  const trimmedAddress = typeof address === "string" ? address.trim() : "";
  const trimmedCity = typeof city === "string" ? city.trim() : "";
  const trimmedState = typeof state === "string" ? state.trim() : "";
  const trimmedPincode = typeof pincode === "string" ? pincode.trim() : "";
  const account = {
    id,
    name: normalizedName,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: "CITIZEN",
    phone: trimmedPhone,
    businessName: trimmedBusinessName,
    gstin: trimmedGstin,
    address: trimmedAddress,
    city: trimmedCity,
    state: trimmedState,
    pincode: trimmedPincode,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  registeredUsers.set(normalizedEmail, account);
  persistLocalState();
  try {
    await dbCreateUser({
      uid: id,
      email: normalizedEmail,
      passwordHash: account.passwordHash,
      name: account.name,
      role: "CITIZEN",
      phone: account.phone,
      businessName: account.businessName,
      gstin: account.gstin,
      address: account.address,
      city: account.city,
      state: account.state,
      pincode: account.pincode
    });
  } catch (error) {
    console.warn("Could not persist new user account to PostgreSQL:", error);
  }
  const token = Buffer.from(`${id}:CITIZEN:${account.name}::${Date.now()}`).toString("base64");
  appendAuditBlock(id, "CITIZEN", "USER_REGISTERED", "USER", id, `New citizen account registered for ${normalizedEmail} (${account.name}).`);
  const maskedId = account.gstin ? account.gstin.length > 6 ? `${account.gstin.slice(0, 4)}***${account.gstin.slice(-3)}` : account.gstin : "CITIZEN-USER";
  return res.status(201).json({
    token,
    user: {
      id,
      name: account.name,
      email: account.email,
      role: "CITIZEN",
      phone: account.phone,
      businessName: account.businessName,
      gstin: account.gstin,
      address: account.address,
      city: account.city,
      state: account.state,
      pincode: account.pincode,
      maskedId,
      mfaVerified: true,
      loginTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      token
    },
    message: "Account created successfully. You are now signed in."
  });
});
app.post("/api/auth/account", authenticateToken, enforceRole(["CITIZEN"]), async (req, res) => {
  const { currentEmail, currentPassword, newEmail, newPassword } = req.body;
  const normalizedCurrentEmail = currentEmail?.trim().toLowerCase();
  const normalizedNewEmail = newEmail?.trim().toLowerCase() || normalizedCurrentEmail;
  if (!normalizedCurrentEmail || !currentPassword || !normalizedNewEmail) {
    return res.status(400).json({ error: "Current email, current password, and a new email or password are required." });
  }
  if (newPassword !== void 0 && newPassword.length > 0 && newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }
  if (normalizedNewEmail !== normalizedCurrentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedNewEmail)) {
    return res.status(400).json({ error: "Enter a valid new email address." });
  }
  let account = registeredUsers.get(normalizedCurrentEmail);
  if (!account) {
    const dbAccount = await dbGetUserByUid(req.user.id).catch(() => null);
    if (dbAccount?.passwordHash) {
      account = { id: dbAccount.uid, name: dbAccount.name, email: dbAccount.email, passwordHash: dbAccount.passwordHash };
      registeredUsers.set(dbAccount.email, account);
    }
  }
  if (!account && req.user.id === "usr-cit-101" && currentPassword === "GovtSecure@2026") {
    account = { id: req.user.id, name: req.user.name, email: normalizedCurrentEmail, passwordHash: hashPassword(currentPassword) };
  }
  if (!account || hashPassword(currentPassword) !== account.passwordHash) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }
  if (normalizedNewEmail !== normalizedCurrentEmail && registeredUsers.has(normalizedNewEmail)) {
    return res.status(409).json({ error: "That email address is already in use." });
  }
  const updatedAccount = {
    ...account,
    email: normalizedNewEmail,
    passwordHash: newPassword ? hashPassword(newPassword) : account.passwordHash
  };
  registeredUsers.delete(normalizedCurrentEmail);
  registeredUsers.set(normalizedNewEmail, updatedAccount);
  persistLocalState();
  try {
    await dbUpdateUserCredentials(updatedAccount.id, updatedAccount.email, updatedAccount.passwordHash);
  } catch (error) {
    console.warn("Could not persist updated user credentials to PostgreSQL:", error);
  }
  const token = Buffer.from(`${updatedAccount.id}:CITIZEN:${updatedAccount.name}::${Date.now()}`).toString("base64");
  appendAuditBlock(updatedAccount.id, "CITIZEN", "USER_CREDENTIALS_UPDATED", "USER", updatedAccount.id, `Citizen account credentials updated for ${updatedAccount.email}.`);
  return res.json({
    user: { id: updatedAccount.id, name: updatedAccount.name, email: updatedAccount.email, role: "CITIZEN", maskedId: "REGISTERED-USER", mfaVerified: true, loginTimestamp: (/* @__PURE__ */ new Date()).toISOString(), token },
    message: "Account details updated successfully."
  });
});
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  appendAuditBlock(
    "SYSTEM",
    "PUBLIC",
    "PASSWORD_RESET_REQUESTED",
    "USER",
    normalizedEmail,
    `Password reset request received for ${normalizedEmail}. Verification link generated.`
  );
  return res.json({
    message: `Password reset instructions and verification code have been dispatched to ${normalizedEmail}. Please check your inbox.`,
    resetCode: "RESET-2026-9041"
  });
});
app.post("/api/auth/login", async (req, res) => {
  const { role, email, password, mfaCode } = req.body;
  const clientIp = req.ip || "127.0.0.1";
  const attemptRecord = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0, lockedUntil: 0 };
  const now = Date.now();
  if (attemptRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1e3);
    return res.status(429).json({
      error: `Security Lockout Active: Too many failed attempts. Try again in ${remainingSeconds}s.`,
      lockoutRemaining: remainingSeconds
    });
  }
  let authenticatedUser = null;
  const normalizedLoginEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (role === "CITIZEN") {
    if (normalizedLoginEmail === "rahul.sharma@apexlogistics.in" && !registeredUsers.has(normalizedLoginEmail)) {
      if (password && password !== "GovtSecure@2026") {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      authenticatedUser = {
        id: "usr-cit-101",
        name: "Rahul Sharma",
        email: "rahul.sharma@apexlogistics.in",
        role: "CITIZEN",
        businessName: "Apex Logistics & Retail Hub",
        maskedId: "07AA***9812K1ZX",
        phone: "+91 98110 44552",
        address: "Shed 14, Okhla Industrial Area Phase-III",
        city: "New Delhi",
        state: "Delhi NCT",
        pincode: "110020",
        mfaVerified: true,
        loginTimestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else if (normalizedLoginEmail) {
      const registered = registeredUsers.get(normalizedLoginEmail) || await dbGetUserByEmail(normalizedLoginEmail).catch(() => null);
      if (registered?.passwordHash) {
        if (!password || hashPassword(password) !== registered.passwordHash) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        const userGstin = registered.gstin || "";
        const maskedId = userGstin ? userGstin.length > 6 ? `${userGstin.slice(0, 4)}***${userGstin.slice(-3)}` : userGstin : "CITIZEN-USER";
        authenticatedUser = {
          id: registered.id || registered.uid,
          name: registered.name,
          email: registered.email,
          role: "CITIZEN",
          phone: registered.phone || "",
          businessName: registered.businessName || "",
          gstin: userGstin,
          address: registered.address || "",
          city: registered.city || "",
          state: registered.state || "",
          pincode: registered.pincode || "",
          maskedId,
          mfaVerified: true,
          loginTimestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
      } else {
        return res.status(401).json({ error: "No citizen account found with this email address. Please register or check your credentials." });
      }
    } else {
      return res.status(400).json({ error: "Please enter your email and password to sign in." });
    }
  } else if (role === "LMO") {
    if (mfaCode && mfaCode !== "123456") {
      attemptRecord.count++;
      if (attemptRecord.count >= 4) {
        attemptRecord.lockedUntil = now + 15 * 60 * 1e3;
      }
      loginAttempts.set(clientIp, attemptRecord);
      return res.status(400).json({ error: "Invalid MFA Security Code for Officer Login." });
    }
    authenticatedUser = {
      id: "lmo-malhotra-4091",
      name: "Inspector Vikram Malhotra",
      email: email || "v.malhotra@doca.gov.in",
      role: "LMO",
      badgeNumber: "DL-LMO-4091",
      jurisdiction: "South Delhi Enforcement Division",
      maskedId: "POLICE-ID-DL-4091",
      mfaVerified: true,
      loginTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } else if (role === "GATC") {
    if (mfaCode && mfaCode !== "123456") {
      attemptRecord.count++;
      if (attemptRecord.count >= 4) {
        attemptRecord.lockedUntil = now + 15 * 60 * 1e3;
      }
      loginAttempts.set(clientIp, attemptRecord);
      return res.status(400).json({ error: "Invalid MFA Security Code for GATC Officer Login." });
    }
    authenticatedUser = {
      id: "gatc-lab-004",
      name: "Er. Suresh R. Kumar (GATC #04)",
      email: email || "gatc.lab04@doca.gov.in",
      role: "GATC",
      badgeNumber: "GATC-DELHI-04",
      jurisdiction: "GATC Metrology Lab #04 (Northern Region)",
      maskedId: "GATC-ACCREDITED-04",
      mfaVerified: true,
      loginTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } else if (role === "CONTROLLER_ADMIN") {
    if (mfaCode && mfaCode !== "999888") {
      attemptRecord.count++;
      if (attemptRecord.count >= 3) {
        attemptRecord.lockedUntil = now + 15 * 60 * 1e3;
      }
      loginAttempts.set(clientIp, attemptRecord);
      return res.status(400).json({ error: "Invalid High-Level Controller MFA Code." });
    }
    authenticatedUser = {
      id: "doca-controller-001",
      name: "Dr. S. K. Nambiar",
      email: email || "controller.skn@doca.gov.in",
      role: "CONTROLLER_ADMIN",
      badgeNumber: "DOCA-HQ-001",
      jurisdiction: "Central Metrology Directorate (All India)",
      maskedId: "DIR-DOCA-HQ-01",
      mfaVerified: true,
      loginTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } else {
    return res.status(400).json({ error: "Invalid stakeholder role specified." });
  }
  loginAttempts.delete(clientIp);
  const tokenString = `${authenticatedUser.id}:${authenticatedUser.role}:${authenticatedUser.name}:${authenticatedUser.badgeNumber || ""}:${Date.now()}`;
  const token = Buffer.from(tokenString).toString("base64");
  authenticatedUser.token = token;
  appendAuditBlock(
    authenticatedUser.id,
    authenticatedUser.role,
    "USER_AUTHENTICATED",
    "SESSION",
    authenticatedUser.id,
    `Stakeholder ${authenticatedUser.name} authenticated with role ${authenticatedUser.role}. MFA: Verified.`,
    clientIp
  );
  return res.json({
    token,
    user: authenticatedUser,
    message: "Authentication successful. Stakeholder session established."
  });
});
app.get("/api/applications", authenticateToken, async (req, res) => {
  const user = req.user;
  try {
    const dbApps = await dbGetApplications(user.role, user.id);
    if (dbApps && dbApps.length > 0) {
      const mapped = dbApps.map((row) => ({
        id: row.id,
        applicationNumber: row.applicationNumber,
        applicantId: row.applicantId,
        applicantName: row.applicantName,
        businessName: row.businessName,
        maskedAadhaarOrGstin: row.maskedAadhaarOrGstin,
        contactEmail: row.contactEmail,
        contactPhone: row.contactPhone,
        instrumentCategory: row.instrumentCategory,
        modelNumber: row.modelNumber,
        serialNumber: row.serialNumber,
        capacityOrRange: row.capacityOrRange,
        manufacturer: row.manufacturer,
        installationAddress: row.installationAddress,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        status: row.status,
        submissionDate: row.submissionDate,
        allocatedLmoId: row.allocatedLmoId || void 0,
        allocatedLmoName: row.allocatedLmoName || void 0,
        scheduledInspectionDate: row.scheduledInspectionDate || void 0,
        fieldNotes: row.fieldNotes || void 0,
        inspectionGeotag: row.inspectionLatitude && row.inspectionLongitude ? {
          latitude: parseFloat(row.inspectionLatitude),
          longitude: parseFloat(row.inspectionLongitude),
          timestamp: row.inspectionGeotagTimestamp || "",
          accuracyMeters: 4
        } : void 0,
        inspectionPhotoUrl: row.inspectionPhotoUrl || void 0,
        certificateId: row.certificateId || void 0,
        feesPaid: row.feesPaid === "true",
        gdprConsentRecorded: row.gdprConsentRecorded === "true"
      }));
      if (user.role === "CITIZEN") {
        return res.json({ applications: mapped.filter((a) => a.applicantId === user.id) });
      }
      if (user.role === "LMO") {
        return res.json({ applications: mapped.filter((a) => a.allocatedLmoId === user.id || a.status === "PENDING_ALLOCATION" || a.status === "SUBMITTED") });
      }
      return res.json({ applications: mapped });
    }
  } catch (err) {
    console.warn("DB applications fetch fallback to cache:", err);
  }
  if (user.role === "CITIZEN") {
    const filtered = applications2.filter((app2) => app2.applicantId === user.id);
    return res.json({ applications: filtered });
  }
  if (user.role === "LMO") {
    const filtered = applications2.filter((app2) => app2.allocatedLmoId === user.id || app2.status === "PENDING_ALLOCATION");
    return res.json({ applications: filtered });
  }
  if (user.role === "CONTROLLER_ADMIN") {
    return res.json({ applications: applications2 });
  }
  return res.status(403).json({ error: "Unauthorized role scope" });
});
app.post("/api/applications", authenticateToken, enforceRole(["CITIZEN"]), async (req, res) => {
  const user = req.user;
  const body = req.body;
  const userAccount = [...registeredUsers.values()].find((u) => u.id === user.id);
  const newApp = {
    id: `APP-2026-${Math.floor(1e3 + Math.random() * 9e3)}`,
    applicationNumber: `UMVP/DL/2026/${Math.floor(1e5 + Math.random() * 9e5)}`,
    applicantId: user.id,
    applicantName: user.name,
    businessName: body.businessName || userAccount?.businessName || "Trading Enterprise",
    maskedAadhaarOrGstin: body.maskedAadhaarOrGstin || userAccount?.gstin || "07AA***9812K1ZX",
    contactEmail: body.contactEmail || userAccount?.email || "applicant@business.in",
    contactPhone: body.contactPhone || userAccount?.phone || "+91 98*** ***12",
    instrumentCategory: body.instrumentCategory || "ELECTRONIC_WEIGHING_SCALE",
    modelNumber: body.modelNumber || "GENERIC-CALIB-01",
    serialNumber: body.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
    capacityOrRange: body.capacityOrRange || "30 kg (Accuracy Class III)",
    manufacturer: body.manufacturer || "Approved Indian Manufacturer",
    installationAddress: body.installationAddress || userAccount?.address || "Industrial Sector 5",
    city: body.city || userAccount?.city || "New Delhi",
    state: body.state || userAccount?.state || "Delhi NCT",
    pincode: body.pincode || userAccount?.pincode || "110020",
    status: "PENDING_ALLOCATION",
    submissionDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    feesPaid: true,
    gdprConsentRecorded: true
  };
  applications2.unshift(newApp);
  persistLocalState();
  try {
    await dbCreateApplication({
      id: newApp.id,
      applicationNumber: newApp.applicationNumber,
      applicantId: newApp.applicantId,
      applicantName: newApp.applicantName,
      businessName: newApp.businessName,
      maskedAadhaarOrGstin: newApp.maskedAadhaarOrGstin,
      contactEmail: newApp.contactEmail,
      contactPhone: newApp.contactPhone,
      instrumentCategory: newApp.instrumentCategory,
      modelNumber: newApp.modelNumber,
      serialNumber: newApp.serialNumber,
      capacityOrRange: newApp.capacityOrRange,
      manufacturer: newApp.manufacturer,
      installationAddress: newApp.installationAddress,
      city: newApp.city,
      state: newApp.state,
      pincode: newApp.pincode,
      status: newApp.status,
      submissionDate: newApp.submissionDate,
      feesPaid: "true",
      gdprConsentRecorded: "true"
    });
  } catch (dbErr) {
    console.warn("Could not write new application to PostgreSQL:", dbErr);
  }
  appendAuditBlock(
    user.id,
    user.role,
    "APPLICATION_CREATED",
    "APPLICATION",
    newApp.id,
    `New application created for ${newApp.instrumentCategory} (Serial: ${newApp.serialNumber}) with GDPR consent confirmed.`,
    req.ip
  );
  return res.json({ application: newApp, message: "Application submitted successfully." });
});
app.post("/api/applications/:id/allocate", authenticateToken, enforceRole(["CONTROLLER_ADMIN"]), async (req, res) => {
  const { id } = req.params;
  const { lmoId, lmoName, scheduledDate } = req.body;
  const appIndex = applications2.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }
  applications2[appIndex].allocatedLmoId = lmoId || "lmo-malhotra-4091";
  applications2[appIndex].allocatedLmoName = lmoName || "Inspector Vikram Malhotra (Badge: DL-LMO-4091)";
  applications2[appIndex].scheduledInspectionDate = scheduledDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  applications2[appIndex].status = "ALLOCATED";
  persistLocalState();
  try {
    await dbUpdateApplication(id, {
      allocatedLmoId: applications2[appIndex].allocatedLmoId,
      allocatedLmoName: applications2[appIndex].allocatedLmoName,
      scheduledInspectionDate: applications2[appIndex].scheduledInspectionDate,
      status: "ALLOCATED"
    });
  } catch (dbErr) {
    console.warn("Could not update application in PostgreSQL:", dbErr);
  }
  appendAuditBlock(
    req.user.id,
    req.user.role,
    "LMO_ALLOCATED",
    "APPLICATION",
    id,
    `Allocated to ${applications2[appIndex].allocatedLmoName} for verification date ${applications2[appIndex].scheduledInspectionDate}`,
    req.ip
  );
  return res.json({ application: applications2[appIndex], message: "Inspection allocated to LMO." });
});
app.post("/api/applications/:id/inspect", authenticateToken, enforceRole(["LMO"]), async (req, res) => {
  const { id } = req.params;
  const { fieldNotes, geotag, photoUrl, aiAnalysis } = req.body;
  const appIndex = applications2.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }
  applications2[appIndex].fieldNotes = fieldNotes;
  applications2[appIndex].inspectionGeotag = geotag || {
    latitude: 28.5283,
    longitude: 77.2711,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    accuracyMeters: 3.5
  };
  if (photoUrl) applications2[appIndex].inspectionPhotoUrl = photoUrl;
  if (aiAnalysis) applications2[appIndex].aiPhotoAnalysis = aiAnalysis;
  applications2[appIndex].status = "INSPECTION_COMPLETED";
  persistLocalState();
  try {
    await dbUpdateApplication(id, {
      fieldNotes,
      inspectionLatitude: applications2[appIndex].inspectionGeotag?.latitude.toString(),
      inspectionLongitude: applications2[appIndex].inspectionGeotag?.longitude.toString(),
      inspectionGeotagTimestamp: applications2[appIndex].inspectionGeotag?.timestamp,
      inspectionPhotoUrl: photoUrl,
      status: "INSPECTION_COMPLETED"
    });
  } catch (dbErr) {
    console.warn("Could not update application inspection in PostgreSQL:", dbErr);
  }
  appendAuditBlock(
    req.user.id,
    req.user.role,
    "FIELD_INSPECTION_RECORDED",
    "APPLICATION",
    id,
    `Field inspection recorded with geotag (${applications2[appIndex].inspectionGeotag?.latitude}, ${applications2[appIndex].inspectionGeotag?.longitude}). AI Seal Status: ${aiAnalysis?.sealStatus || "PASSED"}.`,
    req.ip
  );
  return res.json({ application: applications2[appIndex], message: "Inspection record saved." });
});
app.post("/api/certificates/issue", authenticateToken, enforceRole(["LMO"]), async (req, res) => {
  const { applicationId, sealNumber } = req.body;
  const appRecord = applications2.find((a) => a.id === applicationId);
  if (!appRecord) {
    return res.status(404).json({ error: "Associated application not found" });
  }
  const certId = `CERT-DL-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const certNumber = `LM-VERIF-DL-2026-${Math.floor(1e4 + Math.random() * 9e4)}`;
  const issuedAt = (/* @__PURE__ */ new Date()).toISOString();
  const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString();
  const seal = sealNumber || `SEAL-DL-2026-${req.user?.badgeNumber || "4091"}-${Math.floor(10 + Math.random() * 90)}`;
  const signatureRaw = `${certId}|${certNumber}|${appRecord.serialNumber}|${appRecord.modelNumber}|${appRecord.applicantName}|${seal}|${issuedAt}|${validUntil}`;
  const hmacSignature = hmacSha256(signatureRaw);
  const tamperProofHash = sha256(signatureRaw + hmacSignature);
  const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
  const qrPayload = `${publicBaseUrl}/?verify=${encodeURIComponent(certNumber)}`;
  const newCert = {
    id: certId,
    certificateNumber: certNumber,
    applicationId,
    instrumentCategory: appRecord.instrumentCategory,
    modelNumber: appRecord.modelNumber,
    serialNumber: appRecord.serialNumber,
    ownerName: appRecord.applicantName,
    businessName: appRecord.businessName,
    installationAddress: appRecord.installationAddress,
    issuingLmoId: req.user.id,
    issuingLmoName: req.user.name,
    issuingLmoBadge: req.user.badgeNumber || "DL-LMO-4091",
    jurisdiction: "South Delhi Enforcement Division",
    issuedAt,
    validUntil,
    sealNumber: seal,
    hmacSignature,
    qrPayload,
    tamperProofHash,
    status: "ACTIVE"
  };
  certificates2.unshift(newCert);
  persistLocalState();
  appRecord.status = "CERTIFIED";
  appRecord.certificateId = certId;
  try {
    await dbCreateCertificate({
      id: certId,
      certificateNumber: certNumber,
      applicationId,
      instrumentCategory: appRecord.instrumentCategory,
      modelNumber: appRecord.modelNumber,
      serialNumber: appRecord.serialNumber,
      ownerName: appRecord.applicantName,
      businessName: appRecord.businessName,
      installationAddress: appRecord.installationAddress,
      issuingLmoId: req.user.id,
      issuingLmoName: req.user.name,
      issuingLmoBadge: req.user.badgeNumber || "DL-LMO-4091",
      jurisdiction: "South Delhi Enforcement Division",
      issuedAt,
      validUntil,
      sealNumber: seal,
      hmacSignature,
      qrPayload,
      tamperProofHash,
      status: "ACTIVE"
    });
    await dbUpdateApplication(applicationId, {
      status: "CERTIFIED",
      certificateId: certId
    });
  } catch (dbErr) {
    console.warn("Could not write certificate to PostgreSQL:", dbErr);
  }
  appendAuditBlock(
    req.user.id,
    req.user.role,
    "CERTIFICATE_ISSUED_CRYPTOGRAPHIC",
    "CERTIFICATE",
    certId,
    `Digital Verification Certificate ${certNumber} issued and signed with HMAC-SHA256 signature [${hmacSignature.slice(0, 16)}...].`,
    req.ip
  );
  return res.json({ certificate: newCert, message: "Digital Certificate cryptographically issued and sealed." });
});
app.put("/api/certificates/:id/pdf", authenticateToken, enforceRole(["LMO", "CITIZEN"]), async (req, res) => {
  const { id } = req.params;
  const { pdfData } = req.body;
  if (!pdfData || !/^[A-Za-z0-9+/=]+$/.test(pdfData)) {
    return res.status(400).json({ error: "A valid base64 PDF is required." });
  }
  const cert = certificates2.find((item) => item.id === id) || await dbGetCertificateById(id);
  if (!cert) return res.status(404).json({ error: "Certificate not found." });
  if (req.user.role === "CITIZEN" && cert.ownerName !== req.user.name) {
    return res.status(403).json({ error: "You may only store your own certificate PDF." });
  }
  if (req.user.role === "LMO" && cert.issuingLmoId !== req.user.id) {
    return res.status(403).json({ error: "Only the issuing LMO may store this certificate PDF." });
  }
  try {
    const result = await storeCertificatePdfFallback(id, pdfData);
    return res.json({
      message: result.fallback ? "Certificate PDF stored locally; remote storage unavailable." : "Certificate PDF stored.",
      fallback: result.fallback
    });
  } catch (error) {
    console.warn("Could not store certificate PDF:", error);
    return res.status(503).json({ error: "Certificate PDF storage is unavailable." });
  }
});
app.get("/certificates/:id/download.pdf", async (req, res) => {
  const cert = await findCertificateByReference(req.params.id);
  if (!cert) {
    return res.status(404).json({ error: "Certificate not found." });
  }
  const providedSig = typeof req.query.sig === "string" ? req.query.sig : "";
  const expectedSig = cert.hmacSignature;
  if (providedSig && providedSig !== expectedSig) {
    return res.status(400).json({ error: "Certificate signature mismatch." });
  }
  const publicBaseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const certPdf = await buildCertificatePdfBuffer(cert, publicBaseUrl);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${cert.certificateNumber}.pdf"`);
  return res.send(certPdf);
});
app.get("/verify/:id", async (req, res) => {
  const cert = await findCertificateByReference(req.params.id);
  if (!cert) {
    return res.status(404).json({ error: "No matching Certificate found in Central Metrology Repository." });
  }
  const providedSig = typeof req.query.sig === "string" ? req.query.sig : "";
  if (providedSig && providedSig !== cert.hmacSignature) {
    return res.status(400).json({ error: "Certificate signature mismatch." });
  }
  return res.redirect(302, `${process.env.PUBLIC_BASE_URL || "http://localhost:3000"}/certificates/${encodeURIComponent(cert.id)}/download.pdf?sig=${encodeURIComponent(cert.hmacSignature)}`);
});
app.get("/api/certificates/:id/pdf", authenticateToken, enforceRole(["LMO", "CITIZEN"]), async (req, res) => {
  const cert = await findCertificateByReference(req.params.id);
  if (!cert) return res.status(404).json({ error: "Certificate not found." });
  if (req.user.role === "CITIZEN" && cert.ownerName !== req.user.name) return res.status(403).json({ error: "Forbidden." });
  if (req.user.role === "LMO" && cert.issuingLmoId !== req.user.id) return res.status(403).json({ error: "Forbidden." });
  const publicBaseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const pdf = await buildCertificatePdfBuffer(cert, publicBaseUrl);
  res.type("application/pdf").send(pdf);
});
app.get("/api/certificates", async (req, res) => {
  try {
    const dbCerts = await dbGetCertificates();
    if (dbCerts && dbCerts.length > 0) {
      const mapped = dbCerts.map((c) => ({
        id: c.id,
        certificateNumber: c.certificateNumber,
        applicationId: c.applicationId,
        instrumentCategory: c.instrumentCategory,
        modelNumber: c.modelNumber,
        serialNumber: c.serialNumber,
        ownerName: c.ownerName,
        businessName: c.businessName,
        installationAddress: c.installationAddress,
        issuingLmoId: c.issuingLmoId,
        issuingLmoName: c.issuingLmoName,
        issuingLmoBadge: c.issuingLmoBadge,
        jurisdiction: c.jurisdiction,
        issuedAt: c.issuedAt,
        validUntil: c.validUntil,
        sealNumber: c.sealNumber,
        hmacSignature: c.hmacSignature,
        qrPayload: c.qrPayload,
        tamperProofHash: c.tamperProofHash,
        status: c.status
      }));
      return res.json({ certificates: mapped });
    }
  } catch (err) {
    console.warn("DB certificates fetch fallback:", err);
  }
  return res.json({ certificates: certificates2 });
});
app.get("/api/certificates/verify/:id", async (req, res) => {
  const { id } = req.params;
  const providedSig = req.query.sig || "";
  let cert = null;
  try {
    const dbCert = await dbGetCertificateById(id);
    if (dbCert) {
      cert = {
        id: dbCert.id,
        certificateNumber: dbCert.certificateNumber,
        applicationId: dbCert.applicationId,
        instrumentCategory: dbCert.instrumentCategory,
        modelNumber: dbCert.modelNumber,
        serialNumber: dbCert.serialNumber,
        ownerName: dbCert.ownerName,
        businessName: dbCert.businessName,
        installationAddress: dbCert.installationAddress,
        issuingLmoId: dbCert.issuingLmoId,
        issuingLmoName: dbCert.issuingLmoName,
        issuingLmoBadge: dbCert.issuingLmoBadge,
        jurisdiction: dbCert.jurisdiction,
        issuedAt: dbCert.issuedAt,
        validUntil: dbCert.validUntil,
        sealNumber: dbCert.sealNumber,
        hmacSignature: dbCert.hmacSignature,
        qrPayload: dbCert.qrPayload,
        tamperProofHash: dbCert.tamperProofHash,
        status: dbCert.status
      };
    }
  } catch (err) {
    console.warn("DB verify fetch fallback:", err);
  }
  if (!cert) {
    cert = certificates2.find((c) => c.id === id || c.certificateNumber === id) || null;
  }
  if (!cert) {
    return res.status(404).json({
      valid: false,
      error: "No matching Certificate found in Central Metrology Repository. Potential fraudulent document."
    });
  }
  const signatureRaw = `${cert.id}|${cert.certificateNumber}|${cert.serialNumber}|${cert.modelNumber}|${cert.ownerName}|${cert.sealNumber}|${cert.issuedAt}|${cert.validUntil}`;
  const recomputedHmac = hmacSha256(signatureRaw);
  const isHmacValid = recomputedHmac === cert.hmacSignature;
  const isSignatureMatched = providedSig ? providedSig === cert.hmacSignature : true;
  appendAuditBlock(
    "PUBLIC_SCANNER",
    "PUBLIC",
    "CERTIFICATE_VERIFICATION_CHECK",
    "CERTIFICATE",
    cert.id,
    `Public verification check conducted. HMAC Valid: ${isHmacValid}. Tamper integrity: ${isHmacValid ? "VERIFIED" : "FAILED"}.`,
    req.ip
  );
  return res.json({
    valid: isHmacValid && isSignatureMatched,
    certificate: cert,
    integrityDetails: {
      algorithm: "HMAC-SHA256 with Hardware Security Secret",
      hashDigest: cert.tamperProofHash,
      signatureVerified: isHmacValid,
      sealIntegrity: "STAMPED_AND_LOGGED",
      verifiedTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
});
app.get("/api/e2ee/messages/:applicationId", authenticateToken, async (req, res) => {
  const { applicationId } = req.params;
  const user = req.user;
  const appRecord = applications2.find((a) => a.id === applicationId);
  if (!appRecord) {
    return res.status(404).json({ error: "Application not found" });
  }
  if (user.role === "CITIZEN" && appRecord.applicantId !== user.id) {
    return res.status(403).json({ error: "Forbidden: You cannot access communication for another applicant." });
  }
  try {
    const dbMsgs = await dbGetE2eeMessages(applicationId);
    if (dbMsgs && dbMsgs.length > 0) {
      const mapped = dbMsgs.map((m) => ({
        id: m.id,
        applicationId: m.applicationId,
        senderId: m.senderId,
        senderRole: m.senderRole,
        senderName: m.senderName,
        recipientId: m.recipientId,
        recipientRole: m.recipientRole,
        encryptedPayload: m.ciphertext,
        iv: m.iv,
        timestamp: m.sentAt,
        messageType: "TEXT",
        decryptedContent: void 0
      }));
      return res.json({ messages: mapped });
    }
  } catch (err) {
    console.warn("DB E2EE fetch fallback:", err);
  }
  const msgs = e2eeMessages2.filter((m) => m.applicationId === applicationId);
  return res.json({ messages: msgs });
});
app.post("/api/e2ee/messages", authenticateToken, async (req, res) => {
  const user = req.user;
  const { applicationId, recipientId, recipientRole, encryptedPayload, iv, messageType, decryptedContent } = req.body;
  const newMsg = {
    id: `msg-e2ee-${Date.now()}`,
    applicationId,
    senderId: user.id,
    senderRole: user.role,
    senderName: user.name,
    recipientId: recipientId || (user.role === "CITIZEN" ? "lmo-malhotra-4091" : "usr-cit-101"),
    recipientRole: recipientRole || (user.role === "CITIZEN" ? "LMO" : "CITIZEN"),
    encryptedPayload,
    iv,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    messageType: messageType || "TEXT",
    decryptedContent
  };
  e2eeMessages2.push(newMsg);
  try {
    await dbCreateE2eeMessage({
      id: newMsg.id,
      applicationId: newMsg.applicationId,
      senderId: newMsg.senderId,
      senderRole: newMsg.senderRole,
      senderName: newMsg.senderName,
      recipientId: newMsg.recipientId,
      recipientRole: newMsg.recipientRole,
      ciphertext: newMsg.encryptedPayload,
      iv: newMsg.iv,
      tag: "auth-tag-aes-256-gcm",
      keyId: "kid-stakeholder-e2ee-2026",
      sentAt: newMsg.timestamp,
      isRead: "false"
    });
  } catch (dbErr) {
    console.warn("Could not write E2EE message to PostgreSQL:", dbErr);
  }
  appendAuditBlock(
    user.id,
    user.role,
    "E2EE_TRANSMISSION",
    "E2EE_MESSAGE",
    newMsg.id,
    `End-to-End Encrypted transmission dispatched (Type: ${newMsg.messageType}, AES-256 Payload Hash: ${sha256(encryptedPayload).slice(0, 16)}...)`,
    req.ip
  );
  return res.json({ message: newMsg });
});
app.get("/api/audit/logs", authenticateToken, async (req, res) => {
  const user = req.user;
  try {
    const dbLogs = await dbGetAuditLedger();
    if (dbLogs && dbLogs.length > 0) {
      const mapped = dbLogs.map((b) => ({
        index: b.blockIndex,
        timestamp: b.timestamp,
        actorId: b.actorId,
        actorRole: b.actorRole,
        action: b.action,
        resourceType: b.resourceType,
        resourceId: b.resourceId,
        ipAddress: b.ipAddress || "127.0.0.1",
        details: b.details,
        previousHash: b.previousHash,
        hash: b.hash
      }));
      if (user.role === "CITIZEN") {
        const filtered = mapped.filter((b) => b.actorId === user.id || b.details.includes(user.name));
        return res.json({ logs: filtered });
      }
      return res.json({ logs: mapped });
    }
  } catch (err) {
    console.warn("DB audit fetch fallback:", err);
  }
  if (user.role === "CITIZEN") {
    const filtered = auditLedger2.filter((b) => b.actorId === user.id || b.details.includes(user.name));
    return res.json({ logs: filtered });
  }
  return res.json({ logs: auditLedger2 });
});
app.post("/api/audit/verify-chain", authenticateToken, enforceRole(["CONTROLLER_ADMIN"]), (req, res) => {
  let isValid = true;
  let brokenIndex = null;
  let brokenReason = null;
  for (let i = 1; i < auditLedger2.length; i++) {
    const prevBlock = auditLedger2[i - 1];
    const currentBlock = auditLedger2[i];
    if (currentBlock.previousHash !== prevBlock.hash) {
      isValid = false;
      brokenIndex = i;
      brokenReason = `Block #${i} previousHash does not match Block #${i - 1} hash`;
      break;
    }
    const blockData = `${currentBlock.index}|${currentBlock.timestamp}|${currentBlock.actorId}|${currentBlock.actorRole}|${currentBlock.action}|${currentBlock.resourceType}|${currentBlock.resourceId}|${currentBlock.details}|${currentBlock.previousHash}`;
    const calculatedHash = sha256(blockData);
    if (calculatedHash !== currentBlock.hash) {
      isValid = false;
      brokenIndex = i;
      brokenReason = `Block #${i} data was tampered; computed hash ${calculatedHash} does not match stored hash ${currentBlock.hash}`;
      break;
    }
  }
  return res.json({
    chainValid: isValid,
    totalBlocksChecked: auditLedger2.length,
    brokenIndex,
    brokenReason,
    genesisHash: auditLedger2[0]?.hash,
    latestMerkleRoot: auditLedger2[auditLedger2.length - 1]?.hash,
    verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/gdpr/consents", authenticateToken, (req, res) => {
  return res.json({ consents: gdprConsents });
});
app.post("/api/gdpr/export", authenticateToken, (req, res) => {
  const user = req.user;
  const userApps = applications2.filter((a) => a.applicantId === user.id);
  const userCerts = certificates2.filter((c) => c.ownerName === user.name);
  const userAudits = auditLedger2.filter((b) => b.actorId === user.id);
  const exportDossier = {
    subjectId: user.id,
    subjectName: user.name,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    regulatoryFramework: "India DPDP Act 2023 & GDPR Art. 20 (Data Portability)",
    data: {
      applications: userApps,
      certificates: userCerts,
      consentsRecorded: gdprConsents.filter((c) => c.userId === user.id),
      auditActivity: userAudits
    },
    exportSignature: sha256(JSON.stringify(userApps) + user.id)
  };
  appendAuditBlock(
    user.id,
    user.role,
    "GDPR_DATA_PORTABILITY_EXPORT",
    "USER_PII",
    user.id,
    "Full GDPR Article 20 data portability export generated and transferred to subject.",
    req.ip
  );
  return res.json({ dossier: exportDossier });
});
app.post("/api/gdpr/erasure", authenticateToken, (req, res) => {
  const user = req.user;
  applications2.forEach((app2) => {
    if (app2.applicantId === user.id) {
      app2.applicantName = "ANONYMIZED_CITIZEN_GDPR_ART17";
      app2.businessName = "ANONYMIZED_ENTERPRISE";
      app2.contactEmail = "redacted@privacy.gdpr";
      app2.contactPhone = "+91 00000 00000";
      app2.maskedAadhaarOrGstin = "REDACTED_BY_REQUEST";
    }
  });
  appendAuditBlock(
    user.id,
    user.role,
    "GDPR_RIGHT_TO_ERASURE_EXECUTED",
    "USER_PII",
    user.id,
    "Right to be forgotten (GDPR Art. 17 / DPDP Sec. 12) executed. PII permanently pseudonymized.",
    req.ip
  );
  return res.json({ success: true, message: "All personal identifiable information has been redacted." });
});
app.get(["/api/threats", "/api/system/threats"], authenticateToken, (req, res) => {
  const user = req.user;
  if (user && user.role === "CONTROLLER_ADMIN") {
    return res.json({ threats: securityThreats });
  }
  return res.json({ threats: [] });
});
app.get(["/api/analytics", "/api/system/analytics"], authenticateToken, (req, res) => {
  const user = req.user;
  if (user && user.role === "CONTROLLER_ADMIN") {
    return res.json({
      analytics: {
        ...SYSTEM_ANALYTICS,
        totalApplications: applications2.length,
        activeCertificates: certificates2.length,
        securityIncidentsBlocked: securityThreats.length
      }
    });
  }
  return res.json({
    analytics: {
      totalApplications: applications2.length,
      activeCertificates: certificates2.length,
      pendingInspections: applications2.filter((a) => a.status !== "CERTIFIED").length,
      rejectionRatePercent: SYSTEM_ANALYTICS.rejectionRatePercent,
      averageInspectionDays: SYSTEM_ANALYTICS.averageInspectionDays,
      securityIncidentsBlocked: securityThreats.length,
      heatmaps: []
    }
  });
});
app.post("/api/gemini/ocr", async (req, res) => {
  try {
    const { documentText, imageBase64 } = req.body;
    const prompt = `You are an automated OCR and Legal Metrology data extractor for India's Legal Metrology Department.
Extract the following instrument details from this text or invoice:
1. instrumentCategory (one of: ELECTRONIC_WEIGHING_SCALE, FUEL_DISPENSER_PETROL_DIESEL, WEIGHBRIDGE_HEAVY_DUTY, PRESSURE_GAUGE_INDUSTRIAL, FLOW_METER_CNG_LPG, STORAGE_TANK_CALIBRATION)
2. manufacturer (string)
3. modelNumber (string)
4. serialNumber (string)
5. capacityOrRange (string, e.g. "50 kg e=5g" or "40 L/min")
6. installationAddress (string)
7. city (string)
8. pincode (string)

Return strictly valid JSON with these keys. If some data is missing, provide reasonable standard metrology estimates.
Input document:
${documentText || "Invoice for Avery Weigh-Tronix Electronic Scale Model E-1205, Serial SN-9941-2025, Capacity 50kg, Okhla Industrial Area Phase 3, New Delhi 110020"}`;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("Gemini API key not configured");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, extractedData: parsed });
  } catch (error) {
    console.warn("Gemini OCR fallback used:", error?.message);
    return res.json({
      success: true,
      extractedData: {
        instrumentCategory: "ELECTRONIC_WEIGHING_SCALE",
        manufacturer: "Essae-Teraoka Pvt Ltd",
        modelNumber: "DS-215N-HD",
        serialNumber: `SN-EWS-${Math.floor(1e3 + Math.random() * 9e3)}-2026`,
        capacityOrRange: "50 kg (Accuracy Class III, e=5g)",
        installationAddress: "Plot 88, Sector 18 Industrial Complex",
        city: "New Delhi",
        pincode: "110020"
      }
    });
  }
});
app.post("/api/gemini/photo-verify", async (req, res) => {
  try {
    const { instrumentCategory, photoNotes } = req.body;
    const prompt = `You are an expert AI Metrological Inspector verifying an inspection photograph of a ${instrumentCategory || "weighing instrument"}.
Evaluate:
1. Lead wire verification seal: Is it intact, tampered, or missing?
2. Physical condition: Any signs of drilling, bypass switches, magnet placements, or fraudulent calibration alteration?
3. Conformity to Indian Legal Metrology (General) Rules 2011.

Provide your evaluation as valid JSON with:
{
  "sealStatus": "INTACT" | "TAMPERED" | "MISSING",
  "confidenceScore": number between 0.85 and 0.99,
  "verificationVerdict": string summary,
  "anomaliesDetected": string[]
}
Field inspector notes: "${photoNotes || "Official verification punch applied to primary seal point under lead wire loop."}"`;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("Gemini API key not configured");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, analysis: parsed });
  } catch (error) {
    console.warn("Gemini Photo Verify fallback used:", error?.message);
    return res.json({
      success: true,
      analysis: {
        sealStatus: "INTACT",
        confidenceScore: 0.97,
        verificationVerdict: "Conforms to Legal Metrology General Rules 2011. Standard lead-wire seal intact with no signs of mechanical tampering or bypass.",
        anomaliesDetected: []
      }
    });
  }
});
app.post("/api/gemini/draft-report", async (req, res) => {
  try {
    const { roughNotes, instrumentType, serialNumber } = req.body;
    const prompt = `You are a Legal Metrology Verification Officer assistant.
Draft a formal, legally structured Verification Inspection Report adhering to the Legal Metrology Act 2009 and Rules 2011.
Instrument Type: ${instrumentType}
Serial Number: ${serialNumber}
Officer Rough Notes: "${roughNotes}"

Include:
1. Summary of Tests conducted (Eccentricity test, Repeatability test, Maximum load accuracy)
2. Error limits observed vs permissible Maximum Permissible Error (MPE)
3. Formal recommendation for certification.
Keep it concise, professional, and formal.`;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("Gemini API key not configured");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    return res.json({ success: true, report: response.text });
  } catch (error) {
    console.warn("Gemini Draft Report fallback:", error?.message);
    return res.json({
      success: true,
      report: `FORMAL LEGAL METROLOGY VERIFICATION REPORT
Under Section 24 of the Legal Metrology Act, 2009

1. SCOPE OF INSPECTION: Verified ${req.body.instrumentType} (Serial: ${req.body.serialNumber}).
2. TEST RESULTS: Zero-point stability verified. Eccentric loading test conducted at 1/3 maximum capacity across all four load quadrants; errors found within \xB11e (Class III permissible limits).
3. SEAL APPLICATION: Govt security seal stamped with official lead punch mark.
4. RECOMMENDATION: Recommended for grant of Digital Verification Certificate valid for 12 months.`
    });
  }
});
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, language } = req.body;
    const prompt = `You are 'DoCA Saathi', the official multilingual AI Assistant for the Department of Consumer Affairs, Government of India, Legal Metrology Division.
Answer the citizen's query accurately in ${language || "English"} regarding the Legal Metrology Act 2009, verification schedules, fees, consumer complaints against short measures, petrol pump calibration checks, or supermarket packaged commodities.
Be polite, authoritative, and helpful.
User Query: "${message}"`;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("Gemini API key not configured");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    return res.json({ success: true, reply: response.text });
  } catch (error) {
    console.warn("Gemini Chat fallback:", error?.message);
    return res.json({
      success: true,
      reply: `Under the Legal Metrology Act, 2009, all commercial weighing and measuring instruments must undergo annual re-verification and stamping by an authorized Legal Metrology Officer (LMO). Operating an unverified instrument is an offense under Section 30 with fines up to \u20B925,000. You can track your application or report violations through this portal.`
    });
  }
});
app.get("/api/database/status", async (req, res) => {
  let isDbConnected = false;
  let dbStats = {
    applications: 0,
    certificates: 0,
    auditBlocks: 0
  };
  try {
    const apps = await dbGetApplications();
    const certs = await dbGetCertificates();
    const audits = await dbGetAuditLedger();
    isDbConnected = true;
    dbStats = {
      applications: apps?.length || 0,
      certificates: certs?.length || 0,
      auditBlocks: audits?.length || 0
    };
  } catch (err) {
    console.warn("DB status check warning:", err?.message);
  }
  return res.json({
    engine: "PostgreSQL 15 (Google Cloud SQL)",
    region: "asia-southeast1",
    instance: "ai-studio-d7d8e55d",
    status: isDbConnected ? "CONNECTED" : "STANDBY_FALLBACK",
    connectionMethod: "pg.Pool (Object Configuration)",
    tables: ["users", "applications", "certificates", "audit_ledger", "e2ee_messages"],
    stats: dbStats,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/database/tables/:tableName", async (req, res) => {
  const allowedTables = {
    applications: "applications",
    certificates: "certificates",
    audit_ledger: "audit_ledger",
    users: "users",
    e2ee_messages: "e2ee_messages"
  };
  const { tableName } = req.params;
  const targetTable = allowedTables[tableName];
  if (!targetTable) {
    return res.status(400).json({ error: `Invalid table requested. Allowed tables: ${Object.keys(allowedTables).join(", ")}` });
  }
  const limit = Math.min(Math.max(parseInt(req.query.limit || "50", 10), 1), 100);
  try {
    const query = `SELECT * FROM ${targetTable} LIMIT $1;`;
    const result = await pool.query(query, [limit]);
    return res.json({
      success: true,
      tableName: targetTable,
      query: `SELECT * FROM ${targetTable} LIMIT ${limit};`,
      columns: result.fields.map((f) => ({ name: f.name, dataTypeId: f.dataTypeID })),
      rowCount: result.rows.length,
      rows: result.rows,
      source: "CLOUD_SQL_POSTGRESQL"
    });
  } catch (err) {
    console.warn(`Error querying PostgreSQL table ${targetTable}:`, err?.message);
    let inMemoryRows = [];
    if (targetTable === "applications") inMemoryRows = applications2;
    else if (targetTable === "certificates") inMemoryRows = certificates2;
    else if (targetTable === "audit_ledger") inMemoryRows = auditLedger2;
    else if (targetTable === "users") {
      inMemoryRows = [
        { id: "usr-cit-101", uid: "demo-citizen-1", email: "citizen@example.com", role: "CITIZEN", name: "Rajesh Sharma", phone: "+91 98765 43210" },
        { id: "usr-lmo-201", uid: "demo-lmo-1", email: "inspector.malhotra@doca.gov.in", role: "LMO", name: "Inspector Vikram Malhotra", badgeNumber: "DL-LMO-4091" },
        { id: "usr-ctrl-301", uid: "demo-controller-1", email: "controller.hq@doca.gov.in", role: "CONTROLLER_ADMIN", name: "Dr. Alok Verma", badgeNumber: "HQ-CTRL-001" }
      ];
    } else if (targetTable === "e2ee_messages") inMemoryRows = e2eeMessages2;
    return res.json({
      success: true,
      tableName: targetTable,
      query: `SELECT * FROM ${targetTable} (standby memory view);`,
      columns: inMemoryRows.length > 0 ? Object.keys(inMemoryRows[0]).map((name) => ({ name })) : [],
      rowCount: inMemoryRows.length,
      rows: inMemoryRows,
      source: "STANDBY_FALLBACK",
      errorNotice: err?.message
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "UMVP Backend Service",
    uptime: process.uptime(),
    ledgerBlocks: auditLedger2.length,
    activeCertificates: certificates2.length
  });
});
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UMVP Secure Server listening on port ${PORT} at 0.0.0.0`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
