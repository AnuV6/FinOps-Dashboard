import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tx = await prisma.transaction.create({
    data: {
      date: body.date,
      type: body.type,
      category: body.category,
      amount: Number(body.amount),
      note: body.note ?? "",
    },
  });
  return NextResponse.json(tx, { status: 201 });
}
