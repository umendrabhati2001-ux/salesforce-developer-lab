/// <reference types="next" />
import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://salesforce-developer-lab.vercel.app"),
  title: "Salesforce Developer Lab & Architecture Portal | Umendra Bhati",
  description:
    "Engineering-grade Salesforce DX interactive architecture portal, Governor Limit visualizers, Bulkification simulators, and Job-Ready interview flashcards by Umendra Bhati.",
  openGraph: {
    title: "Salesforce Developer Lab & Architecture Portal | Umendra Bhati",
    description:
      "Engineering-grade Salesforce DX interactive architecture portal, Governor Limit visualizers, Bulkification simulators, and Job-Ready interview flashcards by Umendra Bhati.",
    url: "https://salesforce-developer-lab.vercel.app",
    siteName: "Salesforce Developer Lab",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Salesforce Developer Lab & Live SOQL Studio - Umendra Bhati",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salesforce Developer Lab & Architecture Portal | Umendra Bhati",
    description: "Engineering-grade Salesforce DX interactive architecture portal & Live SOQL Studio by Umendra Bhati.",
    images: ["/og-image.png"],
  },
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
