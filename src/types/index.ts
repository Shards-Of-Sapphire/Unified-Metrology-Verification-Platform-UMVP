export type UserRole = 'user' | 'lmo' | 'gatc' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  organisation?: string;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
  licenseNumber?: string; // for LMO/GATC
  jurisdiction?: string;  // for LMO
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'documents_required'
  | 'inspection_scheduled'
  | 'inspection_in_progress'
  | 'testing_assigned'
  | 'testing_in_progress'
  | 'result_pending'
  | 'approved'
  | 'rejected'
  | 'certificate_issued';

export interface Application {
  id: string;
  referenceNumber: string;
  userId: string;
  userName: string;
  instrumentType: string;
  instrumentMake: string;
  instrumentModel: string;
  serialNumber: string;
  installedAt: string;
  purposeOfUse: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  assignedLmoId?: string;
  assignedLmoName?: string;
  assignedGatcId?: string;
  assignedGatcName?: string;
  documents: Document[];
  timeline: TimelineEvent[];
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: string;
}

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  label: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'system';
}

export type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface Inspection {
  id: string;
  applicationId: string;
  referenceNumber: string;
  userId: string;
  userName: string;
  instrumentType: string;
  lmoId: string;
  lmoName: string;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: InspectionStatus;
  result?: 'pass' | 'fail' | 'conditional';
  notes?: string;
  evidence?: Evidence[];
  geolocation?: { lat: number; lng: number };
  completedAt?: string;
}

export interface Evidence {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

export type CertificateStatus = 'active' | 'expired' | 'revoked' | 'suspended';

export interface Certificate {
  id: string;
  certificateNumber: string;
  applicationId: string;
  userId: string;
  userName: string;
  instrumentType: string;
  instrumentMake: string;
  instrumentModel: string;
  serialNumber: string;
  issuedAt: string;
  validUntil: string;
  status: CertificateStatus;
  issuedBy: string;
  lmoName: string;
  qrCode?: string;
  stampNumber?: string;
}

export interface TestRecord {
  id: string;
  applicationId: string;
  gatcId: string;
  gatcName: string;
  instrumentType: string;
  userName: string;
  testDate: string;
  parameters: TestParameter[];
  result: 'pass' | 'fail' | 'conditional';
  notes?: string;
  completedAt?: string;
}

export interface TestParameter {
  name: string;
  measured: string;
  standard: string;
  tolerance: string;
  result: 'pass' | 'fail';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface DashboardStats {
  totalApplications?: number;
  pendingApplications?: number;
  approvedApplications?: number;
  activeCertificates?: number;
  scheduledInspections?: number;
  completedInspections?: number;
  totalUsers?: number;
  totalLMOs?: number;
  totalGATCs?: number;
  monthlyApplications?: { month: string; count: number }[];
  statusDistribution?: { status: string; count: number }[];
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: NavigationItem[];
}

export interface FilterOptions {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
