import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/telegram";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function lkr(amount: number): string {
  return "LKR " + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function POST() {
  const rows = await prisma.setting.findMany();
  const s = Object.fromEntries(rows.map(r => [r.key, r.value]));

  if (s.remindersOn !== "true") {
    return NextResponse.json({ ok: true, skipped: "reminders off" });
  }

  const chatId = s.telegramChatId ?? "";
  if (!chatId) {
    return NextResponse.json({ ok: false, error: "No Telegram chat ID configured" });
  }

  const today = todayStr();
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);

  const all = await prisma.recurringPayment.findMany();
  const sent: string[] = [];

  // 1-day reminder
  if (s.remind1d === "true") {
    const due1 = all.filter(r => r.nextDue === tomorrow);
    for (const r of due1) {
      const msg = `⏰ <b>Payment due tomorrow!</b>\n\n📋 <b>${r.name}</b>\n💰 ${lkr(r.amount)}\n📅 Due: ${fmtDate(r.nextDue)}\n🏷 ${r.category}${r.notes ? `\n📝 ${r.notes}` : ""}`;
      await sendMessage(chatId, msg);
      sent.push(`1d: ${r.name}`);
    }
  }

  // 2-day reminder
  if (s.remind2d === "true") {
    const due2 = all.filter(r => r.nextDue === dayAfter);
    for (const r of due2) {
      const msg = `🔔 <b>Payment due in 2 days</b>\n\n📋 <b>${r.name}</b>\n💰 ${lkr(r.amount)}\n📅 Due: ${fmtDate(r.nextDue)}\n🏷 ${r.category}${r.notes ? `\n📝 ${r.notes}` : ""}`;
      await sendMessage(chatId, msg);
      sent.push(`2d: ${r.name}`);
    }
  }

  // Daily summary
  if (s.dailySummary === "true") {
    const overdue = all.filter(r => r.nextDue < today);
    const dueToday = all.filter(r => r.nextDue === today);
    const upcoming = all.filter(r => r.nextDue > today && r.nextDue <= addDays(today, 7));

    const lines: string[] = [`📊 <b>FinOps Daily Summary</b> — ${fmtDate(today)}\n`];

    if (overdue.length) {
      lines.push(`🔴 <b>Overdue (${overdue.length})</b>`);
      overdue.forEach(r => lines.push(`  • ${r.name} — ${lkr(r.amount)} (was ${fmtDate(r.nextDue)})`));
      lines.push("");
    }
    if (dueToday.length) {
      lines.push(`🟡 <b>Due today (${dueToday.length})</b>`);
      dueToday.forEach(r => lines.push(`  • ${r.name} — ${lkr(r.amount)}`));
      lines.push("");
    }
    if (upcoming.length) {
      lines.push(`🟢 <b>Upcoming this week (${upcoming.length})</b>`);
      upcoming.forEach(r => lines.push(`  • ${r.name} — ${lkr(r.amount)} on ${fmtDate(r.nextDue)}`));
      lines.push("");
    }
    if (!overdue.length && !dueToday.length && !upcoming.length) {
      lines.push("✅ No payments due this week.");
    }

    await sendMessage(chatId, lines.join("\n"));
    sent.push("daily-summary");
  }

  return NextResponse.json({ ok: true, sent });
}

// Allow GET for easy browser/curl testing
export async function GET() {
  return POST();
}
