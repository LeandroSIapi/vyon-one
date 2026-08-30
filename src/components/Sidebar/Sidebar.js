import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Vyon</h2>
      </div>

      <div className="sidebar-links">
        {/* O 'end' no Dashboard garante que ele só fique ativo na rota exata "/" */}
        <NavLink to="/" end>🏠 <span>Dashboard</span></NavLink>
        <NavLink to="/cartoes">💳 <span>Cartões</span></NavLink>
        <NavLink to="/transacoes">💸 <span>Transações</span></NavLink>
        <NavLink to="/pessoas">👥 <span>Pessoas</span></NavLink>
        <NavLink to="/contas">📋 <span>Contas</span></NavLink>
        <NavLink to="/investimentos">📈 <span>Investimentos</span></NavLink>
        <NavLink to="/estoque">📦 <span>Estoque</span></NavLink>
        <NavLink to="/compras">🛒 <span>Compras</span></NavLink>
        <NavLink to="/planos">🎯 <span>Planos</span></NavLink>
      </div>
    </nav>
  );
}