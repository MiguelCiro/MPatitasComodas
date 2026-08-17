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
  title: "KickDistrict | Premium Sneakers",

  description:
    "Descubre los sneakers más exclusivos de Nike, Jordan, Adidas, New Balance y mucho más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
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