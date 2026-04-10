"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const publicNavItems = [{ href: "/", label: "Início" }, { href: "/buscar", label: "Buscar Pokémon" }];
const privateNavItems = [...publicNavItems, { href: "/equipes", label: "Minhas equipes" }];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(5,11,20,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-white">
              PokeTeam Builder
            </Link>
            <p className="text-sm text-[var(--muted)]">Monte, teste e refine o seu elenco Pokémon.</p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--muted)]">
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? "border border-transparent bg-[var(--brand-strong)] font-extrabold text-[#ffffff] [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]"
                      : "border border-transparent bg-[rgba(255,255,255,0.04)] text-[var(--soft-text)] hover:border-[var(--line)] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="hidden rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-white sm:block">
                  {user.name}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--soft-text)] hover:border-[var(--brand)] hover:text-white"
                >
                  Sair
                </button>
              </>
            ) : (
              !isLoading && (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--soft-text)] hover:border-[var(--brand)] hover:text-white"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-strong)]"
                  >
                    Criar conta
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">{children}</div>
    </div>
  );
}
