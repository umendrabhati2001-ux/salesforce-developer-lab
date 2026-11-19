/// <reference types="next" />
import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://salesforce-developer-lab.vercel.app"),
  title: "Salesforce Developer Lab & Architecture Portal | Umendra Bhati",
  description:
    "Engineering-grade Salesforce DX interactive architecture portal, Governor Limit visualizers, Bulkification simulators, and Job-Ready interview flashcards by Umendra Bhati.",
  keywords: [
    "Salesforce Developer",
    "Apex Programming",
    "SOQL Studio",
    "Salesforce Architecture",
    "Governor Limits",
    "Umendra Bhati",
    "Lightning Web Components",
    "LWC",
    "Salesforce DX",
    "Bulkification Pattern",
  ],
  authors: [{ name: "Umendra Bhati", url: "https://www.linkedin.com/in/umendra-bhati-5243aa36a/" }],
  creator: "Umendra Bhati",
  publisher: "Umendra Bhati",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    creator: "@umendrabhati",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://salesforce-developer-lab.vercel.app/#person",
      name: "Umendra Bhati",
      jobTitle: "Salesforce Admin & Developer",
      sameAs: [
        "https://www.linkedin.com/in/umendra-bhati-5243aa36a/",
        "https://github.com/umendrabhati2001-ux",
      ],
      url: "https://salesforce-developer-lab.vercel.app",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://salesforce-developer-lab.vercel.app/#app",
      name: "Salesforce Developer Lab & Live SOQL Studio",
      operatingSystem: "Web",
      applicationCategory: "DeveloperApplication",
      author: {
        "@id": "https://salesforce-developer-lab.vercel.app/#person",
      },
      description:
        "Production-grade Salesforce DX architecture suite, interactive Apex runtime simulators, Governor Limits monitors, and 6-tier SOQL Query Studio.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#030712] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-300">
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
