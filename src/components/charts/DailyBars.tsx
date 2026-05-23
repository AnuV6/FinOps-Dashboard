"use client";

interface DailyData {
  day: number;
  value: number;
  dow: number;
}

export default function DailyBars({ data, height = 260 }: { data: DailyData[]; height?: number }) {
  const padL = 36, padR = 12, padT = 20, padB = 28;
  const width = 720;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...data.map(d => d.value), 1);
  const niceMax = Math.ceil(max / 5000) * 5000 || max;
  const w = innerW / data.length - 2;
  const yFor = (v: number) => padT + innerH - (v / niceMax) * innerH;
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => Math.round((niceMax / ticks) * i));

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ height }}>
      {tickVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={width - padR} y1={yFor(v)} y2={yFor(v)} stroke="rgba(148,163,184,0.07)" />
          <text x={padL - 6} y={yFor(v) + 3} textAnchor="end" fontSize="9.5" fill="#64748b">
            {v >= 1000 ? Math.round(v / 1000) + "k" : v}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = padL + (innerW / data.length) * i + 1;
        const h = (d.value / niceMax) * innerH;
        const isWeekend = d.dow === 0 || d.dow === 6;
        return (
          <g key={d.day}>
            <rect x={x} y={yFor(d.value)} width={w} height={h} rx="2.5"
              fill={d.value > 0 ? (isWeekend ? "var(--accent-2)" : "var(--accent)") : "rgba(148,163,184,0.1)"} />
            {(i + 1) % 5 === 0 || i === 0 ? (
              <text x={x + w / 2} y={height - 10} textAnchor="middle" fontSize="10" fill="#64748b">{d.day}</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
