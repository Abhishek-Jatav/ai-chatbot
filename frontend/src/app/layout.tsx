import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI FAQ Assistant",
  description: "Premium AI Assistant powered by Google Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}

        <Toaster
          richColors
          position="top-right"
          closeButton
          expand
          duration={2500}
          theme="dark"
        />
      </body>
    </html>
  );
}
