import type { Metadata } from "next";
import { Anton, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/cart/cart-drawer";
import FloatingCart from "@/components/cart/floating-cart";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sare și Piper — Pizza la ieșire din oraș",
    template: "%s | Sare și Piper",
  },
  description:
    "Pizza fierbinte, făcută cu aluat de cu seară. Ne găsești la ieșire din Porumbeni, Chișinău. Vino, ești la casa noastră.",
  keywords: [
    "pizza",
    "pizzeria",
    "Sare și Piper",
    "Porumbeni",
    "Chișinău",
    "ieșire din oraș",
    "pizza fierbinte",
  ],
  authors: [{ name: "Sare și Piper" }],
  creator: "Sare și Piper",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Sare și Piper",
    title: "Sare și Piper — Pizza la ieșire din oraș",
    description:
      "Pizza fierbinte, făcută cu aluat de cu seară. Ne găsești la ieșire din Porumbeni.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Sare și Piper — Pizzeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sare și Piper — Pizza la ieșire din oraș",
    description:
      "Pizza fierbinte, făcută cu aluat de cu seară. Ne găsești la ieșire din Porumbeni.",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Sare și Piper",
  url: "https://saresipiper.com",
  telephone: "+37362000612",
  servesCuisine: ["Pizza", "Italian", "Moldavian"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calea Orheiului 21",
    addressLocality: "Porumbeni",
    addressRegion: "Chișinău",
    addressCountry: "MD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.1495627,
    longitude: 28.8327016,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  acceptsReservations: true,
  menu: "https://saresipiper.com/menu",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${anton.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingCart />
        </CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1A1A1A",
              color: "#FAF9F6",
              borderRadius: "12px",
              fontFamily: "DM Sans, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#008C45",
                secondary: "#FAF9F6",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
