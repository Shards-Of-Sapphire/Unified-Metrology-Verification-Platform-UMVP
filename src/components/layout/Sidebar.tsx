"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Overview",
    href: "/",
    icon: "⌂",
  },
  {
    label: "Applications",
    href: "/applications",
    icon: "A",
  },
  {
    label: "Inspections",
    href: "/inspections",
    icon: "I",
  },
  {
    label: "Certificates",
    href: "/certificates",
    icon: "C",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "R",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <Link href="/" className="brand-lockup">
        <div className="brand-mark">U</div>

        <div>
          <strong>UMVP</strong>
          <span>Legal metrology portal</span>
        </div>
      </Link>

      {/* Workspace */}
      <div className="workspace-label">WORKSPACE</div>

      <div className="workspace-switcher">
        <span className="avatar avatar-teal">AP</span>

        <span>
          <strong>AndhraPradesh</strong>
          <small>Department workspace</small>
        </span>

        <span className="chevron">+</span>
      </div>

      {/* Navigation */}
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "nav-item active" : "nav-item"}
            >
              <span className="nav-icon">{item.icon}</span>

              {item.label}

              {item.label === "Applications" && (
                <span className="nav-count">12</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-footer">
        <div className="help-row">
          <span className="help-icon">?</span>

          <span>
            <strong>Need assistance?</strong>
            <small>Open support centre</small>
          </span>
        </div>

        <div className="profile-row">
          <span className="avatar avatar-orange">AS</span>

          <span>
            <strong>Ananya Sharma</strong>
            <small>District LMO</small>
          </span>

          <span className="dots">...</span>
        </div>
      </div>
    </aside>
  );
}