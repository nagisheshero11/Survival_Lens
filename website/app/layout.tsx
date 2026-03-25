import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Survival Lens - The Financial Safety Net for Gig Workers",
  description: "Survival Lens uses decentralized intelligence to protect your income against market volatility and platform shifts. Stability designed for the modern independent professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`} style={{ scrollBehavior: 'smooth' }}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
