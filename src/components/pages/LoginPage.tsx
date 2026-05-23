"use client";

import { useState, type FormEvent } from "react";
import Icon, { BrandMark } from "../Icon";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!pwd) {
      setErr("Enter your password to continue.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setErr("Incorrect password.");
      }
    } catch {
      setErr("Could not reach server.");
    } finally {
      setBusy(false);
    }
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
        <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }} disabled={busy}>
          <Icon name="Lock" size={14} /> {busy ? "Signing in…" : "Sign in"}
        </button>
        <div className="login-foot">Single-user &middot; Personal finance dashboard</div>
      </form>
    </div>
  );
}
