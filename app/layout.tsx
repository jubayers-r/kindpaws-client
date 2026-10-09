import type { Metadata } from "next";
import { Laila, Paytone_One, Cherry_Bomb_One, Outfit, Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/context/auth/AuthProvider";
import { Toaster } from "sonner";

const laila = Laila({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-laila",
  display: "swap",
});

const paytoneOne = Paytone_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-paytone",
  display: "swap",
});

const cherryBomb = Cherry_Bomb_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cherry",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KindPaws - Adopt, Rescue & Support Pets in Need",
  description:
    "KindPaws connects loving humans with pets waiting for a home and empowers communities to fund urgent animal rescue campaigns.",
  icons: {
    icon: "/assets/Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${laila.variable} ${paytoneOne.variable} ${cherryBomb.variable} ${outfit.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-laila)] bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
