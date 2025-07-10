import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FeatureFlagProvider } from "@/components/providers/feature-flag-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lease Lens - AI-Powered Lease Analysis",
  description: "Understand your lease before you sign. Get AI-powered analysis, red flag detection, and tenant resources to protect your rights.",
  keywords: ["lease analysis", "tenant rights", "AI", "legal help", "housing", "rental agreement"],
  authors: [{ name: "Lease Lens Team" }],
  creator: "Lease Lens",
  publisher: "Lease Lens",
  openGraph: {
    title: "Lease Lens - AI-Powered Lease Analysis",
    description: "Understand your lease before you sign. Get AI-powered analysis, red flag detection, and tenant resources.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lease Lens - AI-Powered Lease Analysis",
    description: "Understand your lease before you sign. Get AI-powered analysis, red flag detection, and tenant resources.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FeatureFlagProvider>
          {children}
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
