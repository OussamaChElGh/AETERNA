import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { Navbar } from "@/components/Navbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { GuidesStrip } from "@/components/GuidesStrip";
import { FloatingGuides } from "@/components/FloatingGuides";
import { FloatingMascot } from "@/components/FloatingMascot";

export const metadata: Metadata = {
  title: {
    default: "AETERNA — El Nexo del Conocimiento",
    template: "%s | AETERNA"
  },
  description: "Plataforma de aprendizaje autodidacta profundo y gamificado. Ciencias, Filosofía, Literatura e Idiomas explicados con exégesis multinivel.",
  keywords: ["física", "filosofía", "aprendizaje", "autodidacta", "ciencia", "japones", "guias maestras"],
  authors: [{ name: "Aeterna" }],
  openGraph: {
    title: "AETERNA — El Nexo del Conocimiento",
    description: "Plataforma de aprendizaje autodidacta profundo y gamificado.",
    siteName: "Aeterna",
    locale: "es_ES",
    type: "website",
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
            </GamificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
