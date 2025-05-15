"use client";

import React from "react";
import { AuthProvider } from "./auth/auth-context";
import { ToastProvider } from "./ui/toast-context";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
