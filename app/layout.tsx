import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/components/modal-provider";
import AuthContext from "@/components/auth-context";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "converse.ai",
  description: "Talk to your documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  );
}
