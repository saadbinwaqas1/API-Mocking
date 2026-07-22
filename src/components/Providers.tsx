"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster position="top-right" theme="dark" richColors />
      {children}
    </SessionProvider>
  );
}
