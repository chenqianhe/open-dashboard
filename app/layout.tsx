import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";

const notoSc = Noto_Sans_SC({
  subsets: ["latin", "cyrillic", "latin-ext", "vietnamese"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Open Dashboard",
  description: "Open Dashboard for OpenAI Batches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={`${notoSc.className} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
}
