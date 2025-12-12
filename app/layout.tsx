import type { Metadata } from "next";
import { Crimson_Text, Instrument_Sans } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COE Management Dashboard",
  description: "Controller of Examination Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${crimsonText.variable} ${instrumentSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
