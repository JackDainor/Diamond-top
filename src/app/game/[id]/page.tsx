import { notFound } from "next/navigation";
import { getGameById, GAMES } from "@/lib/games";
import { OrderForm } from "@/components/OrderForm";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const game = getGameById(id);
  if (!game) return { title: "Juego no encontrado" };
  return {
    title: `Recargar ${game.name} — DiamondTop`,
    description: game.description,
  };
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Back */}
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver a juegos
      </Link>

      {/* Game header */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${game.gradient} text-3xl shadow-lg`}
        >
          {game.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{game.name}</h1>
          <p className="text-sm text-muted">{game.description}</p>
        </div>
      </div>

      {/* Order form (client component) */}
      <OrderForm game={game} />
    </div>
  );
}
