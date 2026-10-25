"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Share2, Check, Users } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import ShareDialog from "@/components/ShareDialog";

const RichEditor = dynamic(() => import("@/components/RichEditor"), { ssr: false });

type DocDetail = {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  owner: { id: string; name: string };
  shares: { id: string; user: { id: string; name: string } }[];
};

function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { currentUser } = useUser();

  const userId = searchParams.get("userId") ?? currentUser?.id ?? "";

  const [doc, setDoc] = useState<DocDetail | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/documents/${id}?userId=${userId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Access denied or not found");
        return r.json();
      })
      .then((data: DocDetail) => {
        setDoc(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch((e) => setError(e.message));
  }, [id, userId]);

  const save = useCallback(
    async (newTitle: string, newContent: string) => {
      setSaving(true);
      await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, userId }),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [id, userId]
  );

  const scheduleSave = (newTitle: string, newContent: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(newTitle, newContent), 800);
  };

  const handleContentChange = (html: string) => {
    setContent(html);
    scheduleSave(title, html);
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (title.trim()) scheduleSave(title.trim(), content);
  };

  const isOwner = doc?.ownerId === userId;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-gray-500">
        <p className="text-lg">{error}</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to documents
        </Link>
      </div>
    );
  }

  if (!doc) {
    return <div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Doc header */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-200">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") handleTitleBlur();
            }}
            className="flex-1 text-base font-medium border-b border-blue-400 outline-none bg-transparent text-gray-900"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="flex-1 text-left text-base font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
          >
            {title}
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {!isOwner && (
            <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <Users className="w-3 h-3" />
              Shared by {doc.owner.name}
            </span>
          )}

          <span className="text-xs text-gray-400 min-w-[60px] text-right">
            {saving ? "Saving…" : saved ? (
              <span className="flex items-center gap-1 text-green-600">
                <Check className="w-3 h-3" /> Saved
              </span>
            ) : ""}
          </span>

          {isOwner && (
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto h-full border-x border-gray-100 shadow-sm">
          <RichEditor content={content} onChange={handleContentChange} editable={true} />
        </div>
      </div>

      {showShare && (
        <ShareDialog
          documentId={id}
          requesterId={userId}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

export default function DocumentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">Loading…</div>}>
      <DocumentEditor />
    </Suspense>
  );
}
