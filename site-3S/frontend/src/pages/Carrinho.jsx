import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/3S/logopreta.jpeg";

export default function Carrinho() {
    const navigate = useNavigate();
    const [carrinho, setCarrinho] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    const [carregando, setCarregando] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        mensagem: ""
    });

    useEffect(() => {
        // Carregar carrinho do localStorage
        const carrinhoSalvo = localStorage.getItem("carrinho");
        if (carrinhoSalvo) {
            setCarrinho(JSON.parse(carrinhoSalvo));
        }

        // Buscar produtos para exibir informações
        buscarProdutos();
    }, []);

    const buscarProdutos = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/produtos");
            const data = await response.json();
            setProdutos(data);
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        }
    };

    const getProdutoInfo = (produtoId) => {
        return produtos.find(p => p.id === produtoId) || {};
    };

    const removerItem = (produtoId) => {
        const novoCarrinho = carrinho.filter(item => item.produto_id !== produtoId);
        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    };

    const atualizarQuantidade = (produtoId, novaQuantidade) => {
        if (novaQuantidade < 1) return;

        const novoCarrinho = carrinho.map(item =>
            item.produto_id === produtoId
                ? { ...item, quantidade: novaQuantidade }
                : item
        );
        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    };

    const atualizarEspecificacao = (produtoId, texto) => {
        const novoCarrinho = carrinho.map(item =>
            item.produto_id === produtoId
                ? { ...item, especificacao: texto }
                : item
        );
        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const enviarCotacao = async (e) => {
        e.preventDefault();

        if (carrinho.length === 0) {
            setMensagem({ tipo: "erro", texto: "Sua lista de cotação está vazia!" });
            return;
        }

        setCarregando(true);
        setMensagem({ tipo: "", texto: "" });

        setCarregando(true);
        setMensagem({ tipo: "", texto: "" });

        try {
            const itensPedido = carrinho.map(item => {
                const produtoInfo = getProdutoInfo(item.produto_id);
                return {
                    nome_produto: produtoInfo.nome || `Produto ${item.produto_id}`,
                    quantidade: item.quantidade,
                    especificacao: item.especificacao || ""
                };
            });

            const response = await fetch("http://localhost:3000/api/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    mensagem: formData.mensagem,
                    itens: itensPedido
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({
                    tipo: "sucesso",
                    texto: `Obrigado, ${formData.nome}! Sua cotação foi enviada. Iremos retornar por email.`
                });

                // Limpar carrinho e form
                setCarrinho([]);
                localStorage.removeItem("carrinho");
                setFormData({ nome: "", email: "", mensagem: "" });
                window.scrollTo(0, 0);
            } else {
                setMensagem({ tipo: "erro", texto: data.erro || "Erro ao enviar cotação." });
            }

        } catch (erro) {
            console.error("Erro ao enviar cotação:", erro);
            setMensagem({ tipo: "erro", texto: "Erro de conexão com o servidor." });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="home-container">
            <header className="main-header">
                <div className="header-content">
                    <img src={logo} alt="3S Produtos Industriais" style={{ height: '60px', paddingTop: '10px', paddingLeft: '80px' }} />
                    <nav className="main-nav">
                        <Link to="/produtos" className="nav-link">PRODUTOS</Link>
                        <Link to="/sobre" className="nav-link">SOBRE</Link>
                        <Link to="/#contato" className="nav-link">CONTATO</Link>
                    </nav>
                </div>
            </header>

            <div className="main-layout" style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' }}>

                {mensagem.texto && (
                    <div className={`mensagem ${mensagem.tipo}`} style={{
                        padding: '1rem',
                        marginBottom: '2rem',
                        borderRadius: '8px',
                        backgroundColor: mensagem.tipo === 'sucesso' ? '#d4edda' : '#f8d7da',
                        color: mensagem.tipo === 'sucesso' ? '#155724' : '#721c24',
                        border: `1px solid ${mensagem.tipo === 'sucesso' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {mensagem.texto}
                    </div>
                )}

                <div className="quote-form-container" style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ color: '#ff6600', marginBottom: '2rem', textAlign: 'center', fontSize: '1.8rem' }}>
                        Quer falar com a gente? Envie sua mensagem por aqui!
                    </h2>

                    <form onSubmit={enviarCotacao}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Nome</label>
                            <input
                                type="text" name="nome" placeholder="Seu nome" required
                                value={formData.nome} onChange={handleFormChange}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Email</label>
                            <input
                                type="email" name="email" placeholder="Seu email" required
                                value={formData.email} onChange={handleFormChange}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                            />
                        </div>

                        <div className="selected-products" style={{ marginBottom: '2rem', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '1.5rem 0' }}>
                            <h3 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.2rem' }}>Produtos Selecionados</h3>

                            {carrinho.length === 0 ? (
                                <p style={{ color: '#888', fontStyle: 'italic' }}>Nenhum produto selecionado.</p>
                            ) : (
                                carrinho.map((item) => {
                                    const produto = getProdutoInfo(item.produto_id);
                                    return (
                                        <div key={item.produto_id} className="quote-item" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px dashed #eee' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <img src={produto.imagem || "https://via.placeholder.com/50"} alt={produto.nome} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <h4 style={{ margin: 0, color: '#333' }}>{produto.nome || `Produto #${item.produto_id}`}</h4>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <button type="button" onClick={() => atualizarQuantidade(item.produto_id, item.quantidade - 1)} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>-</button>
                                                        <span style={{ fontWeight: 'bold' }}>{item.quantidade}</span>
                                                        <button type="button" onClick={() => atualizarQuantidade(item.produto_id, item.quantidade + 1)} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>+</button>
                                                    </div>
                                                    <button type="button" onClick={() => removerItem(item.produto_id)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Remover</button>
                                                </div>
                                            </div>

                                            <div className="spec-field">
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Tamanho e Especialização:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: 1/2 polegada, Aço Inox..."
                                                    value={item.especificacao || ""}
                                                    onChange={(e) => atualizarEspecificacao(item.produto_id, e.target.value)}
                                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', borderRadius: '4px', background: '#f9f9f9' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            <div style={{ marginTop: '1.5rem' }}>
                                <Link to="/produtos" style={{ color: '#ff6600', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <i className="fas fa-plus-circle"></i> Adicionar outro produto
                                </Link>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Sua mensagem</label>
                            <textarea
                                name="mensagem" rows="4" placeholder="Digite sua mensagem..."
                                value={formData.mensagem} onChange={handleFormChange}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                            ></textarea>
                        </div>

                        <div className="form-footer" style={{ textAlign: 'center' }}>
                            <p style={{ color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>Iremos retornar por email</p>
                            <button
                                type="submit"
                                disabled={carregando}
                                style={{
                                    padding: '1rem 3rem', background: '#ff6600', color: 'white', border: 'none', borderRadius: '50px',
                                    fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.3s',
                                    boxShadow: '0 4px 10px rgba(255, 102, 0, 0.2)'
                                }}
                            >
                                {carregando ? "Enviando..." : "Enviar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <footer className="main-footer">
                <p>© 2025 3S Produtos Industriais. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
