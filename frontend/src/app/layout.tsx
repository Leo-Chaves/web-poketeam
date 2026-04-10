import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "PokeTeam Builder",
  description:
    "Aplicação full stack para buscar Pokémon, montar equipes personalizadas e salvar tudo em um back-end com autenticação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
