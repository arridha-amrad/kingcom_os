"use client";

import { useAuthStore, User } from "@/stores/authStore";
import { ReactNode, useEffect } from "react";

export default function SessionProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const setAuthUser = useAuthStore((store) => store.setUser);
  useEffect(() => {
    setAuthUser(user);
  }, []);
  return children;
}
