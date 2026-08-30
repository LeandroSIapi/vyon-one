import { useEffect, useState } from "react";
import "./Dashboard.css";
import { supabase } from "../../services/supabaseClient";

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Pega o usuário logado atualmente para exibir um boas-vindas personalizado
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.email.split("@")[0]); // Pega o nome antes do @
      }
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Olá, {userName || "Usuário"}!</h1>
          <p>Aqui está o resumo financeiro da sua residência hoje.</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* Grid de Cards Principais do MVP e Versões */}
      <div className="dashboard-grid">
        
        {/* Card: Saldo Atual */}
        <div className="dashboard-card">
          <h3>Saldo Financeiro Atual</h3>
          <p className="card-value">R$ 0,00</p>
          <span className="card-footer">Atualizado via Open Finance</span>
        </div>

        {/* Card: Próxima Fatura */}
        <div className="dashboard-card">
          <h3>Próxima Fatura de Cartão</h3>
          <p className="card-value">R$ 0,00</p>
          <span className="card-footer">Vencimento: --/--</span>
        </div>

        {/* Card: Próxima Conta Mensal */}
        <div className="dashboard-card">
          <h3>Próxima Conta Mensal</h3>
          <p className="card-value">Nenhuma conta próxima</p>
          <span className="card-footer">Água, Energia, Internet...</span>
        </div>

        {/* Card: Alerta de Estoque (Diferencial) */}
        <div className="dashboard-card alert-card">
          <h3>Estoque Residencial</h3>
          <p className="card-value">0 itens</p>
          <span className="card-footer">Próximos ao vencimento</span>
        </div>

      </div>
    </div>
  );
}