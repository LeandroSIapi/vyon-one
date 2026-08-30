import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { PluggyConnect } from "react-pluggy-connect"; // ✅ Importação do Widget
import "./Cartoes.css";

export default function CartoesScreen() {
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais Manuais
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarExcluir, setMostrarExcluir] = useState(false);

  // Campos do formulário manual
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [limite, setLimite] = useState("");
  const [fechamento, setFechamento] = useState("");
  const [vencimento, setVencimento] = useState("");

  // ✅ Estados da Pluggy
  const [connectToken, setConnectToken] = useState(""); 
  const [abrirPluggy, setAbrirPluggy] = useState(false);

  useEffect(() => {
    carregarCartoes();
  }, []);

  async function carregarCartoes() {
    // ... [MANTENHA EXATAMENTE A MESMA FUNÇÃO QUE FIZEMOS ANTES] ...
  }

  // ... [MANTENHA AS FUNÇÕES adicionarCartao, editarCartao, excluirCartao, fecharTodosModais e abrirEdicao] ...

  // ✅ Função que vai solicitar o token para o backend no futuro
  // ✅ Função real chamando a Edge Function que fizemos o deploy
  async function iniciarConexaoBanco() {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-pluggy-token');
      
      if (error) throw error;
      
      if (data && data.connectToken) {
        setConnectToken(data.connectToken);
        setAbrirPluggy(true); // Abre o Widget oficial da Pluggy na tela
      } else {
        alert("O servidor não retornou o token de conexão.");
      }
    } catch (err) {
      console.error("Erro ao gerar token da Pluggy:", err);
      alert("Falha ao comunicar com o servidor. Verifique o console.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Callbacks de sucesso/erro da Pluggy
  const handlePluggySuccess = async (itemData) => {
    console.log("Conexão concluída com sucesso pela Pluggy!", itemData);
    setAbrirPluggy(false);
    setLoading(true);

    try {
      // Envia o itemId da conexão para a Edge Function importar as contas
      const { error } = await supabase.functions.invoke('generate-pluggy-token', {
        body: { itemId: itemData.item.id }
      });

      if (error) throw error;

      alert("Banco conectado e contas importadas com sucesso!");
      carregarCartoes(); // Recarrega a tela para exibir os novos cartões sincronizados
    } catch (err) {
      console.error("Erro ao importar contas do banco:", err);
      alert("Conexão realizada, mas houve um erro ao sincronizar as contas.");
    } finally {
      setLoading(false);
    }
  };

  const handlePluggyError = (error) => {
    console.error("Erro na conexão com o banco:", error);
    setAbrirPluggy(false);
  };

  return (
    <div className="cartoes-container">
      <header className="cartoes-header">
        <div>
          <h1>Cartões de Crédito</h1>
          <p>Gerencie limites e faturas atuais</p>
        </div>
        
        {/* ✅ Nova fileira de botões: Manual vs Automático */}
        <div className="header-actions">
          <button className="btn-secondary btn-add" onClick={() => setMostrarModal(true)}>
            + Cadastro Manual
          </button>
          <button className="btn-primary btn-add btn-pluggy" onClick={iniciarConexaoBanco}>
            🔗 Conectar Banco
          </button>
        </div>
      </header>

      {/* ✅ WIDGET DA PLUGGY (Fica invisível até receber o token) */}
      {abrirPluggy && connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={true} // Mantemos o modo sandbox para testes
          onSuccess={handlePluggySuccess}
          onError={handlePluggyError}
        />
      )}

      {/* ... [MANTENHA EXATAMENTE O RESTO DO CÓDIGO: loading, dashboard-grid e Modais Manuais] ... */}
      
    </div>
  );
}