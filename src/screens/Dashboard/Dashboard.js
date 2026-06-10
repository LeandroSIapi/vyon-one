import "./Dashboard.css";
import { supabase } from "../../services/supabaseClient";


export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dashboard-container">
      <h1>Bem-vindo</h1>
      
      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}