import { useState, useEffect } from "react"; // ✅ Adicionado useEffect
import "./login.css";
import { supabase } from "../../services/supabaseClient";

import googleIcon from "../../assets/icons/google.png";
import appleIcon from "../../assets/icons/apple.png";
import topImage from "../../assets/images/top-login.png";
import bgImage from "../../assets/images/bg-login.png";
import eyeOpen from "../../assets/icons/eye-open.png";
import eyeClosed from "../../assets/icons/eye-closed.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NOVO: State para o Lembrar-me
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ NOVO: useEffect para carregar o e-mail salvo ao abrir a tela
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ✅ Cadastro
  const handleRegister = async () => {
    setRegisterMsg("");
    const { error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
    });

    if (error) {
      setRegisterMsg(error.message);
    } else {
      setRegisterMsg("Conta criada! Verifique seu email.");
    }
  };

  // ✅ Social (Atualizado com redirectTo)
  const handleGoogleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // Garante que volta para o app
      },
    });
  };

  const handleAppleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: window.location.origin, // Garante que volta para o app
      },
    });
  };

  // ✅ Login (Atualizado com a lógica do Lembrar-me)
  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      // Se marcou Lembrar-me, salva no local storage. Se não, limpa.
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    }
  };

  // ✅ NOVO: Recuperação de Senha
  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg("Digite seu e-mail para recuperar a senha.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password", // Rota futura para redefinir
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg("E-mail de recuperação enviado! Verifique sua caixa de entrada."); // Usando erroMsg para exibir sucesso (para reaproveitar CSS)
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-content">
        <img src={topImage} alt="logo" className="login-top-image" />

        <h1 className="login-title">Bem-vindo de volta!</h1>
        <p className="login-subtitle">Faça login para continuar</p>

        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <img
            src={showPassword ? eyeClosed : eyeOpen}
            alt="toggle senha"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Lembrar-me</span>
          </label>

          {/* ✅ Botão Esqueci minha senha ativado */}
          <button className="link-button" onClick={handleResetPassword} disabled={loading}>
            Esqueci minha senha
          </button>
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Processando..." : "Entrar"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}

        {/* ✅ Botões de Login Social configurados */}
        <div className="social-login">
          <button onClick={handleGoogleRegister}>
            <img src={googleIcon} alt="Google" />
          </button>
          <button onClick={handleAppleRegister}>
            <img src={appleIcon} alt="Apple" />
          </button>
        </div>

        <p className="signup-text">
          Ainda não tem uma conta?{" "}
          <button
            className="link-button"
            onClick={() => setShowRegister(true)}
          >
            Cadastrar-se
          </button>
        </p>
      </div>

      {/* ✅ O Modal continua exatamente igual */}
      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-icon" onClick={() => setShowRegister(false)}>
              ×
            </button>
            <h2>Criar conta</h2>
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <div className="password-field">
              <input
                className="input-field"
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Senha"
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <img
                src={showRegisterPassword ? eyeClosed : eyeOpen}
                alt="toggle senha"
                className="eye-icon"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              />
            </div>
            <button className="btn-primary" onClick={handleRegister}>
              Criar conta
            </button>
            {registerMsg && <p className="error">{registerMsg}</p>}
            <div className="social-register">
              <button onClick={handleGoogleRegister}>
                <img src={googleIcon} alt="Google" />
              </button>
              <button onClick={handleAppleRegister}>
                <img src={appleIcon} alt="Apple" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}