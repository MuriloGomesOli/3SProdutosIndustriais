import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        senha: ""
    });
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    const [carregando, setCarregando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setMensagem({ tipo: "", texto: "" });

        try {
            const response = await fetch("http://localhost:3000/api/clientes/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Salvar dados do cliente no localStorage
                localStorage.setItem("cliente", JSON.stringify(data.cliente));

                setMensagem({
                    tipo: "sucesso",
                    texto: "Login realizado com sucesso! Redirecionando..."
                });

                // Redirecionar para o carrinho após 1 segundo
                setTimeout(() => {
                    navigate("/carrinho");
                }, 1000);
            } else {
                setMensagem({
                    tipo: "erro",
                    texto: data.erro || "Erro ao fazer login"
                });
            }
        } catch (erro) {
            console.error("Erro:", erro);
            setMensagem({
                tipo: "erro",
                texto: "Erro ao conectar com o servidor"
            });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="cadastro-container">
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">
                        <h1>3S Produtos Industriais</h1>
                    </Link>
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/produtos">Produtos</Link>
                        <Link to="/sobre">Sobre</Link>
                        <Link to="/contato">Contato</Link>
                    </nav>
                </div>
            </header>

            <div className="cadastro-content">
                <div className="cadastro-box">
                    <h2>Login de Cliente</h2>
                    <p className="cadastro-subtitle">
                        Entre com suas credenciais para continuar
                    </p>

                    {mensagem.texto && (
                        <div className={`mensagem ${mensagem.tipo}`}>
                            {mensagem.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="cadastro-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                id="senha"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                required
                                placeholder="Digite sua senha"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-cadastro"
                            disabled={carregando}
                        >
                            {carregando ? "Entrando..." : "Entrar"}
                        </button>

                        <p className="login-link">
                            Não tem cadastro? <Link to="/cadastro">Cadastre-se aqui</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
