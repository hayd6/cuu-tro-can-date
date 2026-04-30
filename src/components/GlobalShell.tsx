"use client";

import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Layout>
      <div className="flex flex-col min-h-full">
        <div className="flex-1">
          {children}
        </div>
        {pathname !== "/" && <Footer />}
      </div>
    </Layout>
  );
}

