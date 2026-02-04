import { JSX, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setLocation("/login"); // redireciona se não estiver logado
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        if (!session) setLocation("/login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [setLocation]);

  if (loading) return <div>Carregando...</div>;

  return children;
}
