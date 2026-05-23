import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const tx = await prisma.transaction.update({
    where: { id },
    data: {
      date: body.date,
      type: body.type,
      category: body.category,
      amount: Number(body.amount),
      note: body.note ?? "",
    },
  });
  return NextResponse.json(tx);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
