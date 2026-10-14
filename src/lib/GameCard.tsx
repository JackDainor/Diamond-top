import Link from "next/link";
import type { Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/game/${game.id}`}
      className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-4"
    >
      {/* Background gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-2xl shadow-lg`}
        >
          {game.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {game.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted">
            {game.description}
          </p>
          <p className="mt-1 text-xs font-medium text-primary">
            Desde {game.packages[0]
              ? `$${game.packages[0].price.toFixed(2)}`
              : "—"}
          </p>
        </div>

        <div className="text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
