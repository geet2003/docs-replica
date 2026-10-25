"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type UserContextType = {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
};

const UserContext = createContext<UserContextType>({
  currentUser: null,
  users: [],
  setCurrentUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data: User[]) => {
        setUsers(data);
        // Restore from localStorage or default to first user
        const savedId = localStorage.getItem("currentUserId");
        const found = savedId ? data.find((u) => u.id === savedId) : null;
        setCurrentUserState(found ?? data[0] ?? null);
      })
      .catch(console.error);
  }, []);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    localStorage.setItem("currentUserId", user.id);
  };

  return (
    <UserContext.Provider value={{ currentUser, users, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
