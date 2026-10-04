import type { Metadata, Viewport } from "next";
import { Inclusive_Sans, DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const inclusiveSans = Inclusive_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-inclusive-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOTAÍ SM - Resultados Eleitorais de Santa Maria/RN",
  description:
    "Acompanhe em tempo real a apuração e os resultados oficiais das Eleições 2026 em Santa Maria/RN diretamente dos dados oficiais do Tribunal Superior Eleitoral (TSE).",
  applicationName: "VOTAÍ SM",
  authors: [{ name: "Fábio Gutemberg - Calangos Marketing" }],
  keywords: [
    "VOTAÍ SM",
    "Eleições 2026",
    "Santa Maria RN",
    "Resultados Eleições Santa Maria",
    "Apuração TSE",
    "Tribunal Superior Eleitoral",
  ],
  openGraph: {
    title: "VOTAÍ SM - Resultados Eleitorais de Santa Maria/RN",
    description:
      "Acompanhamento em tempo real dos resultados oficiais das Eleições 2026 em Santa Maria/RN (Fonte: TSE).",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#386641",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inclusiveSans.variable} ${dmSerifDisplay.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-surface-light text-stone-900 selection:bg-brand-light/30">
        {children}
      </body>
    </html>
  );
}

