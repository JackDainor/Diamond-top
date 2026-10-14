export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 safe-bottom">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">
              DT
            </div>
            <span className="font-semibold">DiamondTop</span>
          </div>
          <p className="max-w-sm text-sm text-muted">
            Recargas de diamantes y créditos de juegos con entrega automática.
            Rápido, seguro y confiable.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted">
            <span>Entrega 24/7</span>
            <span>•</span>
            <span>Soporte por chat</span>
            <span>•</span>
            <span>Pago seguro</span>
          </div>
          <p className="text-xs text-muted/70">
            © {new Date().getFullYear()} DiamondTop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
