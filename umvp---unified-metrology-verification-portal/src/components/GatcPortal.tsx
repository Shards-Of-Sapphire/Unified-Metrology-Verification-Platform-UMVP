import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  TestTube2,
  Gauge,
  Wrench,
  BarChart3,
  Bell,
  User,
  Settings,
  PlusCircle,
  Play,
  FilePlus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  Calendar,
  Check,
} from 'lucide-react';
import {
  GatcTestItem,
  GatcActionItem,
  GatcEquipmentAlert,
  GatcAuthorityNotice,
} from '../types';

// Mock Data for GATC Dashboard
const TODAY_TESTS: GatcTestItem[] = [
  {
    id: 'TST-901',
    time: '09:30 AM',
    applicationId: 'UMVP/DL/2026/009042',
    applicantName: 'Apex Logistics & Retail Hub',
    instrument: 'Fuel Dispenser (Petrol/Diesel)',
    model: 'Tokheim Quantium 510',
    technician: 'Er. Suresh R. Kumar',
    status: 'IN_PROGRESS',
  },
  {
    id: 'TST-902',
    time: '11:00 AM',
    applicationId: 'UMVP/DL/2026/009041',
    applicantName: 'Apex Logistics & Retail Hub',
    instrument: 'Electronic Weighing Scale (50kg)',
    model: 'Essae DS-215N',
    technician: 'Tech. Sunita Verma',
    status: 'PASSED',
  },
  {
    id: 'TST-903',
    time: '01:45 PM',
    applicationId: 'UMVP/DL/2026/009048',
    applicantName: 'National Petroleum Outlets',
    instrument: 'CNG Flow Meter High-Pressure',
    model: 'Micro Motion CNG050',
    technician: 'Er. Rajesh K. Nair',
    status: 'SCHEDULED',
  },
  {
    id: 'TST-904',
    time: '03:15 PM',
    applicationId: 'UMVP/DL/2026/009052',
    applicantName: 'Bharat Heavy Engineering',
    instrument: 'Industrial Pressure Gauge (0-400 Bar)',
    model: 'WIKA 232.50',
    technician: 'Tech. Sunita Verma',
    status: 'SCHEDULED',
  },
  {
    id: 'TST-905',
    time: '04:30 PM',
    applicationId: 'UMVP/DL/2026/009039',
    applicantName: 'Northern Freight Corridors',
    instrument: 'Weighbridge Load Cell Array (60MT)',
    model: 'Avery Weigh-Tronix E1205',
    technician: 'Er. Suresh R. Kumar',
    status: 'FAILED_RETEST',
  },
];

const ACTION_REQUIRED: GatcActionItem[] = [
  {
    id: 'ACT-01',
    title: 'Recalibration Approval Pending: High-Precision Micro-Balance #GATC-BAL-02',
    category: 'CALIBRATION_APPROVAL',
    dueTime: 'Due Today by 5:00 PM',
    priority: 'HIGH',
  },
  {
    id: 'ACT-02',
    title: 'Retest Protocol Verification: CNG Flow Meter #UMVP-9039 Repeatability Deviation',
    category: 'RETEST_AUTHORIZATION',
    dueTime: 'Due Tomorrow',
    priority: 'HIGH',
  },
  {
    id: 'ACT-03',
    title: 'Priority Verification Request from Regional Controller #DL-DOCA-09',
    category: 'URGENT_INSPECTION',
    dueTime: 'Due in 2 Days',
    priority: 'MEDIUM',
  },
];

const EQUIPMENT_LIST: GatcEquipmentAlert[] = [
  {
    id: 'EQ-01',
    equipmentName: 'Standard Working Mass Set E2 (1mg - 50kg)',
    equipmentCode: 'GATC-STD-MASS-01',
    issue: 'Annual Traceability Recalibration Due at NPL-India',
    status: 'WARNING',
    dueDate: 'Due in 3 Days',
  },
  {
    id: 'EQ-02',
    equipmentName: 'Digital Pressure Calibrator (0-700 Bar)',
    equipmentCode: 'GATC-EQ-PR-04',
    issue: 'Sensor Zero-Drift anomaly detected during morning diagnostic check',
    status: 'MAINTENANCE_REQUIRED',
    dueDate: 'Maintenance Scheduled Today',
  },
  {
    id: 'EQ-03',
    equipmentName: 'Standard Prover Tank 500L Capacity',
    equipmentCode: 'GATC-VOL-500L',
    issue: 'Hydrostatic Leak Test Verified & Operational',
    status: 'OPERATIONAL',
    dueDate: 'Valid until Nov 2026',
  },
  {
    id: 'EQ-04',
    equipmentName: 'Gas Flow Calibration Bench Standard',
    equipmentCode: 'GATC-FLOW-BENCH-02',
    issue: 'Fully calibrated per OIML R139 standards',
    status: 'OPERATIONAL',
    dueDate: 'Valid until Jan 2027',
  },
];

