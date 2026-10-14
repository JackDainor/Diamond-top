import { GAMES } from "@/lib/games";
import { GameCard } from "@/components/GameCard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <section className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Entrega automática 24/7
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Recarga diamantes
          <br />
          <span className="text-gradient">en segundos</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Free Fire, PUBG Mobile, Mobile Legends, Genshin Impact y más.
          Elige tu juego y recibe tu recarga al instante.
        </p>
      </section>

      {/* Games grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Elige tu juego</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="mt-14">
        <h2 className="mb-6 text-center text-lg font-semibold">
          Cómo funciona
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Elige el juego",
              desc: "Selecciona el juego y el paquete de diamantes que necesitas.",
            },
            {
              step: "2",
              title: "Ingresa tu ID",
              desc: "Escribe tu Player ID (y servidor si aplica). Validamos que exista.",
            },
            {
              step: "3",
              title: "Paga y recibe",
              desc: "Realiza el pago y los diamantes llegan automáticamente a tu cuenta.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border bg-card p-5 text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {item.step}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="mt-12 mb-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="text-success">✓</span> Entrega automática
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">✓</span> Soporte 24/7
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">✓</span> Pago seguro
        </div>
      </section>
    </div>
  );
}
