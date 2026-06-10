import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export default function CartoesScreen() {
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarExcluir, setMostrarExcluir] = useState(false);

  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [limite, setLimite] = useState("");
  const [fechamento, setFechamento] = useState("");
  const [vencimento, setVencimento] = useState("");

  useEffect(() => {
    carregarCartoes();
  }, []);

  async function carregarCartoes() {
    const { data: cartoesData, error } = await supabase
      .from("credit_cards")
      .select("*");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const cartoesComFatura = await Promise.all(
      cartoesData.map(async (cartao) => {
        const { data: transacoes } = await supabase
          .from("transactions")
          .select("amount")
          .eq("credit_card_id", cartao.id)
          .eq("transaction_type", "expense");

        const fatura =
          transacoes?.reduce(
            (total, transacao) =>
              total + Number(transacao.amount),
            0
          ) || 0;

        return {
          ...cartao,
          fatura,
        };
      })
    );

    setCartoes(cartoesComFatura);
    setLoading(false);
  }

  async function adicionarCartao() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("credit_cards")
    .insert([
      {
        user_id: user.id,
        name: nome,
        institution: instituicao,
        limit_amount: Number(limite),
        closing_day: Number(fechamento),
        due_day: Number(vencimento),
      },
    ]);

  if (error) {
    console.error(error);
    return;
  }

  setNome("");
  setInstituicao("");
  setLimite("");
  setFechamento("");
  setVencimento("");

  setMostrarModal(false);

  carregarCartoes();
}

async function editarCartao() {
  console.log("EDITAR EXECUTADO");

  const { error } = await supabase
    .from("credit_cards")
    .update({
      name: nome,
      institution: instituicao,
      limit_amount: Number(limite),
      closing_day: Number(fechamento),
      due_day: Number(vencimento),
    })
    .eq("id", cartaoSelecionado.id);

  console.log(error);

  if (error) {
    console.error(error);
    return;
  }

  setMostrarEditar(false);
  setCartaoSelecionado(null);

  carregarCartoes();
}

async function excluirCartao() {
  const { error } = await supabase
    .from("credit_cards")
    .delete()
    .eq("id", cartaoSelecionado.id);

  if (error) {
    console.error(error);
    return;
  }

  setMostrarExcluir(false);
  setCartaoSelecionado(null);

  carregarCartoes();
}

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Cartões</h1>

        <button
          onClick={() => setMostrarModal(true)}
          style={{
            width: 40,
            height: 40,
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              width: 400,
              boxShadow: "0 0 20px rgba(0,0,0,0.2)",
            }}
          >
            <h2>Novo Cartão</h2>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />

            <br />
            <br />

            <input
              placeholder="Instituição"
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Limite"
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Dia de fechamento"
              value={fechamento}
              onChange={(e) => setFechamento(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Dia de vencimento"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />

            <br />
            <br />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>

              <button onClick={adicionarCartao}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {cartoes.length === 0 && (
        <p>Nenhum cartão cadastrado</p>
      )}

      {cartoes.map((cartao) => (
  <div
    key={cartao.id}
    onClick={() => setCartaoSelecionado(cartao)}
    style={{
      border: "1px solid #ccc",
      padding: 12,
      marginBottom: 10,
      borderRadius: 8,
      cursor: "pointer",
    }}
  >
          <strong>{cartao.name}</strong>

          <p>
            Limite: R$ {Number(cartao.limit_amount || 0).toFixed(2)}
          </p>

          <p>
            Fatura Atual: R$ {(cartao.fatura || 0).toFixed(2)}
          </p>
        </div>
      ))}
      {cartaoSelecionado && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1001,
    }}
  >
    <div
      style={{
        background: "#fff",
        width: 500,
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      }}
    >
      <h2>{cartaoSelecionado.name}</h2>

      <p>
        <strong>Instituição:</strong>{" "}
        {cartaoSelecionado.institution}
      </p>

      <p>
        <strong>Limite:</strong> R$
        {Number(
          cartaoSelecionado.limit_amount || 0
        ).toFixed(2)}
      </p>

      <p>
        <strong>Fatura Atual:</strong> R$
        {(cartaoSelecionado.fatura || 0).toFixed(2)}
      </p>

      <p>
        <strong>Fechamento:</strong>{" "}
        {cartaoSelecionado.closing_day}
      </p>

      <p>
        <strong>Vencimento:</strong>{" "}
        {cartaoSelecionado.due_day}
      </p>

      <hr />

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <button
  onClick={() => {
  setNome(cartaoSelecionado.name || "");
  setInstituicao(cartaoSelecionado.institution || "");
  setLimite(cartaoSelecionado.limit_amount || "");
  setFechamento(cartaoSelecionado.closing_day || "");
  setVencimento(cartaoSelecionado.due_day || "");

  setMostrarEditar(true);
}}
>
  ✏️ Editar
</button>

<button
  onClick={() => setMostrarExcluir(true)}
>
  🗑️ Excluir
</button>
      </div>

      <h3>Transações</h3>

      <p>
        Em breve aparecerão aqui as
        transações deste cartão.
      </p>

      <button
        onClick={() =>
          setCartaoSelecionado(null)
        }
      >
        Fechar
      </button>
    </div>
  </div>
)}

{mostrarEditar && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2500,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 400,
      }}
    >
      <h2>Editar Cartão</h2>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <br /><br />

      <input
        placeholder="Instituição"
        value={instituicao}
        onChange={(e) => setInstituicao(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Limite"
        value={limite}
        onChange={(e) => setLimite(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Dia de fechamento"
        value={fechamento}
        onChange={(e) => setFechamento(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Dia de vencimento"
        value={vencimento}
        onChange={(e) => setVencimento(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <br /><br />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setMostrarEditar(false)}
        >
          Cancelar
        </button>

        <button
          onClick={editarCartao}
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
)}

{mostrarExcluir && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 350,
      }}
    >
      <h3>Excluir Cartão</h3>

      <p>
        Tem certeza que deseja excluir
        o cartão "{cartaoSelecionado?.name}"?
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setMostrarExcluir(false)}
        >
          Cancelar
        </button>

        <button
          onClick={excluirCartao}
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}