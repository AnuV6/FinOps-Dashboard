"use client";

import { useState } from "react";
import { LKR } from "@/lib/data";

interface BarData {
  label: string;
  income: number;
  expense: number;
}

export default function BarsChart({ data, height = 240 }: { data: BarData[]; height?: number }) {
  const [hover, setHover] = useState<(BarData & { x: number; y: number }) | null>(null);
  const padL = 48, padR = 16, padT = 20, padB = 32;
  const width = 640;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const niceMax = Math.ceil(max / 50000) * 50000;
  const groupW = innerW / data.length;
  const barW = Math.min(18, (groupW - 14) / 2);

  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((niceMax / yTicks) * i));
  const yFor = (v: number) => padT + innerH - (v / niceMax) * innerH;

  return (
    <div style={{ position: "relative" }}>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ height }}>
        {tickVals.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={width - padR} y1={yFor(v)} y2={yFor(v)} stroke="rgba(148,163,184,0.08)" />
            <text x={padL - 8} y={yFor(v) + 3} textAnchor="end" fontSize="10" fill="#64748b">
              {v >= 1000 ? Math.round(v / 1000) + "k" : v}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = padL + groupW * i + groupW / 2;
          const incH = (d.income / niceMax) * innerH;
          const expH = (d.expense / niceMax) * innerH;
          return (
            <g key={d.label} onMouseEnter={() => setHover({ ...d, x: cx, y: padT })} onMouseLeave={() => setHover(null)}>
              <rect x={cx - barW - 2} y={yFor(d.income)} width={barW} height={incH} rx="3" fill="var(--emerald)" opacity={hover && hover.label !== d.label ? 0.5 : 0.95} />
              <rect x={cx + 2} y={yFor(d.expense)} width={barW} height={expH} rx="3" fill="var(--red)" opacity={hover && hover.label !== d.label ? 0.5 : 0.9} />
              <text x={cx} y={height - 10} textAnchor="middle" fontSize="11" fill="#94a3b8">{d.label}</text>
            </g>
          );
        })}
      </svg>
      {hover && (
        <div className="bar-tooltip" style={{ left: (hover.x / width) * 100 + "%", top: 0, transform: "translate(-50%, -110%)" }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{hover.label}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "var(--emerald-2)" }}>&#8593; {LKR(hover.income).replace("LKR ", "")}</span>
            <span style={{ color: "var(--red-2)" }}>&#8595; {LKR(hover.expense).replace("LKR ", "")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
