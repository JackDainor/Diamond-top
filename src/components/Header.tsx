import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white">
            DT
          </div>
          <span className="text-lg font-bold tracking-tight">
            Diamond<span className="text-gradient">Top</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-card hover:text-foreground"
          >
            Juegos
          </Link>
          <Link
            href="/#como-funciona"
            className="hidden rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-card hover:text-foreground sm:block"
          >
            Cómo funciona
          </Link>
        </nav>
      </div>
    </header>
  );
}
