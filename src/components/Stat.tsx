"use client";

import Icon from "./Icon";

interface StatProps {
  icon: string;
  iconKind?: string;
  label: string;
  value: string | number;
  trend?: string;
  trendDir?: "up" | "down";
}

export default function Stat({ icon, iconKind, label, value, trend, trendDir }: StatProps) {
  return (
    <div className="stat">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className={"stat-icon " + (iconKind || "")}>
          <Icon name={icon} size={18} />
        </div>
        {trend && (
          <span className={"stat-trend " + (trendDir === "down" ? "down" : "")}>
            <Icon name={trendDir === "down" ? "TrendDown" : "TrendUp"} size={12} />
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ marginTop: 6 }}>{value}</div>
      </div>
    </div>
  );
}
