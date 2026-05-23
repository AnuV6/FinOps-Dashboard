"use client";

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
}

export default function Icon({ name, size = 16, stroke = 1.75 }: IconProps) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "Dashboard":
      return <svg {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>;
    case "Transactions":
      return <svg {...p}><path d="M3 7h14M3 7l3-3M3 7l3 3"/><path d="M21 17H7M21 17l-3-3M21 17l-3 3"/></svg>;
    case "Recurring":
      return <svg {...p}><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>;
    case "Reports":
      return <svg {...p}><path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="11" width="3" height="6" rx="0.5"/><rect x="12" y="8" width="3" height="9" rx="0.5"/><rect x="17" y="13" width="3" height="4" rx="0.5"/></svg>;
    case "Categories":
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "Settings":
      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>;
    case "Plus":
      return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "Search":
      return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-3.6-3.6"/></svg>;
    case "Edit":
      return <svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>;
    case "Trash":
      return <svg {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case "Check":
      return <svg {...p}><path d="m5 12 5 5L20 7"/></svg>;
    case "X":
      return <svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "TrendUp":
      return <svg {...p}><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case "TrendDown":
      return <svg {...p}><path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>;
    case "Wallet":
      return <svg {...p}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><circle cx="17" cy="14" r="1.5"/></svg>;
    case "Coins":
      return <svg {...p}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>;
    case "PiggyBank":
      return <svg {...p}><path d="M19 5c-1.5 0-2.8 1.4-3 2H4a2 2 0 0 0-2 2v3a4 4 0 0 0 4 4 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a4 4 0 0 0 2-3v-1a2 2 0 0 0-2-2h-2L21 5h-2Z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h0"/></svg>;
    case "Clock":
      return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "Calendar":
      return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></svg>;
    case "Download":
      return <svg {...p}><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>;
    case "Bell":
      return <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "Logout":
      return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>;
    case "Briefcase":
      return <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case "Sparkles":
      return <svg {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M5.6 18.4 7.7 16.3M16.3 7.7l2.1-2.1"/></svg>;
    case "Utensils":
      return <svg {...p}><path d="M3 2v7a3 3 0 0 0 3 3v10"/><path d="M9 2v20"/><path d="M14 2v7c0 .5.5 1 1 1h1a3 3 0 0 0 3-3V2"/><path d="M16 22V10"/></svg>;
    case "Car":
      return <svg {...p}><path d="M14 16H9m10 0h2v-3.6L19.4 9H4.6L3 12.4V16h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
    case "Server":
      return <svg {...p}><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/></svg>;
    case "Landmark":
      return <svg {...p}><path d="M3 22h18"/><path d="M5 22V10M9 22V10M15 22V10M19 22V10"/><path d="M2 10h20L12 4 2 10Z"/></svg>;
    case "Gem":
      return <svg {...p}><path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="m8 9 4 12 4-12"/><path d="M2 9h20"/></svg>;
    case "Bolt":
      return <svg {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>;
    case "MoreHorizontal":
      return <svg {...p}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>;
    case "Telegram":
      return <svg {...p} viewBox="0 0 24 24"><path d="m21 4-3 16-5-4-2.5 3-1-5L4 11l17-7Z"/><path d="m9 14 12-10-7 12"/></svg>;
    case "Lock":
      return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case "Eye":
      return <svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "ChevronDown":
      return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case "ChevronRight":
      return <svg {...p}><path d="m9 6 6 6-6 6"/></svg>;
    case "Alert":
      return <svg {...p}><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/></svg>;
    case "Copy":
      return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    default:
      return null;
  }
}

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <div className="brand-logo" style={{ width: size, height: size }}>
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#052e21"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20V6a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 4v5h5" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    </div>
  );
}
