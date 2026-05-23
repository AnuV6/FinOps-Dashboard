import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const row = await prisma.setting.findUnique({ where: { key: "password" } });
  const stored = row?.value ?? "demo";
  if (password === stored) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
}
