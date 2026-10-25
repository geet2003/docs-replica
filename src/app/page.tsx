"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  Upload,
  MoreVertical,
  Trash2,
  Pencil,
  Share2,
  FileText,
  Users,
} from "lucide-react";
import ShareDialog from "@/components/ShareDialog";

type Doc = {
  id: string;
  title: string;
  updatedAt: string;
  owner: { id: string; name: string };
};

export default function Dashboard() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [owned, setOwned] = useState<Doc[]>([]);
  const [shared, setShared] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [shareDocId, setShareDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    if (!currentUser) return;
    setLoading(true);
    const res = await fetch(`/api/documents?userId=${currentUser.id}`);
    const data = await res.json();
    setOwned(data.owned ?? []);
    setShared(data.shared ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, [currentUser]);

  const createDoc = async () => {
    if (!currentUser) return;
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId: currentUser.id }),
    });
    const doc = await res.json();
    router.push(`/documents/${doc.id}?userId=${currentUser.id}`);
  };

  const deleteDoc = async (id: string) => {
    if (!currentUser) return;
    await fetch(`/api/documents/${id}?userId=${currentUser.id}`, { method: "DELETE" });
    setMenuOpen(null);
    fetchDocs();
  };

  const startRename = (doc: Doc) => {
    setRenaming(doc.id);
    setRenameValue(doc.title);
    setMenuOpen(null);
  };

  const submitRename = async (id: string) => {
    if (!currentUser || !renameValue.trim()) return;
    await fetch(`/api/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: renameValue.trim(), userId: currentUser.id }),
    });
    setRenaming(null);
    fetchDocs();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    const form = new FormData();
    form.append("file", file);
    form.append("ownerId", currentUser.id);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const doc = await res.json();
      router.push(`/documents/${doc.id}?userId=${currentUser.id}`);
    } else {
      const err = await res.json();
      alert(err.error ?? "Upload failed");
    }
    e.target.value = "";
  };

  const DocCard = ({ doc, isOwned }: { doc: Doc; isOwned: boolean }) => (
    <div
      className="relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
      onClick={() => router.push(`/documents/${doc.id}?userId=${currentUser?.id}`)}
    >
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <FileText className="w-8 h-8 text-blue-500 flex-shrink-0 mt-0.5" />
          <button
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(menuOpen === doc.id ? null : doc.id);
            }}
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {renaming === doc.id ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={() => submitRename(doc.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRename(doc.id);
              if (e.key === "Escape") setRenaming(null);
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-2 w-full text-sm font-medium border-b border-blue-400 outline-none bg-transparent"
          />
        ) : (
          <p className="mt-2 text-sm font-medium text-gray-800 truncate">{doc.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          {new Date(doc.updatedAt).toLocaleDateString()}
        </p>
        {!isOwned && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            <Users className="w-3 h-3" />
            Shared by {doc.owner.name}
          </span>
        )}
      </div>

      {menuOpen === doc.id && (
        <div
          className="absolute right-2 top-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => startRename(doc)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="w-3.5 h-3.5" /> Rename
          </button>
          {isOwned && (
            <button
              onClick={() => { setShareDocId(doc.id); setMenuOpen(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          )}
          {isOwned && (
            <button
              onClick={() => deleteDoc(doc.id)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8" onClick={() => setMenuOpen(null)}>
      {/* Action bar */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={createDoc}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <FilePlus className="w-4 h-4" /> New document
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
        >
          <Upload className="w-4 h-4" /> Upload file
        </button>
        <span className="text-xs text-gray-400">.txt and .md supported</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              My documents ({owned.length})
            </h2>
            {owned.length === 0 ? (
              <p className="text-sm text-gray-400">No documents yet — create one above.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {owned.map((doc) => (
                  <DocCard key={doc.id} doc={doc} isOwned={true} />
                ))}
              </div>
            )}
          </section>

          {shared.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Shared with me ({shared.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {shared.map((doc) => (
                  <DocCard key={doc.id} doc={doc} isOwned={false} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {shareDocId && (
        <ShareDialog
          documentId={shareDocId}
          requesterId={currentUser?.id ?? ""}
          onClose={() => { setShareDocId(null); fetchDocs(); }}
        />
      )}
    </div>
  );
}
