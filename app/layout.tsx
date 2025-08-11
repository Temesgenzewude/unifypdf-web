import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "UnifyPDF — Merge, preview, and download PDFs",
    template: "%s | UnifyPDF",
  },
  description:
    "Upload multiple PDFs, reorder, merge, preview in-browser, and download. Private — no server-side storage.",
  applicationName: "UnifyPDF",
  keywords: [
    "pdf",
    "merge pdf",
    "pdf merger",
    "combine pdf",
    "pdf tools",
    "unifypdf",
    "unify pdf",
    "unify pdfs",
    "unify pdfs online",
    "unify pdfs online free",
    "unify pdfs online free no sign up",
    "unify pdfs online free no sign up no download",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
