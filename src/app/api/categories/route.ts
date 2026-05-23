import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cat = await prisma.category.create({
    data: {
      name: body.name,
      type: body.type,
      color: body.color,
      icon: body.icon,
    },
  });
  return NextResponse.json(cat, { status: 201 });
}
