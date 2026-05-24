import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/telegram";

export async function POST() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN env var is not set" }, { status: 400 });
  }

  const row = await prisma.setting.findUnique({ where: { key: "telegramChatId" } });
  const chatId = row?.value ?? "";
  if (!chatId) {
    return NextResponse.json({ ok: false, error: "No Telegram chat ID configured in Settings" }, { status: 400 });
  }

  const ok = await sendMessage(chatId, "✅ <b>FinOps Dashboard</b>\n\nTelegram integration is working!");
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Failed to send — check bot token and chat ID" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
