import { useState } from "react";
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

  const [showRegisterPassword, setShowRegisterPassword] = useState(false); // ✅ faltava

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  // ✅ Social
  const handleGoogleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleAppleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
  };

  // ✅ Login
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
        <p className="login-subtitle">
          Faça login para continuar
        </p>

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
            <input type="checkbox" />
            <span>Lembrar-me</span>
          </label>

          
          <button className="link-button">
            Esqueci minha senha
          </button>


        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <div className="social-login">
          <button>
            <img src={googleIcon} alt="Google" />
          </button>
          <button>
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

      {/* ✅ MODAL */}
      {showRegister && (
        <div
          className="modal-overlay"
          onClick={() => setShowRegister(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-icon"
              onClick={() => setShowRegister(false)}
            >
              ×
            </button>

            <h2>Criar conta</h2>

            <input
              className="input-field"
              type="email"
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            {/* ✅ senha com olho agora */}
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
                onClick={() =>
                  setShowRegisterPassword(!showRegisterPassword)
                }
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