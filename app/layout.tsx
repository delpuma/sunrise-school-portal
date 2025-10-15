import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CookieConsent from "@/components/layout/CookieConsent";

export const metadata: Metadata = {
  title: "Sunrise School of Miami",
  description: "A secure, modern school website and parent portal",
};

import SkipToContent from "@/components/accessibility/SkipToContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SkipToContent />
        <AuthProvider>
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
