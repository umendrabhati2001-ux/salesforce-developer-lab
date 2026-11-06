/// <reference types="next" />
import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Salesforce Developer Lab & Architecture Portal | Umendra Bhati",
  description:
    "Engineering-grade Salesforce DX interactive architecture portal, Governor Limit visualizers, Bulkification simulators, and Job-Ready interview flashcards by Umendra Bhati.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-300">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
