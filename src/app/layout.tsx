import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AmbientBackground } from "@/components/ambient-background";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebNexus - Categorized Website & Tools Directory",
  description:
    "Discover the best curated websites, developer tools, AI applications, design inspirations, and productivity suites organized by category. Built with Next.js, PostgreSQL, and Prisma.",
  keywords: [
    "website directory",
    "developer tools",
    "AI tools",
    "design inspiration",
    "PostgreSQL",
    "Prisma",
    "shadcn/ui",
    "Next.js",
  ],
  authors: [{ name: "WebNexus Team" }],
  openGraph: {
    title: "WebNexus - Curated Website Directory",
    description:
      "Explore 40+ hand-picked websites and developer resources categorized for builders.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} ${fontMono.variable} antialiased selection:bg-indigo-500/20 selection:text-indigo-400`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AmbientBackground />
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
