import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPO GMP Dashboard",
  description:
    "A modern, responsive dashboard for IPO Grey Market Premium (GMP) and performance data, with dark mode and static export for GitHub Pages.",
  metadataBase: new URL("https://ainstarc.github.io/ipo-gmp/"),
  openGraph: {
    title: "IPO GMP Dashboard",
    description:
      "Track IPO Grey Market Premium (GMP) and performance with a modern, responsive dashboard. Data sourced from investorgain.com.",
    url: "https://ainstarc.github.io/ipo-gmp/",
    siteName: "IPO GMP Dashboard",
    images: [
      {
        url: "/reports/gmp-og.png", // Place an OG image in public/reports if desired
        width: 1200,
        height: 630,
        alt: "IPO GMP Dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO GMP Dashboard",
    description:
      "Track IPO Grey Market Premium (GMP) and performance with a modern, responsive dashboard.",
    images: ["/reports/gmp-og.png"],
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
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
