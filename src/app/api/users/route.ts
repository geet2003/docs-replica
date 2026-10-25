import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users — list all users
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, avatarUrl: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users);
}
