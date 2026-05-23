"use client";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data, size = 200, thickness = 26 }: { data: DonutData[]; size?: number; thickness?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  const c = size / 2;
  let acc = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={thickness} />
      {data.map((d) => {
        const frac = d.value / total;
        const len = 2 * Math.PI * r * frac;
        const gap = 2 * Math.PI * r - len;
        const dashOffset = -acc * 2 * Math.PI * r;
        acc += frac;
        return (
          <circle
            key={d.label}
            cx={c} cy={c} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${len} ${gap}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${c} ${c})`}
          />
        );
      })}
      <text x={c} y={c - 6} textAnchor="middle" fontSize="11" fill="#64748b">Total</text>
      <text x={c} y={c + 14} textAnchor="middle" fontSize="15" fontWeight="600" fill="#e2e8f0" style={{ fontVariantNumeric: "tabular-nums" }}>
        {total >= 1000 ? "LKR " + Math.round(total / 1000) + "k" : "LKR " + total}
      </text>
    </svg>
  );
}
