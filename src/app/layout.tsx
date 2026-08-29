import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";

import CartProvider from "@/context/CartProvider";
import FavoritesProvider from "@/context/FavoritesProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MPatitas Cómodas | Medias con estilo",

  description:
    "Descubre medias y calcetines cómodos, originales y llenos de estilo para cada paso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen">
        <CartProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}