const INSTRUMENTS_LIST = [
  {
    id: 'INST-101',
    category: 'Fuel Dispenser (Petrol/Diesel)',
    model: 'Tokheim Quantium 510',
    serial: 'SN-FD-4410-2026',
    owner: 'Apex Logistics & Retail Hub',
    accuracyClass: 'Class 0.5 (±0.5%)',
    lastTested: '2026-08-28',
    status: 'COMPLIANT',
  },
  {
    id: 'INST-102',
    category: 'Electronic Weighing Scale',
    model: 'Essae DS-215N',
    serial: 'SN-EWS-8921-2025',
    owner: 'Apex Logistics & Retail Hub',
    accuracyClass: 'Class III (e=5g)',
    lastTested: '2026-08-20',
    status: 'COMPLIANT',
  },
  {
    id: 'INST-103',
    category: 'CNG Flow Meter High-Pressure',
    model: 'Micro Motion CNG050',
    serial: 'SN-CNG-8812-2026',
    owner: 'National Petroleum Outlets',
    accuracyClass: 'Class 1.5',
    lastTested: 'Pending',
    status: 'UNDER_TESTING',
  },
  {
    id: 'INST-104',
    category: 'Heavy-Duty Weighbridge (60MT)',
    model: 'Avery Weigh-Tronix E1205',
    serial: 'SN-WB-60MT-9901',
    owner: 'Bharat Agri Storage Corp',
    accuracyClass: 'Class III (e=10kg)',
    lastTested: '2026-09-05',
    status: 'NEEDS_RETEST',
  },
];

const APPLICATIONS_LIST = [
  {
    id: 'APP-9042',
    appNumber: 'UMVP/DL/2026/009042',
    applicant: 'Apex Logistics & Retail Hub',
    instrument: 'Fuel Dispenser (Petrol/Diesel)',
    date: '2026-09-02',
    status: 'IN_TESTING',
  },
  {
    id: 'APP-9041',
    appNumber: 'UMVP/DL/2026/009041',
    applicant: 'Apex Logistics & Retail Hub',
    instrument: 'Electronic Weighing Scale (50kg)',
    date: '2026-08-20',
    status: 'TESTED_PASSED',
  },
  {
    id: 'APP-9048',
    appNumber: 'UMVP/DL/2026/009048',
    applicant: 'National Petroleum Outlets',
    instrument: 'CNG Flow Meter High-Pressure',
    date: '2026-09-04',
    status: 'QUEUED_FOR_TEST',
  },
  {
    id: 'APP-9052',
    appNumber: 'UMVP/DL/2026/009052',
    applicant: 'Bharat Heavy Engineering',
    instrument: 'Industrial Pressure Gauge (0-400 Bar)',
    date: '2026-09-06',
    status: 'QUEUED_FOR_TEST',
  },
];

const AUTHORITY_NOTICES: GatcAuthorityNotice[] = [
  {
    id: 'NOT-101',
    title: 'Advisory #2026/09: Revised Tolerance Limits for CNG High-Pressure Dispensers',
    issuer: 'Directorate of Legal Metrology, DoCA India',
    date: 'Sep 05, 2026',
    summary: 'Updated maximum permissible error (MPE) thresholds per OIML R139 2026 revision now enforced for GATC testing protocols.',
    badge: 'MANDATORY DIRECTIVE',
  },
  {
    id: 'NOT-102',
    title: 'Circular: Real-Time Verification Geotagging & Cryptographic Signatures',
    issuer: 'Central Regulatory Metrology Division',
    date: 'Aug 28, 2026',
    summary: 'All GATC lab test outcomes must be cryptographically signed by authorized technicians before submission to UMVP core ledger.',
    badge: 'COMPLIANCE',
  },
];

