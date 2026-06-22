import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wortwerk — German Vocabulary Trainer",
  description: "Перетворює списки слів після уроку на активні вправи з німецької.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Wortwerk",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <PwaRegister />
        <div className="app-shell">
          <nav className="nav">
            <Link className="logo" href="/">Wortwerk</Link>
            <div className="nav-links" aria-label="Main navigation">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/import">Import</Link>
              <Link href="/review">Review</Link>
              <Link href="/cards">Cards</Link>
              <Link href="/mistakes">Mistakes</Link>
              <Link href="/login">Login</Link>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
