import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../Providers";
import { AppbarClient } from "../components/AppbarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple Wallet App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="flex flex-col h-screen min-w-screen bg-[#ebe6e6] overflow-auto">
            <div className="sticky top-0 z-50"><AppbarClient /></div>
            <div className="flex flex-grow overflow-auto">{children}</div>
          </div>
        </body>
      </Providers>
    </html>
  );
}
