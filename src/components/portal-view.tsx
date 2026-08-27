"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type View = "Applications" | "Inspections" | "Certificates" | "Reports";

type ApplicationItem = readonly [string, string, string, string, string];
type InspectionItem = readonly [string, string, string, string, string, string];
type CertificateItem = readonly [string, string, string, string, string, string, string];
type ReportItem = readonly [string, string, string, string, string];

const nav: Array<[View, string]> = [["Applications", "/applications"], ["Inspections", "/inspections"], ["Certificates", "/certificates"], ["Reports", "/reports"]];

export function PortalView({ view }: { view: View }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [applications, setApplications] = useState<readonly ApplicationItem[]>([]);
  const [inspections, setInspections] = useState<readonly InspectionItem[]>([]);
  const [certificates, setCertificates] = useState<readonly CertificateItem[]>([]);
  const [reports, setReports] = useState<readonly ReportItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const filteredApplications = useMemo(() => applications.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase()) && (filter === "All" || item[3] === filter)), [applications, filter, query]);

  useEffect(() => {
    const endpoint = view === "Applications" ? "/api/applications" : view === "Inspections" ? "/api/inspections" : view === "Certificates" ? "/api/certificates" : "/api/reports";
    fetch(endpoint)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load applications.");
        const records = await response.json();
        if (view === "Applications") setApplications(records.map((item: { referenceNo: string; applicant: { legalName: string }; instrument: { category: string }; status: string }) => [item.referenceNo, item.applicant.legalName, item.instrument.category, item.status.replaceAll("_", " "), item.status.toLowerCase()] as const));
        if (view === "Inspections") setInspections(records.map((item: { id: string; application: { applicant: { legalName: string }; instrument: { category: string } }; scheduledAt: string; status: string }) => [item.id.slice(-6).toUpperCase(), item.application.applicant.legalName, new Date(item.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), item.application.instrument.category, item.status.replaceAll("_", " "), item.status.toLowerCase()] as const));
        if (view === "Certificates") setCertificates(records.map((item: { certificateNo: string; application: { applicant: { legalName: string }; instrument: { category: string } }; validFrom: string; validUntil: string; status: string }) => [item.certificateNo, item.application.applicant.legalName, item.application.instrument.category, new Date(item.validFrom).toLocaleDateString("en-IN"), new Date(item.validUntil).toLocaleDateString("en-IN"), item.status.replaceAll("_", " "), item.status.toLowerCase()] as const));
        if (view === "Reports") setReports(records.map((item: { type: string; createdAt: string; status: string; fileKey: string | null }) => [item.type.replaceAll("_", " "), item.type.replaceAll("_", " "), new Date(item.createdAt).toLocaleDateString("en-IN"), item.status, item.fileKey ?? ""] as const));
      })
      .catch(() => { setApplications([]); setInspections([]); setCertificates([]); setReports([]); })
      .finally(() => setDataLoading(false));
  }, [view]);

  function action(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, latitude: Number(values.latitude), longitude: Number(values.longitude), clientId: crypto.randomUUID() }) });
    const result = await response.json();
    if (!response.ok) { setFormError(result.error ?? "Unable to submit application."); return; }
    setFormMessage(`${result.application.referenceNo} submitted${result.assignedCentre ? ` and assigned to ${result.assignedCentre}` : ""}.`);
    setShowApplicationForm(false);
    setDataLoading(true);
    fetch("/api/applications").then((response) => response.json()).then((records) => setApplications(records.map((item: { referenceNo: string; applicant: { legalName: string }; instrument: { category: string }; status: string }) => [item.referenceNo, item.applicant.legalName, item.instrument.category, item.status.replaceAll("_", " "), item.status.toLowerCase()] as const))).finally(() => setDataLoading(false));
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
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark">U</div><strong>UMVP</strong></div><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{view}</strong></div><div className="top-actions"><label className="search-field"><span>⌕</span><input aria-label={`Search ${view.toLowerCase()}`} placeholder={`Search ${view.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="icon-button" aria-label="Notifications">!</button><button className="new-application" onClick={() => view === "Applications" ? setShowApplicationForm(true) : action(view === "Reports" ? "Report generation queued." : `New ${view.slice(0, -1).toLowerCase()} flow opened.`)}><span>+</span> {view === "Reports" ? "Generate report" : "New application"}</button></div></header>
      <div className="page-body workflow-body"><div className="heading-row"><div><p className="eyebrow">ANDHRA PRADESH / OPERATIONS</p><h1>{view}</h1><p className="lede">{view === "Applications" ? "Track every verification request from submission to decision." : view === "Inspections" ? "Plan field work, record evidence, and complete reviews." : view === "Certificates" ? "Issue, search, and manage QR-enabled verification certificates." : "Create and download operational reports for your department."}</p></div><div className="sync-status"><span className="status-dot" />Synced just now</div></div>
        {notice && <div className="toast" role="status">{notice}</div>}
        {formMessage && <div className="toast" role="status">{formMessage}</div>}
        {showApplicationForm && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-application-title"><div className="modal-header"><div><p className="eyebrow">ONLINE SUBMISSION</p><h2 id="new-application-title">New application</h2></div><button className="row-arrow" onClick={() => setShowApplicationForm(false)} aria-label="Close">x</button></div><form className="application-form" onSubmit={submitApplication}><label>Legal name<input name="legalName" required /></label><label>Contact person<input name="contactName" required /></label><label>Email<input name="email" type="email" required /></label><label>Phone<input name="phone" required /></label><label>Address<input name="address" required /></label><label>Registration number<input name="registrationNo" /></label><label>Instrument category<input name="category" placeholder="Platform scale" required /></label><label>Serial number<input name="serialNumber" required /></label><label>Service type<input name="serviceType" defaultValue="Verification and stamping" required /></label><div className="coordinate-fields"><label>Latitude<input name="latitude" type="number" step="any" min="-90" max="90" required /></label><label>Longitude<input name="longitude" type="number" step="any" min="-180" max="180" required /></label></div>{formError && <p className="form-error">{formError}</p>}<button className="login-button">Submit application</button></form></section></div>}
        {view === "Applications" && <section className="panel workflow-panel"><div className="workflow-toolbar"><div className="filter-row">{["All", "Due today", "Scheduled", "Awaiting docs"].map((item) => <button className={filter === item ? "filter-chip selected" : "filter-chip"} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="export-button" onClick={() => action("Applications export prepared.")}>Export CSV</button></div><div className="table-head"><span>REFERENCE</span><span>APPLICANT</span><span>INSTRUMENT</span><span>STATUS</span><span> </span></div>{dataLoading ? <div className="empty-state">Loading applications...</div> : filteredApplications.map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span><span>{item[2]}</span><span className={`status-pill ${item[4]}`}>{item[3]}</span><button className="row-arrow" onClick={() => action(`${item[0]} opened.`)} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}{!dataLoading && !filteredApplications.length && <div className="empty-state">No applications match this view.</div>}</section>}
        {view === "Inspections" && <section className="panel workflow-panel"><div className="table-head"><span>INSPECTION</span><span>LOCATION</span><span>APPOINTMENT</span><span>STATUS</span><span> </span></div>{dataLoading ? <div className="empty-state">Loading inspections...</div> : inspections.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())).map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}<small>{item[3]}</small></span><span>{item[2]}</span><span className={`status-pill ${item[5]}`}>{item[4]}</span><button className="row-arrow" onClick={() => action(`${item[0]} details opened.`)} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}</section>}
        {view === "Certificates" && <section className="panel workflow-panel"><div className="lookup-banner"><div><strong>Public certificate verification</strong><span>Search by certificate ID or scan a QR code.</span></div><Link className="export-button" href="/verify">Verify certificate</Link></div><div className="table-head"><span>CERTIFICATE</span><span>HOLDER</span><span>VALIDITY</span><span>STATUS</span><span> </span></div>{dataLoading ? <div className="empty-state">Loading certificates...</div> : certificates.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())).map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}<small>{item[2]}</small></span><span>{item[3]}<small>until {item[4]}</small></span><span className={`status-pill ${item[6]}`}>{item[5]}</span><button className="row-arrow" onClick={() => action(`${item[0]} ready to view or download.`)} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}</section>}
        {view === "Reports" && <section className="panel workflow-panel"><div className="report-cards"><div><strong>-</strong><span>Open applications</span></div><div><strong>-</strong><span>Compliance rate</span></div><div><strong>-</strong><span>Certificates issued</span></div><div><strong>-</strong><span>Pending review</span></div></div><div className="table-head"><span>REPORT</span><span>TYPE</span><span>CREATED</span><span>STATUS</span><span> </span></div>{dataLoading ? <div className="empty-state">Loading reports...</div> : reports.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())).map((item) => <div className="table-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span><span>{item[2]}</span><span className={`status-pill ${item[3] === "READY" ? "scheduled" : "pending"}`}>{item[3]}</span><button className="row-arrow" onClick={() => action(item[4] ? "Report download started." : "Report generation queued.")} aria-label={`Open ${item[0]}`}>&gt;</button></div>)}</section>}
        <footer className="page-footer"><span>UMVP &copy; 2026 Department of Legal Metrology</span><span>System status <i className="status-dot" /> Operational</span></footer>
      </div>
    </section>
  </main>;
}