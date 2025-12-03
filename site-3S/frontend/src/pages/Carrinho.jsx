import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Carrinho() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [carrinho, setCarrinho] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        // Verificar se cliente está logado
        const clienteLogado = localStorage.getItem("cliente");
        if (!clienteLogado) {
            navigate("/login");
            return;
        }
        setCliente(JSON.parse(clienteLogado));

        // Carregar carrinho do localStorage
        const carrinhoSalvo = localStorage.getItem("carrinho");
        if (carrinhoSalvo) {
            setCarrinho(JSON.parse(carrinhoSalvo));
        }

        // Buscar produtos para exibir informações
        buscarProdutos();
    }, [navigate]);

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

    const calcularTotal = () => {
        return carrinho.reduce((total, item) => {
            return total + (item.preco_unit * item.quantidade);
        }, 0);
    };

    const finalizarPedido = async () => {
        if (carrinho.length === 0) {
            setMensagem({ tipo: "erro", texto: "Carrinho vazio!" });
            return;
        }

        setCarregando(true);
        setMensagem({ tipo: "", texto: "" });

        try {
            const response = await fetch("http://localhost:3000/api/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cliente_id: cliente.id,
                    itens: carrinho
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({
                    tipo: "sucesso",
                    texto: `Pedido #${data.pedidoId} realizado com sucesso!`
                });

                // Limpar carrinho
                setCarrinho([]);
                localStorage.removeItem("carrinho");

                // Redirecionar após 3 segundos
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setMensagem({
                    tipo: "erro",
                    texto: data.erro || "Erro ao finalizar pedido"
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

    const logout = () => {
        localStorage.removeItem("cliente");
        localStorage.removeItem("carrinho");
        navigate("/");
    };

    if (!cliente) return null;

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
                        <span style={{ color: "#fff" }}>Olá, {cliente.nome}</span>
                        <button
                            onClick={logout}
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                border: "1px solid #fff",
                                color: "#fff",
                                padding: "0.5rem 1rem",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Sair
                        </button>
                    </nav>
                </div>
            </header>

            <div className="carrinho-content">
                <div className="carrinho-box">
                    <h2>Meu Carrinho</h2>

                    {mensagem.texto && (
                        <div className={`mensagem ${mensagem.tipo}`}>
                            {mensagem.texto}
                        </div>
                    )}

                    {carrinho.length === 0 ? (
                        <div className="carrinho-vazio">
                            <p>Seu carrinho está vazio</p>
                            <Link to="/produtos" className="btn-continuar">
                                Continuar Comprando
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="carrinho-itens">
                                {carrinho.map((item) => {
                                    const produto = getProdutoInfo(item.produto_id);
                                    return (
                                        <div key={item.produto_id} className="carrinho-item">
                                            <div className="item-info">
                                                <h3>{produto.nome || `Produto #${item.produto_id}`}</h3>
                                                <p className="item-preco">
                                                    R$ {item.preco_unit?.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="item-quantidade">
                                                <button
                                                    onClick={() => atualizarQuantidade(item.produto_id, item.quantidade - 1)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantidade}</span>
                                                <button
                                                    onClick={() => atualizarQuantidade(item.produto_id, item.quantidade + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="item-subtotal">
                                                R$ {(item.preco_unit * item.quantidade).toFixed(2)}
                                            </div>
                                            <button
                                                className="btn-remover"
                                                onClick={() => removerItem(item.produto_id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="carrinho-resumo">
                                <div className="resumo-linha">
                                    <span>Total:</span>
                                    <strong>R$ {calcularTotal().toFixed(2)}</strong>
                                </div>
                                <button
                                    className="btn-finalizar"
                                    onClick={finalizarPedido}
                                    disabled={carregando}
                                >
                                    {carregando ? "Processando..." : "Finalizar Pedido"}
                                </button>
                                <Link to="/produtos" className="btn-continuar">
                                    Continuar Comprando
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
