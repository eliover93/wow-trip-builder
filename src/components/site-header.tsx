import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex w-[min(1120px,92vw)] items-center justify-between rounded-full glass-panel px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="size-5 text-primary" />
          <span className="font-display text-lg tracking-tight">Voyara</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/demo"
            className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            Demo cliente
          </Link>
          <Link
            to="/backoffice"
            className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            Backoffice
          </Link>
          <Link
            to="/"
            hash="contacto"
            className="ml-2 rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Pedir precio
          </Link>
        </nav>
      </div>
    </header>
  );
}
