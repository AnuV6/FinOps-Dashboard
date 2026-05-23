import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.transaction.deleteMany();
  await prisma.recurringPayment.deleteMany();
  return NextResponse.json({ ok: true });
}
