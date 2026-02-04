import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation  } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import LoginPage from "./pages/login";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Verifica sessão ao carregar
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsLogged(true);
      } else {
        setLocation("/login");
      }
      setLoading(false);
    });

    // Escuta mudanças de login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLogged(!!session);
        if (!session) setLocation("/login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [setLocation]);

  if (loading) return <div>Carregando...</div>;
  if (!isLogged) return null; // já vai redirecionar para /login

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route
              path="/"
              component={() => (
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              )}
            />
            <Route path="/404" component={NotFound} />
            {/* fallback */}
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
export default App