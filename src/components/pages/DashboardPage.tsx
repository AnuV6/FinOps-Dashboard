"use client";

import { useMemo } from "react";
import Icon from "../Icon";
import Stat from "../Stat";
import BarsChart from "../charts/BarsChart";
import DonutChart from "../charts/DonutChart";
import { type Transaction, type RecurringPayment, type Category, type Route, todayISO, LKR, daysBetween, fmtDate } from "@/lib/data";

interface Props {
  transactions: Transaction[];
  recurring: RecurringPayment[];
  categories: Category[];
  setRoute: (r: Route) => void;
}

export default function DashboardPage({ transactions, recurring, categories, setRoute }: Props) {
  const today = todayISO();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();

  const inMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
  });
  const totalIncome = inMonth.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = inMonth.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const upcomingCount = recurring.filter(r => r.status !== "paid").length;

  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const prev = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  });
  const prevIncome = prev.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0) || 1;
  const prevExpense = prev.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) || 1;
  const incomePct = ((totalIncome - prevIncome) / prevIncome) * 100;
  const expensePct = ((totalExpense - prevExpense) / prevExpense) * 100;

  const monthlyData = useMemo(() => {
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear(), m = d.getMonth();
      const mTx = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getFullYear() === y && td.getMonth() === m;
      });
      arr.push({
        label: d.toLocaleDateString("en-US", { month: "short" }),
        income: mTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: mTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }
    return arr;
  }, [transactions, today]);

  const expenseByCat = useMemo(() => {
    const map = new Map<string, number>();
    inMonth.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { label: name, value, color: cat ? cat.color : "#94a3b8" };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories, inMonth]);

  const upcoming = recurring
    .filter(r => r.status !== "paid")
    .map(r => ({ ...r, days: daysBetween(today, r.nextDue) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  const dueColor = (days: number) => {
    if (days < 0) return "due-soon-1";
    if (days <= 1) return "due-soon-1";
    if (days <= 2) return "due-soon-2";
    return "due-soon-ok";
  };
  const dueLabel = (days: number) => {
    if (days < 0) return `Overdue ${Math.abs(days)}d`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due in 1 day";
    return `Due in ${days} days`;
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="page-sub">{today.toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="page-head-actions">
          <button className="btn"><Icon name="Calendar" size={14} /> May 2026</button>
          <button className="btn btn-primary" onClick={() => setRoute("transactions")}>
            <Icon name="Plus" size={14} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <Stat icon="TrendUp" iconKind="income" label="Total Income" value={LKR(totalIncome)}
              trend={`${incomePct >= 0 ? "+" : ""}${incomePct.toFixed(1)}%`} trendDir={incomePct >= 0 ? "up" : "down"} />
        <Stat icon="Wallet" iconKind="expense" label="Total Expenses" value={LKR(totalExpense)}
              trend={`${expensePct >= 0 ? "+" : ""}${expensePct.toFixed(1)}%`} trendDir={expensePct >= 0 ? "down" : "up"} />
        <Stat icon="PiggyBank" iconKind="savings" label="Net Savings" value={LKR(netSavings)}
              trend={`${((netSavings / totalIncome) * 100).toFixed(0)}% of income`} trendDir={netSavings >= 0 ? "up" : "down"} />
        <Stat icon="Clock" iconKind="upcoming" label="Upcoming Payments" value={upcomingCount}
              trend={`Next in ${upcoming[0] ? Math.max(0, upcoming[0].days) : 0}d`} trendDir="up" />
      </div>

      <div className="chart-row">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Income vs Expenses</div>
              <div className="card-sub">Last 6 months</div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-dim)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--emerald)" }} /> Income
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-dim)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--red)" }} /> Expense
              </span>
            </div>
          </div>
          <BarsChart data={monthlyData} />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Expenses by Category</div>
              <div className="card-sub">This month</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <DonutChart data={expenseByCat} size={180} thickness={24} />
            <div className="legend" style={{ flex: 1, minWidth: 0 }}>
              {expenseByCat.slice(0, 6).map(d => (
                <div key={d.label} className="legend-item">
                  <span className="legend-swatch" style={{ background: d.color }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{d.label}</span>
                  <span className="legend-amount">{LKR(d.value).replace("LKR ", "")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Upcoming Payments</div>
            <div className="card-sub">Next 5 recurring payments due</div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => setRoute("recurring")}>
            View all <Icon name="ChevronRight" size={12} />
          </button>
        </div>
        <div>
          {upcoming.map(u => {
            const cat = categories.find(c => c.name === u.category);
            return (
              <div key={u.id} className="up-row">
                <div className="up-icon" style={{ background: (cat ? cat.color : "#475569") + "22", color: cat ? cat.color : "#94a3b8" }}>
                  <Icon name={cat ? cat.icon : "Wallet"} size={16} />
                </div>
                <div>
                  <div className="up-name">{u.name}</div>
                  <div className="up-meta">{u.category} &middot; {fmtDate(u.nextDue)}</div>
                </div>
                <span className={"badge " + (u.days < 0 ? "danger" : "")}>
                  <span className={"dot " + dueColor(u.days)} />
                  <span className={dueColor(u.days)}>{dueLabel(u.days)}</span>
                </span>
                <div className="up-amount">{LKR(u.amount)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
