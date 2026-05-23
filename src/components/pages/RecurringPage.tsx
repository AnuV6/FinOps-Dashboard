"use client";

import { useState } from "react";
import Icon from "../Icon";
import Modal from "../Modal";
import { type Transaction, type RecurringPayment, type Category, LKR, fmtDate, isoDate, todayISO, daysBetween } from "@/lib/data";

interface Props {
  recurring: RecurringPayment[];
  setRecurring: (r: RecurringPayment[]) => void;
  categories: Category[];
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
}

function RecurringModal({ r, mode, categories, onSave, onClose }: {
  r?: RecurringPayment;
  mode: "add" | "edit";
  categories: Category[];
  onSave: (r: RecurringPayment) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<RecurringPayment>(() => r || {
    id: "",
    name: "",
    amount: "" as unknown as number,
    category: "Utilities",
    schedule: "fixed",
    dayOfMonth: 1,
    intervalDays: 30,
    nextDue: isoDate(todayISO()),
    status: "upcoming",
    notes: "",
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const cats = categories.filter(c => c.type === "expense");

  const submit = () => {
    if (!form.name || !form.amount) return;
    onSave({ ...form, amount: Number(form.amount), id: r ? r.id : "" });
  };

  return (
    <Modal
      title={mode === "add" ? "Add Recurring Payment" : "Edit Recurring Payment"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>
            <Icon name="Check" size={14} /> {mode === "add" ? "Add" : "Save"}
          </button>
        </>
      }
    >
      <div className="field">
        <label>Name</label>
        <input className="input" placeholder="e.g. Internet bill" value={form.name} onChange={e => set("name", e.target.value)} autoFocus />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Amount (LKR)</label>
          <input className="input" type="number" placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)} />
        </div>
        <div className="field">
          <label>Category</label>
          <select className="select" value={form.category} onChange={e => set("category", e.target.value)}>
            {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Schedule</label>
        <div className="seg">
          <button className={form.schedule === "fixed" ? "on" : ""} onClick={() => set("schedule", "fixed")}>Fixed date</button>
          <button className={form.schedule === "rolling" ? "on" : ""} onClick={() => set("schedule", "rolling")}>Rolling 30 days</button>
        </div>
      </div>
      <div className="field-row">
        {form.schedule === "fixed" ? (
          <div className="field">
            <label>Day of month</label>
            <select className="select" value={form.dayOfMonth ?? 1} onChange={e => set("dayOfMonth", Number(e.target.value))}>
              {Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        ) : (
          <div className="field">
            <label>Interval (days)</label>
            <input className="input" type="number" value={form.intervalDays ?? 30} onChange={e => set("intervalDays", Number(e.target.value))} />
          </div>
        )}
        <div className="field">
          <label>Next due</label>
          <input className="input" type="date" value={form.nextDue} onChange={e => set("nextDue", e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Notes <span style={{ color: "var(--text-faint)" }}>(optional)</span></label>
        <input className="input" placeholder="Anything you want to remember" value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>
    </Modal>
  );
}

export default function RecurringPage({ recurring, setRecurring, categories, transactions, setTransactions }: Props) {
  const [modal, setModal] = useState<{ mode: "add" | "edit"; r?: RecurringPayment } | null>(null);
  const today = todayISO();
  const sorted = [...recurring].map(r => ({ ...r, days: daysBetween(today, r.nextDue) })).sort((a, b) => a.days - b.days);

  const markPaid = (r: RecurringPayment & { days: number }) => {
    const newTx: Transaction = {
      id: "t" + Date.now(),
      date: isoDate(today),
      type: "expense",
      category: r.category,
      amount: r.amount,
      note: r.name + " (auto)",
    };
    setTransactions([newTx, ...transactions]);

    let next: Date;
    const cur = new Date(r.nextDue);
    if (r.schedule === "fixed") {
      next = new Date(cur);
      next.setMonth(next.getMonth() + 1);
    } else {
      next = new Date(cur);
      next.setDate(next.getDate() + (r.intervalDays || 30));
    }
    setRecurring(recurring.map(x => x.id === r.id ? { ...x, nextDue: isoDate(next), status: "upcoming" as const } : x));
  };

  const onDelete = (id: string) => setRecurring(recurring.filter(r => r.id !== id));
  const onSave = (r: RecurringPayment) => {
    if (modal?.mode === "add") setRecurring([{ ...r, id: "r" + Date.now() }, ...recurring]);
    else setRecurring(recurring.map(x => x.id === r.id ? r : x));
    setModal(null);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Recurring Payments</h1>
          <div className="page-sub">{recurring.length} recurring payments &middot; {sorted.filter(r => r.days < 0).length} overdue</div>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
            <Icon name="Plus" size={14} /> Add Recurring Payment
          </button>
        </div>
      </div>

      <div className="rec-grid">
        {sorted.map(r => {
          const cat = categories.find(c => c.name === r.category);
          const isOverdue = r.days < 0;
          return (
            <div key={r.id} className={"rec-card " + (isOverdue ? "overdue" : "")}>
              <div className="rec-head">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: (cat ? cat.color : "#475569") + "22",
                    color: cat ? cat.color : "#94a3b8",
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon name={cat ? cat.icon : "Wallet"} size={18} />
                  </div>
                  <div>
                    <div className="rec-name">{r.name}</div>
                    <div className="rec-meta">
                      <span>{r.category}</span>
                      <span>&middot;</span>
                      <span>{r.schedule === "fixed" ? `Day ${r.dayOfMonth}` : `Every ${r.intervalDays}d`}</span>
                    </div>
                  </div>
                </div>
                <div className="rec-amount">{LKR(r.amount)}</div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {isOverdue ? (
                  <span className="badge danger"><Icon name="Alert" size={11} /> Overdue {Math.abs(r.days)}d</span>
                ) : r.days <= 1 ? (
                  <span className="badge danger"><span className="dot" />Due {r.days === 0 ? "today" : "tomorrow"}</span>
                ) : r.days <= 2 ? (
                  <span className="badge amber"><span className="dot" />Due in {r.days}d</span>
                ) : (
                  <span className="badge success"><span className="dot" />Upcoming</span>
                )}
                <span className="badge">{r.schedule === "fixed" ? "Fixed date" : "Rolling 30 days"}</span>
              </div>

              <div className="rec-foot">
                <div className="rec-due">
                  Next due: <strong>{fmtDate(r.nextDue)}</strong>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => setModal({ mode: "edit", r })} title="Edit"><Icon name="Edit" size={13} /></button>
                  <button className="btn btn-sm btn-ghost" onClick={() => onDelete(r.id)} title="Delete"><Icon name="Trash" size={13} /></button>
                  <button className="btn btn-sm btn-primary" onClick={() => markPaid(r)}>
                    <Icon name="Check" size={13} /> Mark paid
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && <RecurringModal r={modal.r} mode={modal.mode} categories={categories} onSave={onSave} onClose={() => setModal(null)} />}
    </div>
  );
}
