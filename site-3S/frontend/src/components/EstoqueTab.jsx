import React, { useState, useEffect } from "react";

export default function EstoqueTab() {
    const [produtos, setProdutos] = useState([]);
    const [resumo, setResumo] = useState({ total_produtos: 0, baixo_estoque: 0, sem_estoque: 0 });
    const [filtro, setFiltro] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [modalAberto, setModalAberto] = useState(false);
    const [tipoMovimentacao, setTipoMovimentacao] = useState("entrada"); // entrada | saida
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [qtdMovimentacao, setQtdMovimentacao] = useState(1);
    const [motivoMovimentacao, setMotivoMovimentacao] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const resProd = await fetch("http://localhost:3000/api/produtos");
            if (resProd.ok) setProdutos(await resProd.json());

            const resResumo = await fetch("http://localhost:3000/api/estoque/resumo");
            if (resResumo.ok) setResumo(await resResumo.json());
        } catch (error) {
            console.error("Erro ao carregar estoque:", error);
        }
    };

    const abrirModal = (tipo, produto = null) => {
        setTipoMovimentacao(tipo);
        setProdutoSelecionado(produto ? produto.id : "");
        setQtdMovimentacao(1);
        setMotivoMovimentacao("");
        setModalAberto(true);
    };

    const salvarMovimentacao = async () => {
        if (!produtoSelecionado || qtdMovimentacao <= 0) return alert("Preencha os dados corretamente.");

        try {
            const res = await fetch("http://localhost:3000/api/estoque/movimentacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    produto_id: produtoSelecionado,
                    tipo: tipoMovimentacao,
                    quantidade: parseInt(qtdMovimentacao),
                    motivo: motivoMovimentacao,
                    responsavel: "Admin" // Pode pegar do token se quiser
                })
            });

            if (res.ok) {
                alert("Movimentação registrada!");
                setModalAberto(false);
                carregarDados();
            } else {
                alert("Erro ao registrar movimentação.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // Filtros
    const produtosFiltrados = produtos.filter(p => {
        const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
        const matchStatus =
            filtroStatus === "todos" ? true :
                filtroStatus === "baixo" ? p.estoque < p.estoque_minimo && p.estoque > 0 :
                    filtroStatus === "zerado" ? p.estoque <= 0 :
                        filtroStatus === "normal" ? p.estoque >= p.estoque_minimo : true;

        return matchNome && matchStatus;
    });

    return (
        <div className="estoque-tab">
            {/* 1. RESUMO */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <CardResumo titulo="Total Produtos" valor={resumo.total_produtos} cor="#007bff" />
                <CardResumo titulo="Estoque Baixo" valor={resumo.baixo_estoque} cor="#ffc107" />
                <CardResumo titulo="Sem Estoque" valor={resumo.sem_estoque} cor="#dc3545" />
            </div>

            {/* 2. FILTROS E AÇÕES */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                        placeholder="Buscar por nome..."
                        value={filtro} onChange={e => setFiltro(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                    <select
                        value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                        <option value="todos">Todos Status</option>
                        <option value="normal">Normal</option>
                        <option value="baixo">Baixo Estoque</option>
                        <option value="zerado">Sem Estoque</option>
                    </select>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => abrirModal('entrada')} style={{ background: "#28a745", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>+ Entrada</button>
                    <button onClick={() => abrirModal('saida')} style={{ background: "#dc3545", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>- Saída</button>
                </div>
            </div>

            {/* 3. TABELA */}
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                        <th style={{ padding: "1rem" }}>SKU/ID</th>
                        <th style={{ padding: "1rem" }}>Produto</th>
                        <th style={{ padding: "1rem" }}>Categoria</th>
                        <th style={{ padding: "1rem" }}>Fornecedor</th>
                        <th style={{ padding: "1rem" }}>Qtd</th>
                        <th style={{ padding: "1rem" }}>Mín</th>
                        <th style={{ padding: "1rem" }}>Status</th>
                        <th style={{ padding: "1rem" }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtosFiltrados.map(p => {
                        const status = p.estoque <= 0 ? "Zerado" : p.estoque < p.estoque_minimo ? "Baixo" : "Normal";
                        const corStatus = p.estoque <= 0 ? "#dc3545" : p.estoque < p.estoque_minimo ? "#ffc107" : "#28a745";

                        return (
                            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem" }}>{p.sku || `#${p.id}`}</td>
                                <td style={{ padding: "1rem" }}>{p.nome}</td>
                                <td style={{ padding: "1rem" }}>{p.categoria_nome}</td>
                                <td style={{ padding: "1rem" }}>{p.fornecedor || "-"}</td>
                                <td style={{ padding: "1rem", fontWeight: "bold" }}>{p.estoque}</td>
                                <td style={{ padding: "1rem", color: "#666" }}>{p.estoque_minimo}</td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{ background: corStatus, color: "white", padding: "0.2rem 0.6rem", borderRadius: "10px", fontSize: "0.8rem" }}>
                                        {status}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <button onClick={() => abrirModal('entrada', p)} title="Entrada" style={{ marginRight: "5px", cursor: "pointer" }}>📥</button>
                                    <button onClick={() => abrirModal('saida', p)} title="Saída" style={{ cursor: "pointer" }}>📤</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* MODAL DE MOVIMENTAÇÃO */}
            {modalAberto && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "400px" }}>
                        <h3>Registrar {tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'}</h3>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Produto:</label>
                            <select
                                value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                            >
                                <option value="">Selecione...</option>
                                {produtos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Quantidade:</label>
                            <input
                                type="number" min="1"
                                value={qtdMovimentacao} onChange={e => setQtdMovimentacao(e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Motivo:</label>
                            <input
                                type="text" placeholder="Ex: Compra, Venda, Perda..."
                                value={motivoMovimentacao} onChange={e => setMotivoMovimentacao(e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button onClick={() => setModalAberto(false)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Cancelar</button>
                            <button onClick={salvarMovimentacao} style={{ padding: "0.5rem 1rem", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CardResumo({ titulo, valor, cor }) {
    return (
        <div style={{
            flex: 1, padding: "1.5rem", borderRadius: "8px",
            background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: `5px solid ${cor}`
        }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#666" }}>{titulo}</h4>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>{valor}</span>
        </div>
    );
}
