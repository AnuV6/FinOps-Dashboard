"use client";

import { useState } from "react";
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

  const copyChatId = () => {
    navigator.clipboard?.writeText(settings.telegramChatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const set = (k: keyof Settings, v: boolean | string) => setSettings({ ...settings, [k]: v });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Preferences and integrations</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#38bdf8" }}><Icon name="Telegram" size={16} /></span>
                Telegram integration
              </div>
              <div className="card-sub">Get reminders &amp; log transactions from chat</div>
            </div>
            <span className="badge success"><span className="dot" /> Connected</span>
          </div>
          <div className="tg-card">
            <span>Chat ID: <span className="chat-id">{settings.telegramChatId}</span></span>
            <button className="btn btn-sm btn-ghost" onClick={copyChatId}>
              {copied ? <><Icon name="Check" size={12} /> Copied</> : <><Icon name="Copy" size={12} /> Copy</>}
            </button>
          </div>
          <div style={{ marginTop: 16 }}>
            <details>
              <summary style={{ cursor: "default", color: "var(--text-dim)", fontSize: 13, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="ChevronRight" size={12} /> How to connect a new chat
              </summary>
              <ol style={{ color: "var(--text-dim)", fontSize: 12.5, lineHeight: 1.7, paddingLeft: 18, marginTop: 10 }}>
                <li>Open Telegram and search for <span className="kbd">@FinOpsBot</span></li>
                <li>Send the command <span className="kbd">/start</span></li>
                <li>The bot will reply with a 6-digit code</li>
                <li>Paste the code in the field below to link your chat</li>
              </ol>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input className="input" placeholder="Enter 6-digit code" style={{ maxWidth: 180 }} />
                <button className="btn">Verify</button>
              </div>
            </details>
          </div>
        </div>

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
                <div className="desc">A 9 AM digest of today&apos;s due payments</div>
              </div>
              <Switch value={settings.dailySummary} onChange={v => set("dailySummary", v)} />
            </div>
          </div>
        </div>

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
              <input className="input" type={showPw ? "text" : "password"} placeholder="--------" />
            </div>
            <div className="field">
              <label>New password</label>
              <input className="input" type={showPw ? "text" : "password"} placeholder="At least 8 characters" />
            </div>
            <div className="field">
              <label>Confirm new password</label>
              <input className="input" type={showPw ? "text" : "password"} placeholder="Repeat new password" />
            </div>
            <button className="btn btn-primary">Update password</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <Checkbox value={showPw} onChange={setShowPw} label="Show passwords while typing" />
          </div>
        </div>
      </div>
    </div>
  );
}
