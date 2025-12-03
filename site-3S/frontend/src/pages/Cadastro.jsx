import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Cadastro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        endereco: "",
        cpf: "",
        cnpj: ""
    });
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    const [carregando, setCarregando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Permitir que o usuário digite com formatação
        // O backend irá padronizar e validar os dados
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setMensagem({ tipo: "", texto: "" });

        try {
            const response = await fetch("http://localhost:3000/api/clientes/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({
                    tipo: "sucesso",
                    texto: "Cadastro realizado com sucesso! Redirecionando..."
                });

                // Limpar formulário
                setFormData({
                    nome: "",
                    email: "",
                    senha: "",
                    telefone: "",
                    endereco: "",
                    cpf: "",
                    cnpj: ""
                });

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setMensagem({
                    tipo: "erro",
                    texto: data.erro || "Erro ao realizar cadastro"
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
                    </nav>
                </div>
            </header>

            <div className="cadastro-content">
                <div className="cadastro-box">
                    <h2>Cadastro de Cliente</h2>
                    <p className="cadastro-subtitle">
                        Preencha seus dados para entrar em contato conosco
                    </p>

                    {mensagem.texto && (
                        <div className={`mensagem ${mensagem.tipo}`}>
                            {mensagem.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="cadastro-form">
                        <div className="form-group">
                            <label htmlFor="nome">Nome Completo *</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                placeholder="Digite seu nome completo"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
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
                            <label htmlFor="senha">Senha *</label>
                            <input
                                type="password"
                                id="senha"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                required
                                minLength="6"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cpf">
                                    CPF <span className="info-text">(11 dígitos)</span>
                                </label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    placeholder="123.456.789-01 ou 12345678901"
                                    maxLength="14"
                                />
                                <small className="help-text">
                                    ℹ️ Digite 11 números (formatação opcional, será removida automaticamente)
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="cnpj">
                                    CNPJ <span className="info-text">(14 dígitos)</span>
                                </label>
                                <input
                                    type="text"
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    placeholder="12.345.678/0001-90 ou 12345678000190"
                                    maxLength="18"
                                />
                                <small className="help-text">
                                    ℹ️ Digite 14 números (formatação opcional, será removida automaticamente)
                                </small>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefone">Telefone <span className="info-text">(10-11 dígitos)</span></label>
                            <input
                                type="tel"
                                id="telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                placeholder="(11) 98765-4321"
                            />
                            <small className="help-text">
                                ℹ️ Formatação opcional, será padronizado automaticamente
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="endereco">Endereço</label>
                            <input
                                type="text"
                                id="endereco"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                placeholder="Rua, número, bairro, cidade"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-cadastro"
                            disabled={carregando}
                        >
                            {carregando ? "Cadastrando..." : "Cadastrar"}
                        </button>

                        <p className="login-link">
                            Já tem cadastro? <Link to="/login">Faça login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
