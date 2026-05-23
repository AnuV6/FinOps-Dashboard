"use client";

export function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={"switch " + (value ? "on" : "")} onClick={() => onChange(!value)} />
  );
}

export function Checkbox({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className={"cb " + (value ? "on" : "")} onClick={() => onChange(!value)}>
      <div className="cb-box">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#052e21" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5L20 7" />
        </svg>
      </div>
      <span>{label}</span>
    </div>
  );
}

export function IncomeExpenseSeg({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="seg income-expense">
      <button className={value === "income" ? "on income-on" : ""} onClick={() => onChange("income")}>Income</button>
      <button className={value === "expense" ? "on expense-on" : ""} onClick={() => onChange("expense")}>Expense</button>
    </div>
  );
}
