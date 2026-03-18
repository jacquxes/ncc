"use client";

import React, { createContext, useContext, useState } from "react";
import { staffMembers, type StaffMember, type Role } from "../data/store";

export interface CurrentUser {
  id: string;
  name: string;
  role: Role;
}

interface UserContextValue {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  allUsers: StaffMember[];
}

const UserContext = createContext<UserContextValue | null>(null);

// Default to the Admin user so Staff view is shown first
const defaultUser: CurrentUser = {
  id: "a1",
  name: "Admin Alex Rivera",
  role: "Admin",
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(defaultUser);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, allUsers: staffMembers }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within a UserProvider");
  return ctx;
}
