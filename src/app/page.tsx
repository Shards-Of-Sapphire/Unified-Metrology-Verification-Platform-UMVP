"use client";

import { useMemo, useState } from "react";

const applications = [
  { id: "LM-24081", name: "Ravi Engineering Works", instrument: "Platform scale", location: "Hyderabad", date: "Today, 10:30", status: "Due today", tone: "urgent" },
  { id: "LM-24078", name: "Aarav Retail Pvt. Ltd.", instrument: "Retail weighing scale", location: "Secunderabad", date: "Today, 14:00", status: "Scheduled", tone: "scheduled" },
  { id: "LM-24074", name: "Sree Lakshmi Traders", instrument: "Fuel dispenser", location: "Warangal", date: "Tomorrow, 09:00", status: "Scheduled", tone: "scheduled" },
  { id: "LM-24069", name: "Metro Cold Storage", instrument: "Temperature recorder", location: "Medchal", date: "25 Aug, 11:30", status: "Awaiting docs", tone: "pending" },
];

const navItems = ["Overview", "Applications", "Inspections", "Certificates", "Reports"];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [filter, setFilter] = useState("All applications");
  const [query, setQuery] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const visibleApplications = useMemo(() => applications.filter((application) => {
    const matchesQuery = [application.id, application.name, application.instrument, application.location].join(" ").toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All applications" || application.status === filter);
  }), [filter, query]);
  function lookUpCertificate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookupMessage(certificateId.trim() ? `Certificate ${certificateId.trim()} is ready to verify.` : "Enter a certificate ID to continue.");
  }

  return <main className="portal-shell">
    <aside className="sidebar">
      <div className="brand-lockup"><div className="brand-mark">U</div><div><strong>UMVP</strong><span>Legal metrology portal</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-switcher"><span className="avatar avatar-teal">AS</span><span><strong>Andhra Pradesh</strong><small>Department workspace</small></span><span className="chevron">+</span></div>
      <nav className="main-nav" aria-label="Main navigation">{navItems.map((item) => <button className={activeNav === item ? "nav-item active" : "nav-item"} key={item} onClick={() => setActiveNav(item)}><span className="nav-icon">{item[0].toLowerCase()}</span>{item}{item === "Applications" && <span className="nav-count">12</span>}</button>)}</nav>
      <div className="sidebar-footer"><div className="help-row"><span className="help-icon">?</span><span><strong>Need assistance?</strong><small>Open support centre</small></span></div><div className="profile-row"><span className="avatar avatar-orange">AS</span><span><strong>Ananya Sharma</strong><small>District LMO</small></span><span className="dots">...</span></div></div>
    </aside>
    <section className="content-area">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark">U</div><strong>UMVP</strong></div><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{activeNav}</strong></div><div className="top-actions"><label className="search-field"><span>⌕</span><input aria-label="Search applications" placeholder="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="icon-button" aria-label="Notifications">!</button><button className="new-application" onClick={() => setActiveNav("Applications")}><span>+</span> New application</button></div></header>
      <div className="page-body">
        <div className="heading-row"><div><p className="eyebrow">MONDAY, 25 AUGUST 2026</p><h1>Good morning, Ananya</h1><p className="lede">Here is what needs your attention across Andhra Pradesh.</p></div><div className="sync-status"><span className="status-dot" />Synced just now</div></div>
        <div className="metric-grid">{[["Open applications", "48", "+8.4%", "A"], ["Due this week", "12", "4 due today", "D"], ["Certificates issued", "186", "+12.1%", "C"], ["Pending review", "07", "2 overdue", "R"]].map(([label, value, foot, icon], index) => <article className={index === 0 ? "metric-card metric-primary" : "metric-card"} key={label}><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}</strong><div className="metric-foot"><span className={foot.startsWith("+") ? "positive" : "warning"}>{foot}</span>{!foot.startsWith("+") && <span className="metric-muted"> needs action</span>}{foot.startsWith("+") && " from last month"}</div></article>)}</div>
        <div className="dashboard-grid"><section className="panel queue-panel"><div className="panel-header"><div><h2>Inspection queue</h2><p>Your upcoming field work and review tasks.</p></div><button className="text-button" onClick={() => setActiveNav("Inspections")}>View all <span>-&gt;</span></button></div><div className="filter-row">{["All applications", "Due today", "Scheduled", "Awaiting docs"].map((item) => <button className={filter === item ? "filter-chip selected" : "filter-chip"} key={item} onClick={() => setFilter(item)}>{item}{item === "All applications" && <span>12</span>}</button>)}</div><div className="application-list">{visibleApplications.length ? visibleApplications.map((application) => <div className="application-row" key={application.id}><div className="date-block"><strong>{application.date.split(",")[0]}</strong><span>{application.date.split(",")[1]}</span></div><div className="application-info"><strong>{application.name}</strong><span>{application.instrument} <i>·</i> {application.location}</span></div><span className={`status-pill ${application.tone}`}>{application.status}</span><button className="row-arrow" aria-label={`Open ${application.id}`} onClick={() => setActiveNav("Applications")}>&gt;</button></div>) : <div className="empty-state">No applications match this view.</div>}</div></section>
          <aside className="side-stack"><section className="panel lookup-panel"><div className="panel-header"><div><h2>Verify a certificate</h2><p>Check authenticity using its certificate ID.</p></div><span className="qr-icon">#</span></div><form onSubmit={lookUpCertificate}><label htmlFor="certificate-id">Certificate ID</label><div className="lookup-input"><input id="certificate-id" placeholder="e.g. LM-2026-000184" value={certificateId} onChange={(event) => setCertificateId(event.target.value)} /><button aria-label="Verify certificate">-&gt;</button></div></form>{lookupMessage && <p className="lookup-message">{lookupMessage}</p>}<button className="scan-button" onClick={() => setCertificateId("LM-2026-000184")}>Scan QR code <span>+</span></button></section><section className="panel alert-panel"><div className="panel-header"><div><h2>Attention needed</h2><p>Items that need a response.</p></div><span className="alert-count">3</span></div><div className="alert-item"><span className="alert-symbol red">!</span><span><strong>2 overdue applications</strong><small>Review before end of day</small></span><span className="row-arrow">&gt;</span></div><div className="alert-item"><span className="alert-symbol yellow">i</span><span><strong>1 document request</strong><small>Metro Cold Storage</small></span><span className="row-arrow">&gt;</span></div></section></aside>
        </div>
        <section className="recent-section"><div className="panel-header"><div><h2>Recent activity</h2><p>Latest updates from your department.</p></div><button className="text-button">See activity <span>-&gt;</span></button></div><div className="activity-strip"><div className="activity-item"><span className="activity-icon green">C</span><span><strong>Certificate issued</strong><small>LM-2026-000183 · 18 minutes ago</small></span></div><div className="activity-item"><span className="activity-icon blue">A</span><span><strong>Application received</strong><small>Ravi Engineering Works · 42 minutes ago</small></span></div><div className="activity-item"><span className="activity-icon orange">I</span><span><strong>Inspection completed</strong><small>Gowtham Fuels · 1 hour ago</small></span></div></div></section>
        <footer className="page-footer"><span>UMVP &copy; 2026 Department of Legal Metrology</span><span>System status <i className="status-dot" /> Operational</span></footer>
      </div>
    </section>
  </main>;
}
