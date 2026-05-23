"use client";

import { useState, useMemo } from "react";
import Icon from "../Icon";
import Stat from "../Stat";
import DailyBars from "../charts/DailyBars";
import { type Transaction, type Category, LKR, todayISO } from "@/lib/data";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export default function ReportsPage({ transactions, categories }: Props) {
  const today = todayISO();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const inMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const income = inMonth.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = inMonth.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daily = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const total = inMonth.filter(t => t.type === "expense" && new Date(t.date).getDate() === day).reduce((s, t) => s + t.amount, 0);
    const dow = new Date(year, month, day).getDay();
    return { day, value: total, dow };
  });

  const breakdown = useMemo(() => {
    const map = new Map<string, number>();
    inMonth.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    const total = Array.from(map.values()).reduce((s, v) => s + v, 0) || 1;
    return Array.from(map.entries()).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name, value, pct: (value / total) * 100, color: cat ? cat.color : "#94a3b8" };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, year, month, categories]);// eslint-disable-line react-hooks/exhaustive-deps

  const monthName = new Date(year, month, 1).toLocaleDateString("en-LK", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Reports</h1>
          <div className="page-sub">Monthly breakdown &middot; {monthName}</div>
        </div>
        <div className="page-head-actions">
          <select className="select" value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: 130 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{new Date(2026, i, 1).toLocaleDateString("en-LK", { month: "long" })}</option>
            ))}
          </select>
          <select className="select" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 90 }}>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn btn-primary">
            <Icon name="Download" size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <Stat icon="TrendUp" iconKind="income" label="Total Income" value={LKR(income)} />
        <Stat icon="Wallet" iconKind="expense" label="Total Expenses" value={LKR(expense)} />
        <Stat icon="PiggyBank" iconKind="savings" label="Net Savings" value={LKR(net)}
              trend={income > 0 ? `${((net / income) * 100).toFixed(0)}% savings rate` : "\u2014"} trendDir={net >= 0 ? "up" : "down"} />
      </div>

      <div className="reports-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Daily spending</div>
              <div className="card-sub">{monthName} &middot; expense per day</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
              Peak: LKR {Math.max(...daily.map(d => d.value)).toLocaleString()}
            </div>
          </div>
          <DailyBars data={daily} />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">By category</div>
              <div className="card-sub">{breakdown.length} categories</div>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Category</th>
                <th className="right">Amount</th>
                <th className="right" style={{ width: 60 }}>%</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text-faint)", padding: 24 }}>No expenses</td></tr>
              )}
              {breakdown.map(b => (
                <tr key={b.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color }} />
                      {b.name}
                    </div>
                    <div style={{ marginTop: 6, height: 4, background: "rgba(148,163,184,0.1)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: b.pct + "%", height: "100%", background: b.color, opacity: 0.7 }} />
                    </div>
                  </td>
                  <td className="right num">{LKR(b.value).replace("LKR ", "")}</td>
                  <td className="right num" style={{ color: "var(--text-dim)" }}>{b.pct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
