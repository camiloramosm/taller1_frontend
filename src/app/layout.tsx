import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { ClientOnly } from "@/components/ClientOnly";
import Script from "next/script";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Don Ramón Café | El Mejor Café del Mundo",
  description: "Descubre la esencia del café premium con el toque de Don Ramón. Granos seleccionados, tostado artesanal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${outfit.variable} font-outfit antialiased`} suppressHydrationWarning>
        <ClientOnly>
          <Toaster position="top-center" richColors />
        </ClientOnly>
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "DonRamonCafe", "version": "1.0.0"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
