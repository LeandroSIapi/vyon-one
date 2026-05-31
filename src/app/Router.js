import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import LoginScreen from "../screens/Login/login";
import Dashboard from "../screens/Dashboard/Dashboard";

export default function Router() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (!session) {
    return <LoginScreen />;
  }

  return <Dashboard />;
}