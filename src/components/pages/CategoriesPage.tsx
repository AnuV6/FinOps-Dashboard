"use client";

import { useState } from "react";
import Icon from "../Icon";
import Modal from "../Modal";
import { IncomeExpenseSeg } from "../FormControls";
import { type Transaction, type Category, ICONS_FOR_CATS, COLOR_SWATCHES } from "@/lib/data";

interface Props {
  categories: Category[];
  setCategories: (c: Category[]) => void;
  transactions: Transaction[];
}

function CategoryModal({ c, mode, onSave, onClose }: {
  c?: Category;
  mode: "add" | "edit";
  onSave: (c: Category) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Category>(() => c || { id: "", name: "", type: "expense", color: "#60a5fa", icon: "Wallet" });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name) return;
    onSave({ ...form, id: c ? c.id : "" });
  };

  return (
    <Modal
      title={mode === "add" ? "Add Category" : "Edit Category"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}><Icon name="Check" size={14} /> {mode === "add" ? "Add" : "Save"}</button>
        </>
      }
    >
      <div className="field">
        <label>Name</label>
        <input className="input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Groceries" autoFocus />
      </div>
      <div className="field">
        <label>Type</label>
        <IncomeExpenseSeg value={form.type} onChange={v => set("type", v)} />
      </div>
      <div className="field">
        <label>Color</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COLOR_SWATCHES.map(col => (
            <button key={col}
              onClick={() => set("color", col)}
              style={{
                width: 26, height: 26, borderRadius: 7,
                background: col,
                border: form.color === col ? "2px solid #fff" : "2px solid transparent",
                boxShadow: form.color === col ? `0 0 0 2px ${col}` : "none",
                cursor: "default",
              }}
            />
          ))}
        </div>
      </div>
      <div className="field">
        <label>Icon</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ICONS_FOR_CATS.map(ic => (
            <button key={ic}
              onClick={() => set("icon", ic)}
              className="btn btn-icon"
              style={{
                background: form.icon === ic ? form.color + "22" : "var(--surface-2)",
                color: form.icon === ic ? form.color : "var(--text-dim)",
                borderColor: form.icon === ic ? form.color + "55" : "var(--border-strong)",
              }}>
              <Icon name={ic} size={15} />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default function CategoriesPage({ categories, setCategories, transactions }: Props) {
  const [modal, setModal] = useState<{ mode: "add" | "edit"; c?: Category } | null>(null);

  const countFor = (c: Category) => transactions.filter(t => t.category === c.name).length;

  const onSave = (c: Category) => {
    if (modal?.mode === "add") setCategories([...categories, { ...c, id: "c" + Date.now() }]);
    else setCategories(categories.map(x => x.id === c.id ? c : x));
    setModal(null);
  };
  const onDelete = (id: string) => setCategories(categories.filter(c => c.id !== id));

  const incomeCats = categories.filter(c => c.type === "income");
  const expenseCats = categories.filter(c => c.type === "expense");

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Categories</h1>
          <div className="page-sub">{categories.length} categories &middot; {incomeCats.length} income, {expenseCats.length} expense</div>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
            <Icon name="Plus" size={14} /> Add Category
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--text-faint)" }}>Income</h3>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--text-faint)", fontSize: 12 }}>{incomeCats.length}</span>
        </div>
        <div className="cat-grid">
          {incomeCats.map(c => (
            <div key={c.id} className="cat-card income">
              <div className="cat-icon" style={{ background: c.color + "22", color: c.color }}><Icon name={c.icon} size={18} /></div>
              <div>
                <div className="cat-name">{c.name}</div>
                <div className="cat-sub">{countFor(c)} transactions</div>
              </div>
              <div className="cat-actions">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal({ mode: "edit", c })}><Icon name="Edit" size={13} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(c.id)}><Icon name="Trash" size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--text-faint)" }}>Expense</h3>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--text-faint)", fontSize: 12 }}>{expenseCats.length}</span>
        </div>
        <div className="cat-grid">
          {expenseCats.map(c => (
            <div key={c.id} className="cat-card expense">
              <div className="cat-icon" style={{ background: c.color + "22", color: c.color }}><Icon name={c.icon} size={18} /></div>
              <div>
                <div className="cat-name">{c.name}</div>
                <div className="cat-sub">{countFor(c)} transactions</div>
              </div>
              <div className="cat-actions">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal({ mode: "edit", c })}><Icon name="Edit" size={13} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(c.id)}><Icon name="Trash" size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <CategoryModal c={modal.c} mode={modal.mode} onSave={onSave} onClose={() => setModal(null)} />}
    </div>
  );
}
