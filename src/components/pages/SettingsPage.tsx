"use client";

import { useState, useRef } from "react";
import Icon from "../Icon";
import { Switch, Checkbox } from "../FormControls";
import type { Settings } from "@/lib/data";

interface Props {
  settings: Settings;
  setSettings: (s: Settings) => void;
}

export default function SettingsPage({ settings, setSettings }: Props) {
  const [showPw, setShowPw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pwErr, setPwErr] = useState("");
  const [pwOk, setPwOk] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [clearStatus, setClearStatus] = useState<"idle" | "confirm" | "clearing" | "done">("idle");
  const [chatIdEdit, setChatIdEdit] = useState(settings.telegramChatId);
  const curPwRef = useRef<HTMLInputElement>(null);
  const newPwRef = useRef<HTMLInputElement>(null);
  const cfmPwRef = useRef<HTMLInputElement>(null);

  const copyChatId = () => {
    navigator.clipboard?.writeText(settings.telegramChatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const set = async (k: keyof Settings, v: boolean | string) => {
    const next = { ...settings, [k]: v };
    setSettings(next);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  const saveChatId = async () => {
    await set("telegramChatId", chatIdEdit);
  };

  const testReminder = async () => {
    setTestStatus("sending");
    try {
      const res = await fetch("/api/remind", { method: "POST" });
      setTestStatus(res.ok ? "ok" : "fail");
    } catch {
      setTestStatus("fail");
    }
    setTimeout(() => setTestStatus("idle"), 4000);
  };

  const updatePassword = async () => {
    setPwErr(""); setPwOk(false);
    const cur = curPwRef.current?.value ?? "";
    const nw = newPwRef.current?.value ?? "";
    const cfm = cfmPwRef.current?.value ?? "";
    if (!cur || !nw || !cfm) { setPwErr("All fields are required."); return; }
    if (nw !== cfm) { setPwErr("New passwords don't match."); return; }
    if (nw.length < 4) { setPwErr("Password must be at least 4 characters."); return; }

    const authRes = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: cur }),
    });
    if (!authRes.ok) { setPwErr("Current password is incorrect."); return; }

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, password: nw }),
    });
    if (curPwRef.current) curPwRef.current.value = "";
    if (newPwRef.current) newPwRef.current.value = "";
    if (cfmPwRef.current) cfmPwRef.current.value = "";
    setPwOk(true);
    setTimeout(() => setPwOk(false), 3000);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Preferences and integrations</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Telegram */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#38bdf8" }}><Icon name="Telegram" size={16} /></span>
                Telegram integration
              </div>
              <div className="card-sub">Reminders sent to your Telegram chat</div>
            </div>
            <span className="badge success"><span className="dot" /> Active</span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="field">
              <label>Chat ID</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="input"
                  value={chatIdEdit}
                  onChange={e => setChatIdEdit(e.target.value)}
                  placeholder="e.g. 742108391"
                  style={{ fontFamily: "var(--font-mono)", flex: 1 }}
                />
                <button className="btn btn-sm btn-ghost" onClick={copyChatId} title="Copy">
                  {copied ? <Icon name="Check" size={13} /> : <Icon name="Copy" size={13} />}
                </button>
                <button className="btn btn-sm btn-primary" onClick={saveChatId}>Save</button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={testReminder}
              disabled={testStatus === "sending"}
              style={{ gap: 6 }}
            >
              {testStatus === "sending" && <><Icon name="Spinner" size={13} /> Sending…</>}
              {testStatus === "ok"      && <><Icon name="Check"   size={13} /> Sent!</>}
              {testStatus === "fail"    && <><Icon name="Alert"   size={13} /> Failed — check token & chat ID</>}
              {testStatus === "idle"    && <><Icon name="Bell"    size={13} /> Test reminder now</>}
            </button>
          </div>

          <details>
            <summary style={{ cursor: "default", color: "var(--text-dim)", fontSize: 13, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="ChevronRight" size={12} /> How to set up the bot
            </summary>
            <ol style={{ color: "var(--text-dim)", fontSize: 12.5, lineHeight: 1.8, paddingLeft: 18, marginTop: 10 }}>
              <li>Open Telegram → search <span className="kbd">@BotFather</span> → send <span className="kbd">/newbot</span></li>
              <li>Follow the prompts and copy your <strong>Bot Token</strong></li>
              <li>Set <span className="kbd">TELEGRAM_BOT_TOKEN=&lt;token&gt;</span> in your <span className="kbd">.env</span> or docker-compose env</li>
              <li>Start a chat with your bot, then open <span className="kbd">https://api.telegram.org/bot&lt;token&gt;/getUpdates</span> to find your Chat ID</li>
              <li>Paste your Chat ID above and click <strong>Save</strong></li>
              <li>Click <strong>Test reminder now</strong> to verify it works</li>
            </ol>
          </details>
        </div>

        {/* Reminder settings */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Bell" size={15} />
                Reminder settings
              </div>
              <div className="card-sub">When to nudge you about due payments</div>
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-row">
              <div className="lbl-stack">
                <div className="lbl">Enable reminders</div>
                <div className="desc">Send Telegram messages before payments are due</div>
              </div>
              <Switch value={settings.remindersOn} onChange={v => set("remindersOn", v)} />
            </div>
            <div className="settings-row" style={{ opacity: settings.remindersOn ? 1 : 0.45, pointerEvents: settings.remindersOn ? "auto" : "none" }}>
              <div className="lbl-stack">
                <div className="lbl">Remind me</div>
                <div className="desc">Choose how many days before due date</div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <Checkbox value={settings.remind1d} onChange={v => set("remind1d", v)} label="1 day before" />
                <Checkbox value={settings.remind2d} onChange={v => set("remind2d", v)} label="2 days before" />
              </div>
            </div>
            <div className="settings-row">
              <div className="lbl-stack">
                <div className="lbl">Daily summary</div>
                <div className="desc">A 9 AM digest of today&apos;s due &amp; upcoming payments</div>
              </div>
              <Switch value={settings.dailySummary} onChange={v => set("dailySummary", v)} />
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ gridColumn: "1 / -1", borderColor: "var(--red-1, #ef4444)" }}>
          <div className="card-head">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--red-2, #f87171)" }}>
                <Icon name="Alert" size={15} />
                Danger zone
              </div>
              <div className="card-sub">Irreversible actions</div>
            </div>
          </div>
          <div className="settings-row" style={{ alignItems: "center" }}>
            <div className="lbl-stack">
              <div className="lbl">Clear all data</div>
              <div className="desc">Delete all transactions and recurring payments. Categories and settings are kept.</div>
            </div>
            {clearStatus === "idle" && (
              <button className="btn btn-sm" style={{ background: "var(--red-1, #ef4444)", color: "#fff" }} onClick={() => setClearStatus("confirm")}>
                Clear all data
              </button>
            )}
            {clearStatus === "confirm" && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--red-2, #f87171)" }}>Are you sure?</span>
                <button className="btn btn-sm" style={{ background: "var(--red-1, #ef4444)", color: "#fff" }} onClick={async () => {
                  setClearStatus("clearing");
                  await fetch("/api/clear", { method: "POST" });
                  setClearStatus("done");
                  setTimeout(() => window.location.reload(), 1000);
                }}>
                  Yes, delete everything
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setClearStatus("idle")}>Cancel</button>
              </div>
            )}
            {clearStatus === "clearing" && <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Clearing...</span>}
            {clearStatus === "done" && <span style={{ fontSize: 12, color: "var(--emerald-2)" }}>Cleared! Reloading...</span>}
          </div>
        </div>

        {/* Change password */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-head">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Lock" size={15} />
                Change password
              </div>
              <div className="card-sub">Update the password used to sign in to FinOps</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div className="field">
              <label>Current password</label>
              <input ref={curPwRef} className="input" type={showPw ? "text" : "password"} placeholder="--------" />
            </div>
            <div className="field">
              <label>New password</label>
              <input ref={newPwRef} className="input" type={showPw ? "text" : "password"} placeholder="At least 4 characters" />
            </div>
            <div className="field">
              <label>Confirm new password</label>
              <input ref={cfmPwRef} className="input" type={showPw ? "text" : "password"} placeholder="Repeat new password" />
            </div>
            <button className="btn btn-primary" onClick={updatePassword}>Update password</button>
          </div>
          {pwErr && <div style={{ color: "var(--red-2)", fontSize: 12, marginTop: 8 }}>{pwErr}</div>}
          {pwOk && <div style={{ color: "var(--emerald-2)", fontSize: 12, marginTop: 8 }}>Password updated successfully.</div>}
          <div style={{ marginTop: 12 }}>
            <Checkbox value={showPw} onChange={setShowPw} label="Show passwords while typing" />
          </div>
        </div>
      </div>
    </div>
  );
}
