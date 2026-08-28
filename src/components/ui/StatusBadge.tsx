import type { ApplicationStatus, CertificateStatus, InspectionStatus } from '../../types';

type AnyStatus = ApplicationStatus | CertificateStatus | InspectionStatus | string;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', className: 'bg-violet-100 text-violet-700' },
  documents_required: { label: 'Docs Required', className: 'bg-orange-100 text-orange-700' },
  inspection_scheduled: { label: 'Inspection Scheduled', className: 'bg-amber-100 text-amber-700' },
  inspection_in_progress: { label: 'Inspection In Progress', className: 'bg-amber-100 text-amber-800' },
  testing_assigned: { label: 'Testing Assigned', className: 'bg-cyan-100 text-cyan-700' },
  testing_in_progress: { label: 'Testing In Progress', className: 'bg-cyan-100 text-cyan-800' },
  result_pending: { label: 'Result Pending', className: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  certificate_issued: { label: 'Certificate Issued', className: 'bg-teal-100 text-teal-700' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  expired: { label: 'Expired', className: 'bg-slate-100 text-slate-600' },
  revoked: { label: 'Revoked', className: 'bg-red-100 text-red-700' },
  suspended: { label: 'Suspended', className: 'bg-orange-100 text-orange-700' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-500' },
  rescheduled: { label: 'Rescheduled', className: 'bg-orange-100 text-orange-700' },
  pass: { label: 'Pass', className: 'bg-green-100 text-green-700' },
  fail: { label: 'Fail', className: 'bg-red-100 text-red-700' },
  conditional: { label: 'Conditional Pass', className: 'bg-yellow-100 text-yellow-700' },
};

interface Props {
  status: AnyStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'} ${config.className}`}>
      {config.label}
    </span>
  );
}
