import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FlowgateProvider } from "@/lib/flowgate-store";
import { PreferencesProvider } from "@/lib/preferences";
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
  title: "FlowGate | Ops & SLA Service Requests",
  description:
    "Systems Analyst portfolio demo: service request intake, triage, multi-step approval, and SLA visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <FlowgateProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </FlowgateProvider>
      </body>
    </html>
  );
}
