"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const applications = [
  ["LM-24081", "Ravi Engineering Works", "Platform scale", "Hyderabad", "Today, 10:30", "Due today", "urgent"],
  ["LM-24078", "Aarav Retail Pvt. Ltd.", "Retail weighing scale", "Secunderabad", "Today, 14:00", "Scheduled", "scheduled"],
  ["LM-24074", "Sree Lakshmi Traders", "Fuel dispenser", "Warangal", "Tomorrow, 09:00", "Scheduled", "scheduled"],
  ["LM-24069", "Metro Cold Storage", "Temperature recorder", "Medchal", "25 Aug, 11:30", "Awaiting docs", "pending"],
] as const;
const navItems = [["Overview", "/"], ["Applications", "/applications"], ["Inspections", "/inspections"], ["Certificates", "/certificates"], ["Reports", "/reports"]] as const;

export default function Home() {
  const [filter, setFilter] = useState("All applications");
  const [query, setQuery] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const visibleApplications = useMemo(() => applications.filter((application) => application.join(" ").toLowerCase().includes(query.toLowerCase()) && (filter === "All applications" || application[5] === filter)), [filter, query]);
  function lookUpCertificate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookupMessage(certificateId.trim() ? `Certificate ${certificateId.trim()} is ready to verify.` : "Enter a certificate ID to continue.");
  }

  return <main className="portal-shell">
    <aside className="sidebar">
      <Link href="/" className="brand-lockup"><div className="brand-mark">U</div><div><strong>UMVP</strong><span>Legal metrology portal</span></div></Link>
      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-switcher"><span className="avatar avatar-teal">AP</span><span><strong>Andhra Pradesh</strong><small>Department workspace</small></span><span className="chevron">+</span></div>
      <nav className="main-nav" aria-label="Main navigation">{navItems.map(([label, href]) => <Link href={href} className={label === "Overview" ? "nav-item active" : "nav-item"} key={label}><span className="nav-icon">{label[0].toLowerCase()}</span>{label}{label === "Applications" && <span className="nav-count">12</span>}</Link>)}</nav>
      <div className="sidebar-footer"><div className="help-row"><span className="help-icon">?</span><span><strong>Need assistance?</strong><small>Open support centre</small></span></div><div className="profile-row"><span className="avatar avatar-orange">AS</span><span><strong>Ananya Sharma</strong><small>District LMO</small></span><span className="dots">...</span></div></div>
    </aside>
    <section className="content-area">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark">U</div><strong>UMVP</strong></div><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>Overview</strong></div><div className="top-actions"><label className="search-field"><span>⌕</span><input aria-label="Search applications" placeholder="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="icon-button" aria-label="Notifications">!</button><Link className="new-application" href="/applications"><span>+</span> New application</Link></div></header>
      <div className="page-body">
        <div className="heading-row"><div><p className="eyebrow">MONDAY, 25 AUGUST 2026</p><h1>Good morning, Ananya</h1><p className="lede">Here is what needs your attention across Andhra Pradesh.</p></div><div className="sync-status"><span className="status-dot" />Synced just now</div></div>
        <div className="metric-grid">{[["Open applications", "48", "+8.4%", "A"], ["Due this week", "12", "4 due today", "D"], ["Certificates issued", "186", "+12.1%", "C"], ["Pending review", "07", "2 overdue", "R"]].map(([label, value, foot, icon], index) => <article className={index === 0 ? "metric-card metric-primary" : "metric-card"} key={label}><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}</strong><div className="metric-foot"><span className={foot.startsWith("+") ? "positive" : "warning"}>{foot}</span>{!foot.startsWith("+") && <span className="metric-muted"> needs action</span>}{foot.startsWith("+") && " from last month"}</div></article>)}</div>
        <div className="dashboard-grid"><section className="panel queue-panel"><div className="panel-header"><div><h2>Inspection queue</h2><p>Your upcoming field work and review tasks.</p></div><Link className="text-button" href="/inspections">View all <span>-&gt;</span></Link></div><div className="filter-row">{["All applications", "Due today", "Scheduled", "Awaiting docs"].map((item) => <button className={filter === item ? "filter-chip selected" : "filter-chip"} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="application-list">{visibleApplications.length ? visibleApplications.map((application) => <div className="application-row" key={application[0]}><div className="date-block"><strong>{application[4].split(",")[0]}</strong><span>{application[4].split(",")[1]}</span></div><div className="application-info"><strong>{application[1]}</strong><span>{application[2]} <i>·</i> {application[3]}</span></div><span className={`status-pill ${application[6]}`}>{application[5]}</span><Link className="row-arrow" aria-label={`Open ${application[0]}`} href="/applications">&gt;</Link></div>) : <div className="empty-state">No applications match this view.</div>}</div></section>
          <aside className="side-stack"><section className="panel lookup-panel"><div className="panel-header"><div><h2>Verify a certificate</h2><p>Check authenticity using its certificate ID.</p></div><span className="qr-icon">#</span></div><form onSubmit={lookUpCertificate}><label htmlFor="certificate-id">Certificate ID</label><div className="lookup-input"><input id="certificate-id" placeholder="e.g. LM-2026-000184" value={certificateId} onChange={(event) => setCertificateId(event.target.value)} /><button aria-label="Verify certificate">-&gt;</button></div></form>{lookupMessage && <p className="lookup-message">{lookupMessage}</p>}<Link className="scan-button" href="/certificates">Open certificate register <span>+</span></Link></section><section className="panel alert-panel"><div className="panel-header"><div><h2>Attention needed</h2><p>Items that need a response.</p></div><span className="alert-count">3</span></div><Link className="alert-item" href="/applications"><span className="alert-symbol red">!</span><span><strong>2 overdue applications</strong><small>Review before end of day</small></span><span className="row-arrow">&gt;</span></Link><Link className="alert-item" href="/applications"><span className="alert-symbol yellow">i</span><span><strong>1 document request</strong><small>Metro Cold Storage</small></span><span className="row-arrow">&gt;</span></Link></section></aside>
        </div>
        <section className="recent-section"><div className="panel-header"><div><h2>Recent activity</h2><p>Latest updates from your department.</p></div><Link className="text-button" href="/reports">See activity <span>-&gt;</span></Link></div><div className="activity-strip"><div className="activity-item"><span className="activity-icon green">C</span><span><strong>Certificate issued</strong><small>LM-2026-000183 · 18 minutes ago</small></span></div><div className="activity-item"><span className="activity-icon blue">A</span><span><strong>Application received</strong><small>Ravi Engineering Works · 42 minutes ago</small></span></div><div className="activity-item"><span className="activity-icon orange">I</span><span><strong>Inspection completed</strong><small>Gowtham Fuels · 1 hour ago</small></span></div></div></section>
        <footer className="page-footer"><span>UMVP &copy; 2026 Department of Legal Metrology</span><span>System status <i className="status-dot" /> Operational</span></footer>
      </div>
    </section>
  </main>;
}
