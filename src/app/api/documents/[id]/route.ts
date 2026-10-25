import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/documents/[id]?userId=xxx
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  });

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Access check: must be owner or have a share
  if (userId) {
    const hasAccess =
      doc.ownerId === userId || doc.shares.some((s: { userId: string }) => s.userId === userId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(doc);
}

// PUT /api/documents/[id] — update title or content
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { title, content, userId } = body;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only owner or shared user can edit
  if (userId) {
    const share = await prisma.documentShare.findUnique({
      where: { documentId_userId: { documentId: id, userId } },
    });
    if (doc.ownerId !== userId && !share) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const updated = await prisma.document.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
    include: { owner: { select: { id: true, name: true } } },
  });

  return NextResponse.json(updated);
}

// DELETE /api/documents/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (userId && doc.ownerId !== userId) {
    return NextResponse.json({ error: "Only the owner can delete" }, { status: 403 });
  }

  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
