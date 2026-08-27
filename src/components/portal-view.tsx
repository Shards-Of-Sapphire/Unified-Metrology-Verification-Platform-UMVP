"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type View = "Applications" | "Inspections" | "Certificates" | "Reports";

const demoApplications = [
  ["LM-24081", "Ravi Engineering Works", "Platform scale", "Due today", "urgent"],
  ["LM-24078", "Aarav Retail Pvt. Ltd.", "Retail weighing scale", "Scheduled", "scheduled"],
  ["LM-24074", "Sree Lakshmi Traders", "Fuel dispenser", "Scheduled", "scheduled"],
  ["LM-24069", "Metro Cold Storage", "Temperature recorder", "Awaiting docs", "pending"],
  ["LM-24064", "Gowtham Fuels", "Fuel dispenser", "Inspection", "scheduled"],
] as const;

type ApplicationItem = readonly [string, string, string, string, string];

const inspections = [
  ["IN-1084", "Ravi Engineering Works", "Today, 10:30", "Platform scale", "Due today", "urgent"],
  ["IN-1081", "Aarav Retail Pvt. Ltd.", "Today, 14:00", "Retail weighing scale", "Assigned", "scheduled"],
  ["IN-1076", "Gowtham Fuels", "Completed 1h ago", "Fuel dispenser", "Review required", "pending"],
  ["IN-1072", "Sree Lakshmi Traders", "Tomorrow, 09:00", "Fuel dispenser", "Assigned", "scheduled"],
] as const;

const certificates = [
  ["LM-2026-000184", "Ravi Engineering Works", "Platform scale", "25 Aug 2026", "25 Aug 2027", "Active", "scheduled"],
  ["LM-2026-000183", "Gowtham Fuels", "Fuel dispenser", "25 Aug 2026", "25 Aug 2027", "Active", "scheduled"],
  ["LM-2026-000177", "Aarav Retail Pvt. Ltd.", "Retail weighing scale", "18 Aug 2026", "18 Aug 2027", "Active", "scheduled"],
  ["LM-2025-000921", "Metro Cold Storage", "Temperature recorder", "12 Aug 2025", "12 Aug 2026", "Expiring soon", "pending"],
] as const;

const reports = [
  ["Pendency overview", "Pendency", "25 Aug 2026", "Ready", "reports/pendency.pdf"],
  ["Certificate activity - August", "Certificate activity", "24 Aug 2026", "Ready", "reports/certificates-august.pdf"],
  ["Inspection performance", "Inspection performance", "20 Aug 2026", "Ready", "reports/inspection-performance.pdf"],
  ["District compliance summary", "Compliance", "Queued now", "Queued", ""],
] as const;

const nav: Array<[View, string]> = [["Applications", "/applications"], ["Inspections", "/inspections"], ["Certificates", "/certificates"], ["Reports", "/reports"]];

