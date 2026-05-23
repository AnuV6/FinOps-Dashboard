import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.recurringPayment.findMany({ orderBy: { nextDue: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rec = await prisma.recurringPayment.create({
    data: {
      name: body.name,
      amount: Number(body.amount),
      category: body.category,
      schedule: body.schedule,
      dayOfMonth: body.dayOfMonth ?? null,
      intervalDays: body.intervalDays ?? null,
      nextDue: body.nextDue,
      status: body.status ?? "upcoming",
      notes: body.notes ?? "",
    },
  });
  return NextResponse.json(rec, { status: 201 });
}
