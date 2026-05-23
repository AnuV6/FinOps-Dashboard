"use client";

import { useState, type FormEvent } from "react";
import Icon, { BrandMark } from "../Icon";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (pwd.length < 4) {
      setErr("Enter your password to continue.");
      return;
    }
    onLogin();
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <BrandMark size={46} />
        <h1>FinOps Dashboard</h1>
        <p className="subtitle">Sign in to manage your finances</p>
        <div className="field">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              className="input"
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setErr(""); }}
              placeholder="--------"
              autoFocus
              style={{ paddingRight: 36 }}
            />
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => setShow(s => !s)}
              style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}
            >
              <Icon name="Eye" size={15} />
            </button>
          </div>
          {err && <div style={{ color: "var(--red-2)", fontSize: 12 }}>{err}</div>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
          <Icon name="Lock" size={14} /> Sign in
        </button>
        <div className="login-foot">Single-user &middot; Last sync 2 minutes ago</div>
      </form>
    </div>
  );
}
