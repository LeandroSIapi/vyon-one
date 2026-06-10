import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "../screens/Login/login";
import Layout from "../components/Layout/Layout";
import Dashboard from "../screens/Dashboard/Dashboard";
import CartoesScreen from "../screens/Cartoes/CartoesScreen";
import ComprasScreen from "../screens/Compras/ComprasScreen";
import ContasScreen from "../screens/Contas/ContasScreen";
import EstoqueScreen from "../screens/Estoque/EstoqueScreen";
import InvestimentosScreen from "../screens/Investimentos/InvestimentosScreen";
import PessoasScreen from "../screens/Pessoas/PessoasScreen";
import PlanosScreen from "../screens/Planos/PlanosScreen";
import TransacoesScreen from "../screens/Transacoes/TransacoesScreen";


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

  return (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cartoes" element={<CartoesScreen />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
}