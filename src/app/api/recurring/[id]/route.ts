import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rec = await prisma.recurringPayment.update({
    where: { id },
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
  return NextResponse.json(rec);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.recurringPayment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
