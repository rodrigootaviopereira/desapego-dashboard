import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desapego Squad",
  description: "Dashboard de inventário para venda e doação",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