export function PortalView({ view }: { view: View }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [applications, setApplications] = useState<readonly ApplicationItem[]>(demoApplications);
  const [applicationsLoading, setApplicationsLoading] = useState(view === "Applications");
  const filteredApplications = useMemo(() => applications.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase()) && (filter === "All" || item[3] === filter)), [applications, filter, query]);

  useEffect(() => {
    if (view !== "Applications") return;
    fetch("/api/applications")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load applications.");
        const records = await response.json();
        setApplications(records.map((application: { referenceNo: string; applicant: { legalName: string }; instrument: { category: string }; status: string }) => [application.referenceNo, application.applicant.legalName, application.instrument.category, application.status.replaceAll("_", " "), application.status.toLowerCase()] as const));
      })
      .catch(() => setApplications([]))
      .finally(() => setApplicationsLoading(false));
  }, [view]);

  function action(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  return <main className="portal-shell">
    <aside className="sidebar">
      <Link href="/" className="brand-lockup"><div className="brand-mark">U</div><div><strong>UMVP</strong><span>Legal metrology portal</span></div></Link>
      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-switcher"><span className="avatar avatar-teal">AP</span><span><strong>Andhra Pradesh</strong><small>Department workspace</small></span><span className="chevron">+</span></div>
      <nav className="main-nav" aria-label="Main navigation"><Link href="/" className="nav-item"><span className="nav-icon">o</span>Overview</Link>{nav.map(([label, href]) => <Link href={href} className={view === label ? "nav-item active" : "nav-item"} key={label}><span className="nav-icon">{label[0]}</span>{label}{label === "Applications" && <span className="nav-count">12</span>}</Link>)}</nav>
      <div className="sidebar-footer"><div className="help-row"><span className="help-icon">?</span><span><strong>Need assistance?</strong><small>Open support centre</small></span></div><div className="profile-row"><span className="avatar avatar-orange">AS</span><span><strong>Ananya Sharma</strong><small>District LMO</small></span><span className="dots">...</span></div></div>
    </aside>
    <section className="content-area">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark">U</div><strong>UMVP</strong></div><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{view}</strong></div><div className="top-actions"><label className="search-field"><span>⌕</span><input aria-label={`Search ${view.toLowerCase()}`} placeholder={`Search ${view.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="icon-button" aria-label="Notifications">!</button><button className="new-application" onClick={() => action(view === "Reports" ? "Report generation queued." : `New ${view.slice(0, -1).toLowerCase()} flow opened.`)}><span>+</span> {view === "Reports" ? "Generate report" : "New application"}</button></div></header>
      <div className="page-body workflow-body"><div className="heading-row"><div><p className="eyebrow">ANDHRA PRADESH / OPERATIONS</p><h1>{view}</h1><p className="lede">{view === "Applications" ? "Track every verification request from submission to decision." : view === "Inspections" ? "Plan field work, record evidence, and complete reviews." : view === "Certificates" ? "Issue, search, and manage QR-enabled verification certificates." : "Create and download operational reports for your department."}</p></div><div className="sync-status"><span className="status-dot" />Synced just now</div></div>
        {notice && <div className="toast" role="status">{notice}</div>}
        {view === "Applications" && <section className="panel workflow-panel"><div className="workflow-toolbar"><div className="filter-row">{["All", "Due today", "Scheduled", "Awaiting docs"].map((item) => <button className={filter === item ? "filter-chip selected" : "filter-chip"} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="export-button" onClick={() => action("Applications export prepared.")}>Export CSV</button></div><div className="table-head"><span>REFERENCE</span><span>APPLICANT</span><span>INSTRUMENT</span><span>STATUS</span><span> </span></div>{applicationsLoading ? <div className="empty-state">Loading applications...</div> : filteredApplications.map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span><span>{item[2]}</span><span className={`status-pill ${item[4]}`}>{item[3]}</span><button className="row-arrow" onClick={() => action(`${item[0]} opened.`)} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}{!applicationsLoading && !filteredApplications.length && <div className="empty-state">No applications match this view.</div>}</section>}
        {view === "Inspections" && <section className="panel workflow-panel"><div className="table-head"><span>INSPECTION</span><span>LOCATION</span><span>APPOINTMENT</span><span>STATUS</span><span> </span></div>{inspections.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())).map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}<small>{item[3]}</small></span><span>{item[2]}</span><span className={`status-pill ${item[5]}`}>{item[4]}</span><button className="row-arrow" onClick={() => action(`${item[0]} details opened.`)} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}</section>}
        {view === "Certificates" && <section className="panel workflow-panel"><div className="lookup-banner"><div><strong>Public certificate verification</strong><span>Search by certificate ID or scan a QR code.</span></div><button className="export-button" onClick={() => action("Verification lookup opened.")}>Verify certificate</button></div><div className="table-head"><span>CERTIFICATE</span><span>HOLDER</span><span>VALIDITY</span><span>STATUS</span><span> </span></div>{certificates.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())).map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}<small>{item[2]}</small></span><span>{item[3]}<small>until {item[4]}</small></span><span className={`status-pill ${item[6]}`}>{item[5]}</span><button className="row-arrow" onClick={() => action(`${item[0]} ready to view or download.`)} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}</section>}
        {view === "Reports" && <section className="panel workflow-panel"><div className="report-cards"><div><strong>48</strong><span>Open applications</span></div><div><strong>92%</strong><span>Compliance rate</span></div><div><strong>186</strong><span>Certificates issued</span></div><div><strong>07</strong><span>Pending review</span></div></div><div className="table-head"><span>REPORT</span><span>TYPE</span><span>CREATED</span><span>STATUS</span><span> </span></div>{reports.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())).map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span><span>{item[2]}</span><span className={`status-pill ${item[3] === "Ready" ? "scheduled" : "pending"}`}>{item[3]}</span><button className="row-arrow" onClick={() => action(item[4] ? "Report download started." : "Report generation queued.")} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}</section>}
        <footer className="page-footer"><span>UMVP &copy; 2026 Department of Legal Metrology</span><span>System status <i className="status-dot" /> Operational</span></footer>
      </div>
    </section>
  </main>;
}