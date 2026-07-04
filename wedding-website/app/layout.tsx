import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Casamiento — NOMBRE_1 & NOMBRE_2", // TODO
  description: "Confirmá tu asistencia y mirá los detalles de la fiesta.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
