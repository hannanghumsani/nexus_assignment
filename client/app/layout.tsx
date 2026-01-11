import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Switch to Inter for better performance
import "./globals.css";

// 1. Optimize Font Loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Critical: prevents layout shift and invisible text
  variable: "--font-inter",
  preload: true,
});

// 2. SEO & Performance Metadata
export const metadata: Metadata = {
  title: "Event Dashboard | Admin",
  description: "Secure Attendee Management Dashboard",
};

// 3. Prevent layout jumping on mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        {/* Using a main tag helps SEO and structural accessibility scores */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}