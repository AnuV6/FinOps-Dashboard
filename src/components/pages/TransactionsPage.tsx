"use client";

import { useState, useMemo, useEffect } from "react";
import Icon from "../Icon";
import Modal from "../Modal";
import { IncomeExpenseSeg } from "../FormControls";
import { type Transaction, type Category, LKR, fmtDate, isoDate, todayISO } from "@/lib/data";

interface Props {
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
  categories: Category[];
}

function TransactionModal({ tx, mode, categories, onSave, onClose }: {
  tx?: Transaction;
  mode: "add" | "edit";
  categories: Category[];
  onSave: (t: Transaction) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(() => tx || {
    id: "",
    type: "expense" as const,
    amount: "" as unknown as number,
    category: "Food",
    date: isoDate(todayISO()),
    note: "",
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const cats = categories.filter(c => c.type === form.type);

  useEffect(() => {
    if (!cats.find(c => c.name === form.category)) {
      set("category", cats[0] ? cats[0].name : "");
    }
  }, [form.type]);// eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    if (!form.amount || isNaN(Number(form.amount))) return;
    onSave({ ...form, amount: Number(form.amount), id: tx ? tx.id : "" } as Transaction);
  };

  return (
    <Modal
      title={mode === "add" ? "Add Transaction" : "Edit Transaction"}
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
        <label>Type</label>
        <IncomeExpenseSeg value={form.type} onChange={v => set("type", v)} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Amount (LKR)</label>
          <input className="input" type="number" placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label>Date</label>
          <input className="input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Category</label>
        <select className="select" value={form.category} onChange={e => set("category", e.target.value)}>
          {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Note <span style={{ color: "var(--text-faint)" }}>(optional)</span></label>
        <input className="input" type="text" placeholder="e.g. Lunch at Upali's" value={form.note} onChange={e => set("note", e.target.value)} />
      </div>
    </Modal>
  );
}

export default function TransactionsPage({ transactions, setTransactions, categories }: Props) {
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "add" | "edit"; tx?: Transaction } | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCat !== "all" && t.category !== filterCat) return false;
      if (filterFrom && t.date < filterFrom) return false;
      if (filterTo && t.date > filterTo) return false;
      if (search && !(t.note || "").toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filterType, filterCat, filterFrom, filterTo, search]);

  const totalIncome = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const onSave = (tx: Transaction) => {
    if (modal?.mode === "add") {
      setTransactions([{ ...tx, id: "t" + Date.now() }, ...transactions]);
    } else {
      setTransactions(transactions.map(t => t.id === tx.id ? tx : t));
    }
    setModal(null);
  };
  const onDelete = (id: string) => setTransactions(transactions.filter(t => t.id !== id));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Transactions</h1>
          <div className="page-sub">{filtered.length} of {transactions.length} transactions</div>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
            <Icon name="Plus" size={14} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input" style={{ minWidth: 240, flex: 1, maxWidth: 320 }}>
          <Icon name="Search" size={14} />
          <input className="input" placeholder="Search note or category..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input className="input" type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ width: 160 }} />
        <span style={{ color: "var(--text-faint)" }}>&rarr;</span>
        <input className="input" type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ width: 160 }} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
          <span style={{ color: "var(--emerald-2)" }}>+{LKR(totalIncome)}</span>
          <span style={{ color: "var(--red-2)" }}>-{LKR(totalExpense)}</span>
        </div>
      </div>

      <div className="card flush">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 120 }}>Date</th>
              <th style={{ width: 100 }}>Type</th>
              <th>Category</th>
              <th>Note</th>
              <th className="right" style={{ width: 160 }}>Amount</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-faint)" }}>
                No transactions match your filters.
              </td></tr>
            )}
            {filtered.map(t => {
              const cat = categories.find(c => c.name === t.category);
              return (
                <tr key={t.id}>
                  <td style={{ color: "var(--text-dim)" }}>{fmtDate(t.date)}</td>
                  <td>
                    <span className={"badge " + t.type}>
                      <span className="dot" />
                      {t.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: cat ? cat.color : "#94a3b8" }} />
                      {t.category}
                    </div>
                  </td>
                  <td style={{ color: "var(--text-dim)" }}>{t.note || "\u2014"}</td>
                  <td className="right num" style={{ color: t.type === "income" ? "var(--emerald-2)" : "var(--red-2)", fontWeight: 500 }}>
                    {t.type === "income" ? "+" : "\u2212"}{LKR(t.amount)}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => setModal({ mode: "edit", tx: t })}><Icon name="Edit" size={14} /></button>
                      <button className="btn btn-ghost btn-icon" onClick={() => onDelete(t.id)}><Icon name="Trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <TransactionModal
          tx={modal.tx}
          mode={modal.mode}
          categories={categories}
          onSave={onSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
