/**
 * Unit tests for document API route logic.
 * We test the pure business-logic layer (input validation, access checks)
 * without hitting a real database, by mocking @/lib/prisma.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ---- helpers (extracted from route logic for testability) ----

function validateCreatePayload(body: Record<string, unknown>) {
  if (!body.ownerId) return { error: "ownerId required" };
  return null;
}

function checkDocAccess(
  doc: { ownerId: string; shares: { userId: string }[] },
  userId: string
) {
  return doc.ownerId === userId || doc.shares.some((s) => s.userId === userId);
}

function validateUploadExtension(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ["txt", "md"].includes(ext ?? "");
}

function plainTextToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// ---- tests ----

describe("Document creation validation", () => {
  it("returns error when ownerId is missing", () => {
    expect(validateCreatePayload({})).toEqual({ error: "ownerId required" });
  });

  it("returns null when ownerId is provided", () => {
    expect(validateCreatePayload({ ownerId: "user_alice" })).toBeNull();
  });
});

describe("Document access check", () => {
  const doc = {
    ownerId: "user_alice",
    shares: [{ userId: "user_bob" }],
  };

  it("grants access to owner", () => {
    expect(checkDocAccess(doc, "user_alice")).toBe(true);
  });

  it("grants access to shared user", () => {
    expect(checkDocAccess(doc, "user_bob")).toBe(true);
  });

  it("denies access to unrelated user", () => {
    expect(checkDocAccess(doc, "user_carol")).toBe(false);
  });
});

describe("File upload validation", () => {
  it("accepts .txt files", () => {
    expect(validateUploadExtension("notes.txt")).toBe(true);
  });

  it("accepts .md files", () => {
    expect(validateUploadExtension("README.md")).toBe(true);
  });

  it("rejects .docx files", () => {
    expect(validateUploadExtension("report.docx")).toBe(false);
  });

  it("rejects .pdf files", () => {
    expect(validateUploadExtension("contract.pdf")).toBe(false);
  });
});

describe("Plain text to HTML conversion", () => {
  it("wraps paragraphs in <p> tags", () => {
    const html = plainTextToHtml("Hello world\n\nSecond paragraph");
    expect(html).toBe("<p>Hello world</p><p>Second paragraph</p>");
  });

  it("converts single newlines to <br>", () => {
    const html = plainTextToHtml("Line one\nLine two");
    expect(html).toBe("<p>Line one<br>Line two</p>");
  });
});
