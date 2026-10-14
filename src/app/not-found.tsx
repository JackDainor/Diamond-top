import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted">Página no encontrada</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
