import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/upload — upload .txt or .md file, return new document
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const ownerId = formData.get("ownerId") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ownerId) return NextResponse.json({ error: "ownerId required" }, { status: 400 });

  const name = file.name;
  const ext = name.split(".").pop()?.toLowerCase();

  if (!["txt", "md"].includes(ext ?? "")) {
    return NextResponse.json(
      { error: "Only .txt and .md files are supported" },
      { status: 415 }
    );
  }

  const text = await file.text();

  // Convert plain text to simple HTML paragraphs
  const html = text
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");

  const title = name.replace(/\.(txt|md)$/i, "");

  const doc = await prisma.document.create({
    data: { title, content: html, ownerId },
    include: { owner: { select: { id: true, name: true } } },
  });

  return NextResponse.json(doc, { status: 201 });
}
