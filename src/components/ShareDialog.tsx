"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";

type ShareEntry = {
  id: string;
  user: { id: string; name: string; email: string };
};

export default function ShareDialog({
  documentId,
  requesterId,
  onClose,
}: {
  documentId: string;
  requesterId: string;
  onClose: () => void;
}) {
  const { users } = useUser();
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchShares = async () => {
    const res = await fetch(`/api/documents/${documentId}?userId=${requesterId}`);
    const doc = await res.json();
    setShares(doc.shares ?? []);
  };

  useEffect(() => {
    fetchShares();
  }, [documentId]);

  const shareableUsers = users.filter(
    (u) =>
      u.id !== requesterId && !shares.some((s) => s.user.id === u.id)
  );

  const addShare = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    await fetch(`/api/documents/${documentId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUserId, requesterId }),
    });
    setSelectedUserId("");
    await fetchShares();
    setLoading(false);
  };

  const removeShare = async (userId: string) => {
    await fetch(
      `/api/documents/${documentId}/share?userId=${userId}&requesterId=${requesterId}`,
      { method: "DELETE" }
    );
    fetchShares();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Share document</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Add share */}
        <div className="flex gap-2 mb-5">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a user…</option>
            {shareableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button
            onClick={addShare}
            disabled={!selectedUserId || loading}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Current shares */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
            Shared with
          </p>
          {shares.length === 0 ? (
            <p className="text-sm text-gray-400">Not shared with anyone yet.</p>
          ) : (
            <ul className="space-y-2">
              {shares.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{s.user.name}</p>
                    <p className="text-xs text-gray-400">{s.user.email}</p>
                  </div>
                  <button
                    onClick={() => removeShare(s.user.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
