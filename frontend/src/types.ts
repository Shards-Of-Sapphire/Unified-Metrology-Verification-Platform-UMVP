export type UserRole = 'CITIZEN' | 'LMO' | 'CONTROLLER_ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber?: string;
  jurisdiction?: string;
  token: string;
  mfaVerified: boolean;
  loginTimestamp: string;
  maskedId: string;
}

export type ApplicationStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_ALLOCATION'
  | 'ALLOCATED'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETED'
  | 'CERTIFIED'
  | 'REJECTED';

export type InstrumentCategory =
  | 'ELECTRONIC_WEIGHING_SCALE'
  | 'FUEL_DISPENSER_PETROL_DIESEL'
  | 'WEIGHBRIDGE_HEAVY_DUTY'
  | 'PRESSURE_GAUGE_INDUSTRIAL'
  | 'FLOW_METER_CNG_LPG'
  | 'STORAGE_TANK_CALIBRATION';

export interface MetrologyApplication {
  id: string;
  applicationNumber: string;
  applicantId: string;
  applicantName: string;
  businessName: string;
  maskedAadhaarOrGstin: string;
  contactEmail: string;
  contactPhone: string;
  instrumentCategory: InstrumentCategory;
  modelNumber: string;
  serialNumber: string;
  capacityOrRange: string;
  manufacturer: string;
  installationAddress: string;
  city: string;
  state: string;
  pincode: string;
  status: ApplicationStatus;
  submissionDate: string;
  allocatedLmoId?: string;
  allocatedLmoName?: string;
  scheduledInspectionDate?: string;
  fieldNotes?: string;
  inspectionGeotag?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    accuracyMeters: number;
  };
  inspectionPhotoUrl?: string;
  aiPhotoAnalysis?: {
    sealStatus: 'INTACT' | 'TAMPERED' | 'MISSING' | 'INDETERMINATE';
    confidenceScore: number;
    verificationVerdict: string;
    anomaliesDetected: string[];
    analyzedAt: string;
  };
  certificateId?: string;
  feesPaid: boolean;
  gdprConsentRecorded: boolean;
}

export interface VerificationCertificate {
  id: string;
  certificateNumber: string;
  applicationId: string;
  instrumentCategory: InstrumentCategory;
  modelNumber: string;
  serialNumber: string;
  ownerName: string;
  businessName: string;
  installationAddress: string;
  issuingLmoId: string;
  issuingLmoName: string;
  issuingLmoBadge: string;
  jurisdiction: string;
  issuedAt: string;
  validUntil: string;
  sealNumber: string;
  hmacSignature: string;
  qrPayload: string;
  tamperProofHash: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
}

export interface AuditBlock {
  index: number;
  timestamp: string;
  actorId: string;
  actorRole: UserRole | 'SYSTEM' | 'PUBLIC';
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  details: string;
  previousHash: string;
  hash: string;
}

export interface E2EEMessage {
  id: string;
  applicationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  recipientId: string;
  recipientRole: UserRole;
  encryptedPayload: string;
  iv: string;
  timestamp: string;
  messageType: 'TEXT' | 'ACCESS_CODE' | 'TECHNICAL_SPEC' | 'CONFIDENTIAL_NOTE';
  decryptedContent?: string;
}

export interface GDPRConsentRecord {
  id: string;
  userId: string;
  timestamp: string;
  purpose: string;
  legalBasis: 'CONSENT' | 'LEGAL_OBLIGATION' | 'PUBLIC_INTEREST';
  status: 'ACTIVE' | 'REVOKED';
  ipAddress: string;
}

export interface SecurityThreatEvent {
  id: string;
  timestamp: string;
  threatType: 'UNAUTHORIZED_PORTAL_ACCESS' | 'FAILED_LOGIN_SPIKE' | 'RAPID_APPROVAL_ANOMALY' | 'HASH_CHAIN_TAMPER' | 'EXPIRED_CERT_LOOKUP';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actorIp: string;
  actorRole?: string;
  description: string;
  mitigationAction: string;
}

export interface SystemAnalytics {
  totalApplications: number;
  activeCertificates: number;
  pendingInspections: number;
  rejectionRatePercent: number;
  averageInspectionDays: number;
  securityIncidentsBlocked: number;
  heatmaps: {
    zone: string;
    inspectionsCount: number;
    violationRate: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  }[];
}
