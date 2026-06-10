import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <h2>Vyon-One</h2>

      <Link to="/">🏠 Dashboard</Link>

      <Link to="/cartoes">💳 Cartões</Link>

      <Link to="/transacoes">💸 Transações</Link>

      <Link to="/pessoas">👥 Pessoas</Link>

      <Link to="/contas">📋 Contas</Link>

      <Link to="/investimentos">📈 Investimentos</Link>

      <Link to="/estoque">📦 Estoque</Link>

      <Link to="/compras">🛒 Compras</Link>

      <Link to="/planos">🎯 Planos</Link>

    </div>
  );
}