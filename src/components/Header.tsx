"use client";

import { useUser } from "@/context/UserContext";
import { ChevronDown, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { currentUser, users, setCurrentUser } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      <Link href="/" className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
        <FileText className="w-5 h-5" />
        Docs
      </Link>

      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-sm font-medium"
        >
          {currentUser ? (
            <>
              <img
                src={currentUser.avatarUrl ?? ""}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full bg-blue-100"
              />
              <span>{currentUser.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Loading…</span>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            <p className="px-3 py-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
              Switch user
            </p>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setCurrentUser(u);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                  u.id === currentUser?.id ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                <img
                  src={u.avatarUrl ?? ""}
                  alt={u.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-left">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
