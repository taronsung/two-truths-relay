import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Two Truths Relay - The viral social bluff game",
  description: "Spot the lie, add yours, and watch the relay tree grow through your friends! A fun, cozy social game for 2-8 players.",
  keywords: ["social game", "party game", "two truths one lie", "viral game", "friend game"],
  authors: [{ name: "Two Truths Relay" }],
  openGraph: {
    title: "Two Truths Relay",
    description: "Spot the lie, add yours, and watch the relay tree grow!",
    type: "website",
    locale: "en_US",
    siteName: "Two Truths Relay",
  },
  twitter: {
    card: "summary_large_image",
    title: "Two Truths Relay",
    description: "Spot the lie, add yours, and watch the relay tree grow!",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFF8F3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
