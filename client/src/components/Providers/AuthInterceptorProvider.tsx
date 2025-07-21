// components/AuthInterceptorProvider.tsx
"use client";

import { setupAuthInterceptor } from "@/lib/api/authInterceptor";
import { useEffect } from "react";

export default function AuthInterceptorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  return <>{children}</>;
}
