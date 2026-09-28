import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { FlowgateProvider } from "@/lib/flowgate-store";
import { PreferencesProvider } from "@/lib/preferences";
import "./globals.css";

const ibmSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
    <html lang="en" className={`${ibmSans.variable} ${ibmMono.variable}`}>
      <body>
        <FlowgateProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </FlowgateProvider>
      </body>
    </html>
  );
}
