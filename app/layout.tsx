import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

/* ============================================================
   Global fonts — change which family is assigned to a CSS
   variable in app/globals.css to re-theme site-wide.
   Montserrat = UI/body (var(--font-sans)).
   Playfair Display = headings (var(--font-display)).          */
const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voltatrips — Headless travel booking",
  description:
    "Voltatrips is a headless Next.js 16 front-end for the Voltatrips tourism & booking platform backed by WordPress + WPGraphQL + WooCommerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
