"use client";

import { useState } from "react";
import type { Game, Package } from "@/lib/games";
import { formatPrice } from "@/lib/games";

type Props = {
  game: Game;
};

type Step = "packages" | "player" | "confirm" | "success";

export function OrderForm({ game }: Props) {
  const [step, setStep] = useState<Step>("packages");
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [server, setServer] = useState(game.servers?.[0] || "");
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectPackage(pkg: Package) {
    setSelectedPkg(pkg);
    setStep("player");
    setError(null);
  }

  async function handleValidatePlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!playerId.trim()) {
      setError("Ingresa tu Player ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: playerId.trim(),
          server: server || undefined,
          sub_category_id: selectedPkg?.s2tItemId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.error?.message || data.error || "Player ID no encontrado"
        );
      }

      setPlayerName(data.player?.player_name || `Jugador_${playerId.slice(-4)}`);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al validar");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmOrder() {
    if (!selectedPkg) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: game.id,
          game_name: game.name,
          package_id: selectedPkg.id,
          package_name: selectedPkg.name,
          player_id: playerId.trim(),
          player_name: playerName,
          server: server || undefined,
          sell_price: selectedPkg.price.toFixed(2),
          sub_category_id: selectedPkg.s2tItemId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.error?.message || data.error || "No se pudo crear el pedido"
        );
      }

      setOrderId(data.order?.order_id || null);
      if (data.order?.player_name) {
        setPlayerName(data.order.player_name);
      }
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success" && selectedPkg) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-3xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-success">¡Pedido recibido!</h2>
        <p className="mt-2 text-sm text-muted">
          {selectedPkg.name} se está procesando para
          <br />
          <span className="font-medium text-foreground">
            {playerName || playerId}
          </span>
        </p>
        <div className="mt-5 rounded-xl border border-border bg-background p-4 text-left text-sm">
          {orderId && (
            <div className="mb-2 flex justify-between gap-2">
              <span className="text-muted shrink-0">Orden</span>
              <span className="truncate font-mono text-xs">{orderId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Paquete</span>
            <span>{selectedPkg.name}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted">Player ID</span>
            <span className="font-mono">{playerId}</span>
          </div>
          {server && (
            <div className="mt-2 flex justify-between">
              <span className="text-muted">Servidor</span>
              <span>{server}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between font-semibold">
            <span className="text-muted">Total</span>
            <span>{formatPrice(selectedPkg.price)}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          El pedido se guardó en la base de datos. Cuando Shop2TopUp confirme
          la entrega, el estado pasará a completed (vía webhook).
        </p>
        <button
          onClick={() => {
            setStep("packages");
            setSelectedPkg(null);
            setPlayerId("");
            setPlayerName(null);
            setOrderId(null);
            setError(null);
          }}
          className="mt-5 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover"
        >
          Hacer otra recarga
        </button>
      </div>
    );
  }

  if (step === "confirm" && selectedPkg) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Confirmar pedido</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Juego</span>
              <span className="font-medium">{game.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Paquete</span>
              <span className="font-medium">{selectedPkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Jugador</span>
              <span className="font-medium">{playerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Player ID</span>
              <span className="font-mono text-sm">{playerId}</span>
            </div>
            {server && (
              <div className="flex justify-between">
                <span className="text-muted">Servidor</span>
                <span>{server}</span>
              </div>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-base font-bold">
                <span>Total a pagar</span>
                <span className="text-primary">
                  {formatPrice(selectedPkg.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center text-sm text-muted">
          <p className="font-medium text-foreground">Modo prueba</p>
          <p className="mt-1">
            Al confirmar se crea el pedido en Shop2TopUp (si hay saldo y API key)
            y se guarda en Neon. Más adelante agregamos el cobro al cliente.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("player")}
            disabled={loading}
            className="flex-1 rounded-xl border border-border py-3 font-medium transition hover:bg-card"
          >
            Atrás
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="flex-[2] rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? "Procesando…" : "Confirmar y recargar"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "player" && selectedPkg) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium">{selectedPkg.name}</p>
            <p className="text-xs text-muted">{game.name}</p>
          </div>
          <p className="font-bold text-primary">
            {formatPrice(selectedPkg.price)}
          </p>
        </div>

        <form onSubmit={handleValidatePlayer} className="space-y-4">
          <div>
            <label
              htmlFor="playerId"
              className="mb-1.5 block text-sm font-medium"
            >
              Player ID / UID
            </label>
            <input
              id="playerId"
              type="text"
              inputMode="numeric"
              placeholder="Ej: 1234567890"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              autoComplete="off"
              autoFocus
            />
            <p className="mt-1.5 text-xs text-muted">
              Encuéntralo en el perfil del juego (número de ID).
            </p>
          </div>

          {game.requiresServer && game.servers && (
            <div>
              <label
                htmlFor="server"
                className="mb-1.5 block text-sm font-medium"
              >
                Servidor / Región
              </label>
              <select
                id="server"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {game.servers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("packages");
                setError(null);
              }}
              className="flex-1 rounded-xl border border-border py-3 font-medium transition hover:bg-card"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={loading || !playerId.trim()}
              className="flex-[2] rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "Validando…" : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-muted">
        Selecciona un paquete
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {game.packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => handleSelectPackage(pkg)}
            className="card-lift relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/50"
          >
            {pkg.popular && (
              <span className="absolute right-2 top-2 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Popular
              </span>
            )}
            <p className="text-lg font-bold">{pkg.diamonds}</p>
            <p className="text-xs text-muted">
              {pkg.bonus ? `+ bonus ${pkg.bonus}` : pkg.name}
            </p>
            <p className="mt-2 text-base font-semibold text-primary">
              {formatPrice(pkg.price)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
