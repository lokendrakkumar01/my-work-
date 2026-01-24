import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Control Hub - AI-Powered Creator Management",
  description: "Enterprise-grade creator management platform for YouTube, social media, productivity, and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