const WEEKLY_CHART_DATA = [
  { day: 'Mon', completed: 8, failed: 1 },
  { day: 'Tue', completed: 12, failed: 0 },
  { day: 'Wed', completed: 10, failed: 2 },
  { day: 'Thu', completed: 15, failed: 1 },
  { day: 'Fri', completed: 14, failed: 0 },
  { day: 'Sat', completed: 6, failed: 1 },
  { day: 'Sun', completed: 2, failed: 0 },
];

export function GatcPortal() {
  const [activeNav, setActiveNav] = useState<'Dashboard' | 'Applications' | 'Testing' | 'Instruments' | 'Equipment' | 'Reports' | 'Notifications' | 'Profile' | 'Settings'>('Dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[82vh] bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in">
      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION                                        */}
      {/* ========================================================= */}
      <aside className="w-full lg:w-64 bg-slate-900/90 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 sm:p-5 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          {/* GATC Lab Identity */}
          <div className="px-2 py-1 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GATC METROLOGY LAB #04</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Govt Approved Test Centre • Northern Region
            </p>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
              Main Menu
            </div>
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Applications', icon: FileText, badge: '4' },
              { label: 'Testing', icon: TestTube2, badge: '6' },
              { label: 'Instruments', icon: Gauge },
              { label: 'Equipment', icon: Wrench, badge: '2 Alerts' },
              { label: 'Reports', icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      item.badge.includes('Alerts')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation (Bottom) */}
        <div className="pt-4 border-t border-slate-800/80 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
            Secondary
          </div>
          {[
            { label: 'Notifications', icon: Bell, badge: '3' },
            { label: 'Profile', icon: User },
            { label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* FEATURE VIEWS (SWITCHED BY SIDEBAR CLICK)                 */}
      {/* ========================================================= */}
      <main className="flex-1 p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[85vh]">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 1: DASHBOARD (SPACIOUS, OPEN, UNCLUTTERED)           */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    GATC Command Centre
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    ISO/IEC 17025 ACCREDITED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Government Approved Test Centre #04 • Northern Regional Metrology Laboratory
                </p>
              </div>

              {/* 3 Quick Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveNav('Testing')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Testing</span>
                </button>

                <button
                  onClick={() => setActiveNav('Applications')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Applications</span>
                </button>

                <button
                  onClick={() => showNotification('Opening New Metrology Verification Request form...')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FilePlus className="w-3.5 h-3.5 text-slate-400" />
                  <span>New Request</span>
                </button>
              </div>
            </div>

            {/* Lightweight Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { label: 'Pending Tests', count: 14, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                { label: "Today's Tests", count: 6, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { label: 'In Progress', count: 3, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Completed Today', count: 28, color: 'text-slate-200', bg: 'bg-slate-800/40 border-slate-800' },
                { label: 'Failed / Retest', count: 2, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${stat.bg} flex flex-col justify-between space-y-2 shadow-sm`}
                >
                  <span className="text-[11px] font-medium text-slate-400">{stat.label}</span>
                  <div className="flex items-baseline justify-between">
                    <span className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.count}</span>
                    <span className="text-[10px] text-slate-500 font-mono">GATC-04</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Today's Testing & Action Required (Focused Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Testing Schedule */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TestTube2 className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-bold text-white tracking-wide">Today's Testing Schedule</h2>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Sep 09, 2026</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-medium text-[11px]">
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Application / Instrument</th>
                        <th className="py-2.5 px-3">Technician</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {TODAY_TESTS.map((test) => (
                        <tr key={test.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{test.time}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-100">{test.instrument}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-amber-400/90">{test.applicationId}</span>
                              <span>•</span>
                              <span>{test.applicantName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-300 text-[11px] whitespace-nowrap">
                            {test.technician}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            {test.status === 'IN_PROGRESS' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                In Progress
                              </span>
                            )}
                            {test.status === 'PASSED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Passed
                              </span>
                            )}
                            {test.status === 'SCHEDULED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                                Scheduled
                              </span>
                            )}
                            {test.status === 'FAILED_RETEST' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-medium">
                                <XCircle className="w-3 h-3 text-rose-400" />
                                Failed (Retest)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Required */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h2 className="text-sm font-bold text-white tracking-wide">Action Required</h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">
                      3 Urgent
                    </span>
                  </div>

                  <div className="space-y-3">
                    {ACTION_REQUIRED.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-slate-200 font-medium leading-snug">{act.title}</p>
                          {act.priority === 'HIGH' && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold shrink-0">
                              HIGH
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="font-mono text-amber-400/90">{act.dueTime}</span>
                          <button
                            onClick={() => showNotification(`Resolving action item ${act.id}...`)}
                            className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            Resolve <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 2: APPLICATIONS VIEW                                 */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Applications' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div>
                <h1 className="text-xl font-bold text-white">GATC Verification Applications</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage and process client instrument verification requests.</p>
              </div>
              <button
                onClick={() => showNotification('Opening New Request Wizard...')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>New Application</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search application number, applicant or instrument..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium text-[11px] bg-slate-900/80">
                    <th className="py-3 px-4">Application No.</th>
                    <th className="py-3 px-4">Applicant Business</th>
                    <th className="py-3 px-4">Instrument Category</th>
                    <th className="py-3 px-4">Submission Date</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {APPLICATIONS_LIST.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-amber-400 font-semibold">{app.appNumber}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">{app.applicant}</td>
                      <td className="py-3.5 px-4 text-slate-300">{app.instrument}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{app.date}</td>
                      <td className="py-3.5 px-4 text-right">
                        {app.status === 'IN_TESTING' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                            In Testing
                          </span>
                        )}
                        {app.status === 'TESTED_PASSED' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-medium">
                            Verified & Certified
                          </span>
                        )}
                        {app.status === 'QUEUED_FOR_TEST' && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                            Queued for Testing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 3: TESTING PROTOCOLS VIEW                            */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Testing' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div>
                <h1 className="text-xl font-bold text-white">Metrology Testing Queue</h1>
                <p className="text-xs text-slate-400 mt-0.5">Active test runs, repeatability, and zero-error verification protocols.</p>
              </div>
              <button
                onClick={() => showNotification('Active Test Session Initialized.')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start New Protocol Session</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TODAY_TESTS.map((test) => (
                <div key={test.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400">{test.applicationId}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{test.instrument}</h3>
                    </div>
                    {test.status === 'IN_PROGRESS' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold animate-pulse">
                        Testing Active
                      </span>
                    )}
                    {test.status === 'PASSED' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Passed
                      </span>
                    )}
                    {test.status === 'SCHEDULED' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                        Scheduled ({test.time})
                      </span>
                    )}
                    {test.status === 'FAILED_RETEST' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-semibold">
                        Retest Required
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/60">
                    <div>Model: <strong className="text-slate-200">{test.model}</strong></div>
                    <div>Applicant: <span className="text-slate-300">{test.applicantName}</span></div>
                    <div>Assigned Technician: <span className="text-slate-300">{test.technician}</span></div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => showNotification(`Opened Testing Protocol execution sheet for ${test.id}`)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <TestTube2 className="w-3.5 h-3.5" />
                      <span>Open Protocol Sheet</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 4: INSTRUMENTS CATALOG                               */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Instruments' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="pb-2 border-b border-slate-800/60">
              <h1 className="text-xl font-bold text-white">Client Instruments Register</h1>
              <p className="text-xs text-slate-400 mt-0.5">Commercial instruments registered for GATC metrological verification.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INSTRUMENTS_LIST.map((inst) => (
                <div key={inst.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{inst.id}</span>
                      <h3 className="text-sm font-bold text-white">{inst.category}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono">
                      {inst.accuracyClass}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    <div>Model & Serial: <strong className="text-slate-200">{inst.model} ({inst.serial})</strong></div>
                    <div>Owner: <span className="text-slate-300">{inst.owner}</span></div>
                    <div>Last Verification Date: <span className="font-mono text-slate-300">{inst.lastTested}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 5: EQUIPMENT & STANDARDS ALERTS                      */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Equipment' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div>
                <h1 className="text-xl font-bold text-white">GATC Equipment & Standards Register</h1>
                <p className="text-xs text-slate-400 mt-0.5">Master working standards, calibration status, and maintenance alerts.</p>
              </div>
              <button
                onClick={() => showNotification('Equipment Recalibration Log created.')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log Maintenance</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EQUIPMENT_LIST.map((eq) => (
                <div key={eq.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{eq.equipmentCode}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{eq.equipmentName}</h3>
                    </div>
                    {eq.status === 'WARNING' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                        Recalibration Due
                      </span>
                    )}
                    {eq.status === 'MAINTENANCE_REQUIRED' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold">
                        Maintenance
                      </span>
                    )}
                    {eq.status === 'OPERATIONAL' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        Operational
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">{eq.issue}</p>
                  {eq.dueDate && <div className="text-[11px] text-amber-400 font-mono">{eq.dueDate}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 6: REPORTS & AUTHORITY ADVISORIES                    */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Reports' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="pb-2 border-b border-slate-800/60">
              <h1 className="text-xl font-bold text-white">GATC Testing Reports & Regulatory Advisories</h1>
              <p className="text-xs text-slate-400 mt-0.5">Throughput analytics, weekly test volumes, and DoCA directives.</p>
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">Weekly Testing Activity Throughput</h2>
                </div>
                <span className="text-xs text-emerald-400 font-mono">Pass Rate: 93.0%</span>
              </div>

              <div className="pt-4 pb-2">
                <div className="h-40 flex items-end justify-between gap-3 border-b border-slate-800 pb-2">
                  {WEEKLY_CHART_DATA.map((item, idx) => {
                    const total = item.completed + item.failed;
                    const maxTotal = 16;
                    const compHeight = Math.round((item.completed / maxTotal) * 100);
                    const failHeight = Math.round((item.failed / maxTotal) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="w-full flex flex-col items-center justify-end h-32 gap-0.5">
                          {item.failed > 0 && (
                            <div
                              style={{ height: `${failHeight}%` }}
                              className="w-full max-w-[28px] bg-rose-500/80 rounded-t-sm transition-all group-hover:bg-rose-400"
                              title={`Failed: ${item.failed}`}
                            />
                          )}
                          <div
                            style={{ height: `${compHeight}%` }}
                            className="w-full max-w-[28px] bg-emerald-500/80 rounded-t-sm transition-all group-hover:bg-emerald-400"
                            title={`Completed: ${item.completed}`}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 mt-1">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Authority Notices */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Legal Metrology Authority Advisories</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AUTHORITY_NOTICES.map((notice) => (
                  <div key={notice.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">
                        {notice.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{notice.date}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-100">{notice.title}</h3>
                    <p className="text-[11px] text-slate-400">{notice.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECONDARY VIEWS (Notifications, Profile, Settings)        */}
        {/* --------------------------------------------------------- */}
        {activeNav === 'Notifications' && (
          <div className="space-y-4 animate-in fade-in">
            <h1 className="text-xl font-bold text-white">Notifications</h1>
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                Notice: Recalibration approval pending for Standard Mass Set E2.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                New application assigned: UMVP/DL/2026/009048 (CNG Meter).
              </div>
            </div>
          </div>
        )}

        {activeNav === 'Profile' && (
          <div className="space-y-4 animate-in fade-in">
            <h1 className="text-xl font-bold text-white">GATC Laboratory Profile</h1>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div>Lab ID: <strong className="text-slate-100">GATC-DELHI-04</strong></div>
              <div>Accreditation: <strong className="text-emerald-400">ISO/IEC 17025:2017</strong></div>
              <div>Head Metrologist: <strong className="text-slate-100">Dr. K. R. Ramanathan</strong></div>
              <div>Jurisdiction: <span className="text-slate-400">Northern Regional Metrology Zone</span></div>
            </div>
          </div>
        )}

        {activeNav === 'Settings' && (
          <div className="space-y-4 animate-in fade-in">
            <h1 className="text-xl font-bold text-white">GATC System Settings</h1>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-3">
              <div className="flex items-center justify-between">
                <span>Automatic Cryptographic Ledger Sync</span>
                <span className="text-emerald-400 font-bold">ENABLED</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <span>Real-Time Geotagging Requirement</span>
                <span className="text-emerald-400 font-bold">ENFORCED</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
