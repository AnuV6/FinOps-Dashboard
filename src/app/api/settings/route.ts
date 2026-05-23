import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return NextResponse.json({
    telegramChatId: settings.telegramChatId ?? "",
    remindersOn: settings.remindersOn === "true",
    remind1d: settings.remind1d === "true",
    remind2d: settings.remind2d === "true",
    dailySummary: settings.dailySummary === "true",
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const pairs: Record<string, string> = {
    telegramChatId: String(body.telegramChatId ?? ""),
    remindersOn: String(body.remindersOn ?? false),
    remind1d: String(body.remind1d ?? false),
    remind2d: String(body.remind2d ?? false),
    dailySummary: String(body.dailySummary ?? false),
  };
  if (body.password !== undefined) {
    pairs.password = String(body.password);
  }
  for (const [key, value] of Object.entries(pairs)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  return NextResponse.json({ ok: true });
}
