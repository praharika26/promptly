import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promptly | Algorand AI Agent Marketplace",
  description: "The first decentralized marketplace for AI agents on Algorand. Hire, earn, and build with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} antialiased bg-black font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
