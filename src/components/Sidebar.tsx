"use client";

import Icon, { BrandMark } from "./Icon";
import { NAV_ITEMS, type Route } from "@/lib/data";

interface SidebarProps {
  route: Route;
  setRoute: (r: Route) => void;
  onLogout: () => void;
}

export default function Sidebar({ route, setRoute, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandMark />
        <div className="brand-text">
          <div className="brand-name">FinOps</div>
          <div className="brand-sub">Personal finance</div>
        </div>
      </div>
      {NAV_ITEMS.map((n) => (
        <div
          key={n.id}
          className={"nav-item " + (route === n.id ? "active" : "")}
          onClick={() => setRoute(n.id)}
          title={n.label}
        >
          <Icon name={n.icon} size={17} />
          <span className="nav-label">{n.label}</span>
        </div>
      ))}
      <div className="nav-spacer" />
      <div className="sidebar-footer">
        <div className="avatar">AD</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Anupa D.</div>
          <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Owner</div>
        </div>
        <button className="btn btn-ghost btn-icon" title="Sign out" onClick={onLogout}>
          <Icon name="Logout" size={15} />
        </button>
      </div>
    </aside>
  );
}
