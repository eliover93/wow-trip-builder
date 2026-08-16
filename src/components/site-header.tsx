import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Compass, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setEmail(sesion?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const salir = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

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
          {email ? (
            <>
              <Link
                to="/backoffice"
                className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                Backoffice
              </Link>
              <span className="hidden max-w-[180px] truncate px-2 text-xs text-muted-foreground sm:inline">
                {email}
              </span>
              <button
                onClick={salir}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="size-4" /> Salir
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              Acceso agencias
            </Link>
          )}
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
