import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { FollowProvider } from "@/context/FollowContext";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { NotificationTriggers } from "@/components/NotificationTriggers";
import { ChallengeProgressSync } from "@/components/ChallengeProgressSync";
import { Navbar } from "@/components/Navbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { GuidesStrip } from "@/components/GuidesStrip";
import { FloatingGuides } from "@/components/FloatingGuides";
import { FloatingMascot } from "@/components/FloatingMascot";

export const metadata: Metadata = {
  title: {
    default: "ANEKTIA — El Nexo del Conocimiento",
    template: "%s | ANEKTIA"
  },
  description: "Plataforma de aprendizaje autodidacta profundo y gamificado. Ciencias, Filosofía, Literatura e Idiomas explicados con exégesis multinivel.",
  keywords: ["física", "filosofía", "aprendizaje", "autodidacta", "ciencia", "japones", "guias maestras"],
  authors: [{ name: "Anektia" }],
  openGraph: {
    title: "ANEKTIA — El Nexo del Conocimiento",
    description: "Plataforma de aprendizaje autodidacta profundo y gamificado.",
    siteName: "Anektia",
    locale: "es_ES",
    type: "website",
  },
  verification: {
    google: "QZ5ukizYmrCHZ7btqM5F9y-Z6ZgMSJmibW4LUdYEDcU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider defaultTheme="dark" storageKey="aeterna-theme">
          <AuthProvider>
            <GamificationProvider>
              <NotificationProvider>
                <FollowProvider>
                  <ChallengeProvider>
                    <NotificationTriggers />
                    <ChallengeProgressSync />
                    <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <GuidesStrip />
                  <main className="flex-1">
                    {children}
                  </main>
                  <GlobalFooter />
                  <FloatingMascot />
                  <FloatingGuides />
                </div>
                  </ChallengeProvider>
                </FollowProvider>
              </NotificationProvider>
            </GamificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
