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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
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

  return (
    // O BrowserRouter agora abraça TODA a aplicação
    <BrowserRouter>
      {!session ? (
        // Se não tem sessão, renderiza o Login com acesso às rotas
        <Routes>
          <Route path="*" element={<LoginScreen />} />
        </Routes>
      ) : (
        // Se tem sessão, renderiza o Layout e o sistema
        <Layout>
          <Routes>
            {/* Note que o Dashboard está na rota raiz "/" */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/cartoes" element={<CartoesScreen />} />
            <Route path="/compras" element={<ComprasScreen />} />
            <Route path="/contas" element={<ContasScreen />} />
            <Route path="/estoque" element={<EstoqueScreen />} />
            <Route path="/investimentos" element={<InvestimentosScreen />} />
            <Route path="/pessoas" element={<PessoasScreen />} />
            <Route path="/planos" element={<PlanosScreen />} />
            <Route path="/transacoes" element={<TransacoesScreen />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}