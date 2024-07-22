import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merchant Wallet",
  description: "Merchant's Wallet App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
