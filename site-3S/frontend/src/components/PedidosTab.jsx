import React, { useState, useEffect } from "react";

export default function PedidosTab() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtros e Ordenação
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [ordem, setOrdem] = useState("data_desc"); // data_desc, data_asc, status

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    useEffect(() => {
        carregarPedidos();
    }, []);

    const carregarPedidos = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/pedidos");
            if (res.ok) {
                setPedidos(await res.json());
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const atualizarStatus = async (id, novoStatus) => {
        try {
            const res = await fetch(`http://localhost:3000/api/pedidos/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus })
            });

            if (res.ok) {
                setPedidos(pedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
                if (pedidoSelecionado && pedidoSelecionado.id === id) {
                    setPedidoSelecionado({ ...pedidoSelecionado, status: novoStatus });
                }
            } else {
                alert("Erro ao atualizar status");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    const abrirModal = (pedido) => {
        setPedidoSelecionado(pedido);
        setModalAberto(true);
    };

    // Lógica de Filtragem e Ordenação
    const pedidosFiltrados = pedidos
        .filter(p => {
            const termo = busca.toLowerCase();
            const matchBusca =
                (p.nome_contato && p.nome_contato.toLowerCase().includes(termo)) ||
                (p.email_contato && p.email_contato.toLowerCase().includes(termo)) ||
                (p.id.toString().includes(termo));

            const matchStatus = filtroStatus === "todos" ? true : p.status === filtroStatus;

            return matchBusca && matchStatus;
        })
        .sort((a, b) => {
            if (ordem === "data_desc") return new Date(b.data_pedido) - new Date(a.data_pedido);
            if (ordem === "data_asc") return new Date(a.data_pedido) - new Date(b.data_pedido);
            if (ordem === "status") return a.status.localeCompare(b.status);
            return 0;
        });

    // Helper para formatar itens do modal
    const parseItens = (itensStr) => {
        if (!itensStr) return [];
        return itensStr.split('; ').map(item => {
            const partes = item.split(' | ');
            return {
                produto: partes[0],
                qtd: partes[1],
                esp: partes[2]
            };
        });
    };

    return (
        <div className="pedidos-tab">
            {/* BARRA DE FERRAMENTAS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                    <input
                        placeholder="🔍 Buscar por nome, email ou ID..."
                        value={busca} onChange={e => setBusca(e.target.value)}
                        style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                </div>

                <select
                    value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="cotacao_enviada">Cotação Enviada</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="cancelado">Cancelado</option>
                </select>

                <select
                    value={ordem} onChange={e => setOrdem(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                    <option value="data_desc">Mais Recentes</option>
                    <option value="data_asc">Mais Antigos</option>
                    <option value="status">Por Status</option>
                </select>
            </div>

            {/* TABELA */}
            {loading ? <p>Carregando pedidos...</p> : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <thead>
                        <tr style={{ background: "#f1f1f1", textAlign: "left", color: "#555" }}>
                            <th style={{ padding: "1rem" }}>ID</th>
                            <th style={{ padding: "1rem" }}>Cliente</th>
                            <th style={{ padding: "1rem" }}>Data</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.map(p => (
                            <tr key={p.id} style={{ borderBottom: "1px solid #eee", background: p.status === 'pendente' ? '#fffbf0' : 'white' }}>
                                <td style={{ padding: "1rem", fontWeight: "bold" }}>#{p.id}</td>
                                <td style={{ padding: "1rem" }}>
                                    <div>{p.nome_contato}</div>
                                    <div style={{ fontSize: "0.85rem", color: "#888" }}>{p.email_contato}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>{new Date(p.data_pedido).toLocaleDateString()} {new Date(p.data_pedido).toLocaleTimeString().slice(0, 5)}</td>
                                <td style={{ padding: "1rem" }}>
                                    <select
                                        value={p.status}
                                        onChange={(e) => atualizarStatus(p.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            padding: "0.3rem", borderRadius: "4px", border: "1px solid #ddd",
                                            fontWeight: "bold",
                                            background: p.status === 'pendente' ? '#fff3cd' :
                                                p.status === 'aprovado' ? '#d4edda' :
                                                    p.status === 'cancelado' ? '#f8d7da' : '#e2e3e5',
                                            color: p.status === 'pendente' ? '#856404' :
                                                p.status === 'aprovado' ? '#155724' :
                                                    p.status === 'cancelado' ? '#721c24' : '#383d41'
                                        }}
                                    >
                                        <option value="pendente">Pendente</option>
                                        <option value="cotacao_enviada">Cotação Enviada</option>
                                        <option value="aprovado">Aprovado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <button
                                        onClick={() => abrirModal(p)}
                                        style={{ padding: "0.4rem 0.8rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL DE DETALHES */}
            {modalAberto && pedidoSelecionado && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                    <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "600px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ margin: 0 }}>Pedido #{pedidoSelecionado.id}</h2>
                            <button onClick={() => setModalAberto(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
                            <div>
                                <strong>Cliente:</strong>
                                <div>{pedidoSelecionado.nome_contato}</div>
                                <div style={{ color: "#666" }}>{pedidoSelecionado.email_contato}</div>
                            </div>
                            <div>
                                <strong>Data:</strong>
                                <div>{new Date(pedidoSelecionado.data_pedido).toLocaleString()}</div>
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <div style={{ marginTop: "0.2rem" }}>
                                    <span style={{
                                        padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "bold",
                                        background: pedidoSelecionado.status === 'pendente' ? '#fff3cd' : '#d4edda'
                                    }}>
                                        {pedidoSelecionado.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Itens do Pedido</h3>
                        <table style={{ width: "100%", marginBottom: "1.5rem", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#eee", textAlign: "left" }}>
                                    <th style={{ padding: "0.5rem" }}>Produto</th>
                                    <th style={{ padding: "0.5rem" }}>Qtd</th>
                                    <th style={{ padding: "0.5rem" }}>Especificação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parseItens(pedidoSelecionado.itens_formatados).map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "0.5rem" }}>{item.produto}</td>
                                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{item.qtd}</td>
                                        <td style={{ padding: "0.5rem", color: "#666" }}>{item.esp || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pedidoSelecionado.mensagem && (
                            <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "4px", border: "1px solid #ffeeba" }}>
                                <strong>Mensagem do Cliente:</strong>
                                <p style={{ margin: "0.5rem 0 0 0" }}>{pedidoSelecionado.mensagem}</p>
                            </div>
                        )}

                        <div style={{ marginTop: "2rem", textAlign: "right" }}>
                            <button onClick={() => setModalAberto(false)} style={{ padding: "0.6rem 1.2rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
