import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { themeScript } from "@/components/layout/ThemeToggle";
import { site } from "@/content/site";
import { jsonLd } from "@/lib/jsonld";
import "./globals.css";

/**
 * Self-hosted rather than fetched from Google Fonts at build time.
 *
 * Two reasons: a build should not fail because fonts.googleapis.com is
 * unreachable (it already did, twice), and visitors on slow connections skip a
 * third-party DNS lookup, handshake and round trip before any text renders.
 * Latin subset only — the site is English — which keeps all five weights to
 * about 94 KB total.
 */
const kanit = localFont({
  src: [
    { path: "./fonts/Kanit-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Kanit-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Kanit-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Kanit-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Kanit-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-kanit",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Mohamed Weli Jama",
    "software developer",
    "web developer",
    "Next.js developer",
    "school management system",
    "Somaliland developer",
    "digital transformation",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0C" },
    { media: "(prefers-color-scheme: light)", color: "#F4F5F6" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.contact.email}`,
  address: { "@type": "PostalAddress", addressCountry: site.location },
  sameAs: [site.contact.github, site.contact.linkedin],
  knowsAbout: [
    "Software development",
    "Web development",
    "Management systems",
    "Databases",
    "Digital transformation",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={kanit.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
