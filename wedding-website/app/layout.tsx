// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/content/config";
import "./globals.css";

// Serif elegante para títulos
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Sans legible para el cuerpo
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.novios.novia} ${siteConfig.novios.ampersand} ${siteConfig.novios.novio}`,
  description: `Nos casamos el ${siteConfig.fecha.textoLargo} en ${siteConfig.fecha.ciudad}. ¡Confirmá tu asistencia!`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-crema font-sans text-tinta antialiased">
        {children}
      </body>
    </html>
  );
}
