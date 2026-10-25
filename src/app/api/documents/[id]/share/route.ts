import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// POST /api/documents/[id]/share — share doc with a user
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { userId, requesterId } = await req.json();

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (requesterId && doc.ownerId !== requesterId) {
    return NextResponse.json({ error: "Only the owner can share" }, { status: 403 });
  }
  if (doc.ownerId === userId) {
    return NextResponse.json({ error: "Cannot share with yourself" }, { status: 400 });
  }

  const share = await prisma.documentShare.upsert({
    where: { documentId_userId: { documentId: id, userId } },
    update: {},
    create: { documentId: id, userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(share, { status: 201 });
}

// DELETE /api/documents/[id]/share — revoke access
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  const requesterId = req.nextUrl.searchParams.get("requesterId");

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (requesterId && doc.ownerId !== requesterId) {
    return NextResponse.json({ error: "Only the owner can revoke access" }, { status: 403 });
  }

  await prisma.documentShare.deleteMany({
    where: { documentId: id, userId },
  });

  return NextResponse.json({ success: true });
}
