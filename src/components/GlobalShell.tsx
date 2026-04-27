"use client";

import Layout from "@/components/Layout";

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

