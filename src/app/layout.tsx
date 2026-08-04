import type { Metadata } from "next";
import "./globals.css";
import { Sora, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Chasr — Public Revenue Goals for Founders",
    template: "%s | Chasr",
  },
  description:
    "Publicly commit to a revenue goal, track your progress in the open, and share it with the world. Free accountability tool for solo founders.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app"
  ),
  openGraph: {
    type: "website",
    siteName: "Chasr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${hanken.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
