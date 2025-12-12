import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@3s.com");
  const [senha, setSenha] = useState("admin123");
  const [erro, setErro] = useState("");

  const logar = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resp.json();

      if (!resp.ok) {
        setErro(dados.error || "Erro ao logar");
        return;
      }

      // salva token
      localStorage.setItem("adminToken", dados.token);

      // redireciona ao painel admin
      navigate("/admin");

    } catch (err) {
      console.error(err);
      setErro("Erro ao conectar ao servidor");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
      <h2>Login Admin</h2>

      <form onSubmit={logar} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)}
          required />

        <input type="password" placeholder="Senha"
          value={senha} onChange={e => setSenha(e.target.value)}
          required />

        <button type="submit" style={{
          padding: "10px",
          background: "#ff6600",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}>
          Entrar
        </button>
      </form>

      {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}
    </div>
  );
}
