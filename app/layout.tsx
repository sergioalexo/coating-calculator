import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coating Calculator",
  description:
    "Stain, oil and powder coating quantities from total surface area, with one-click copy and paste. Developed by Sergio Alexo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.10),transparent)] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
