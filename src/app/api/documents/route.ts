import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/documents?userId=xxx — list owned + shared docs for a user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const [owned, shared] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      include: { owner: { select: { id: true, name: true } } },
    }),
    prisma.documentShare.findMany({
      where: { userId },
      include: {
        document: {
          include: { owner: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    owned,
    shared: shared.map((s: { document: typeof owned[number] }) => s.document),
  });
}

// POST /api/documents — create a new document
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, ownerId } = body;

  if (!ownerId) return NextResponse.json({ error: "ownerId required" }, { status: 400 });

  const doc = await prisma.document.create({
    data: {
      title: title || "Untitled Document",
      content: content || "",
      ownerId,
    },
    include: { owner: { select: { id: true, name: true } } },
  });

  return NextResponse.json(doc, { status: 201 });
}
