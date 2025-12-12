import React, { useState, useEffect } from "react";

export default function ContatosTab() {
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [ordem, setOrdem] = useState("recentes"); // recentes, pendentes

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [contatoSelecionado, setContatoSelecionado] = useState(null);
    const [resposta, setResposta] = useState("");
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        carregarContatos();
    }, []);

    const carregarContatos = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/contatos");
            if (res.ok) setContatos(await res.json());
        } catch (error) {
            console.error("Erro ao carregar contatos:", error);
        } finally {
            setLoading(false);
        }
    };

    const abrirModal = (contato) => {
        setContatoSelecionado(contato);
        setResposta(""); // Limpa resposta anterior
        setModalAberto(true);
    };

    const usarTemplate = (tipo) => {
        const templates = {
            orcamento: `Olá ${contatoSelecionado.nome},\n\nObrigado pelo seu pedido de orçamento. Já estamos analisando sua solicitação e em breve enviaremos os valores detalhados.\n\nAtenciosamente,\nEquipe 3S Produtos Industriais`,
            duvidas: `Olá ${contatoSelecionado.nome},\n\nRecebemos sua dúvida técnica. Segue abaixo a explicação:\n\n[INSERIR EXPLICAÇÃO]\n\nQualquer outra dúvida, estamos à disposição!`,
            geral: `Olá ${contatoSelecionado.nome},\n\nAgradecemos o contato! Recebemos sua mensagem e retornaremos o mais breve possível.\n\nAtenciosamente,\nEquipe 3S`,
            disponibilidade: `Olá ${contatoSelecionado.nome},\n\nSobre a disponibilidade dos itens solicitados:\n\n[INSERIR DETALHES]\n\nAtenciosamente,\nEquipe 3S`
        };
        setResposta(templates[tipo] || "");
    };

    const enviarResposta = async () => {
        if (!resposta.trim()) return alert("Digite uma resposta!");

        setEnviando(true);
        try {
            const res = await fetch(`http://localhost:3000/api/contatos/${contatoSelecionado.idcontato}/responder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resposta,
                    respondido_por: "Admin", // Poderia pegar do token JWT
                    email_cliente: contatoSelecionado.email,
                    assunto: "Resposta ao seu contato - 3S"
                })
            });

            if (res.ok) {
                alert("Resposta enviada com sucesso!");
                setModalAberto(false);
                carregarContatos(); // Recarrega lista
            } else {
                alert("Erro ao enviar resposta.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro de conexão.");
        } finally {
            setEnviando(false);
        }
    };

    // Lógica de Filtragem e Ordenação
    const contatosFiltrados = contatos
        .filter(c => {
            const termo = busca.toLowerCase();
            const matchBusca =
                (c.nome && c.nome.toLowerCase().includes(termo)) ||
                (c.email && c.email.toLowerCase().includes(termo)) ||
                (c.mensagem && c.mensagem.toLowerCase().includes(termo)) ||
                (c.idcontato.toString().includes(termo));

            const matchStatus = filtroStatus === "todos" ? true : c.status === filtroStatus;

            return matchBusca && matchStatus;
        })
        .sort((a, b) => {
            if (ordem === "pendentes") {
                // Pendentes primeiro, depois por data
                if (a.status === b.status) return new Date(b.data_contato) - new Date(a.data_contato);
                return a.status === 'pendente' ? -1 : 1;
            }
            // Recentes (padrão)
            return new Date(b.data_contato) - new Date(a.data_contato);
        });

    return (
        <div className="contatos-tab">
            {/* BARRA DE FERRAMENTAS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                    <input
                        placeholder="🔍 Buscar por nome, email, mensagem..."
                        value={busca} onChange={e => setBusca(e.target.value)}
                        style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                </div>

                <select
                    value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendentes</option>
                    <option value="respondido">Respondidos</option>
                </select>

                <select
                    value={ordem} onChange={e => setOrdem(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                    <option value="recentes">Mais Recentes</option>
                    <option value="pendentes">Pendentes Primeiro</option>
                </select>
            </div>

            {/* TABELA */}
            {loading ? <p>Carregando contatos...</p> : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <thead>
                        <tr style={{ background: "#f1f1f1", textAlign: "left", color: "#555" }}>
                            <th style={{ padding: "1rem" }}>ID</th>
                            <th style={{ padding: "1rem" }}>Nome</th>
                            <th style={{ padding: "1rem" }}>Email</th>
                            <th style={{ padding: "1rem" }}>Mensagem</th>
                            <th style={{ padding: "1rem" }}>Data</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contatosFiltrados.map(c => (
                            <tr key={c.idcontato} style={{ borderBottom: "1px solid #eee", background: c.status === 'pendente' ? '#fffbf0' : 'white' }}>
                                <td style={{ padding: "1rem", fontWeight: "bold" }}>#{c.idcontato}</td>
                                <td style={{ padding: "1rem" }}>{c.nome}</td>
                                <td style={{ padding: "1rem" }}>{c.email}</td>
                                <td style={{ padding: "1rem", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#666" }}>
                                    {c.mensagem}
                                </td>
                                <td style={{ padding: "1rem" }}>{new Date(c.data_contato).toLocaleDateString()}</td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold",
                                        background: c.status === 'pendente' ? '#ffeeba' : '#d4edda',
                                        color: c.status === 'pendente' ? '#856404' : '#155724'
                                    }}>
                                        {c.status ? c.status.toUpperCase() : 'PENDENTE'}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <button
                                        onClick={() => abrirModal(c)}
                                        style={{
                                            padding: "0.4rem 0.8rem",
                                            background: c.status === 'respondido' ? '#17a2b8' : '#007bff',
                                            color: "white", border: "none", borderRadius: "4px", cursor: "pointer"
                                        }}
                                    >
                                        {c.status === 'respondido' ? 'Ver Resposta' : 'Responder'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL DE RESPOSTA */}
            {modalAberto && contatoSelecionado && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                    <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "700px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ margin: 0 }}>
                                {contatoSelecionado.status === 'respondido' ? 'Detalhes do Contato' : 'Responder Contato'}
                            </h2>
                            <button onClick={() => setModalAberto(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                        </div>

                        {/* MENSAGEM ORIGINAL */}
                        <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "6px", marginBottom: "1.5rem", borderLeft: "4px solid #007bff" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                                {contatoSelecionado.nome} <span style={{ fontWeight: "normal", color: "#666" }}>&lt;{contatoSelecionado.email}&gt;</span>
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: "0.5rem" }}>
                                {new Date(contatoSelecionado.data_contato).toLocaleString()}
                            </div>
                            <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{contatoSelecionado.mensagem}</p>
                        </div>

                        {/* SE JÁ RESPONDIDO, MOSTRA HISTÓRICO */}
                        {contatoSelecionado.status === 'respondido' ? (
                            <div style={{ background: "#d4edda", padding: "1rem", borderRadius: "6px", borderLeft: "4px solid #28a745" }}>
                                <div style={{ fontWeight: "bold", color: "#155724", marginBottom: "0.5rem" }}>
                                    Respondido por {contatoSelecionado.respondido_por || 'Admin'} em {new Date(contatoSelecionado.data_resposta).toLocaleString()}
                                </div>
                                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{contatoSelecionado.resposta}</p>
                            </div>
                        ) : (
                            /* SE PENDENTE, MOSTRA FORMULÁRIO */
                            <>
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Modelos Rápidos:</label>
                                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                        <button onClick={() => usarTemplate('orcamento')} style={btnTemplateStyle}>💰 Orçamento</button>
                                        <button onClick={() => usarTemplate('duvidas')} style={btnTemplateStyle}>❓ Dúvidas Técnicas</button>
                                        <button onClick={() => usarTemplate('disponibilidade')} style={btnTemplateStyle}>📦 Disponibilidade</button>
                                        <button onClick={() => usarTemplate('geral')} style={btnTemplateStyle}>👋 Geral</button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Sua Resposta:</label>
                                    <textarea
                                        value={resposta}
                                        onChange={e => setResposta(e.target.value)}
                                        rows="8"
                                        style={{ width: "100%", padding: "0.8rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "inherit" }}
                                        placeholder="Digite sua resposta aqui..."
                                    />
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <button onClick={() => setModalAberto(false)} style={{ marginRight: "1rem", padding: "0.6rem 1.2rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                                    <button
                                        onClick={enviarResposta}
                                        disabled={enviando}
                                        style={{ padding: "0.6rem 1.2rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", opacity: enviando ? 0.7 : 1 }}
                                    >
                                        {enviando ? "Enviando..." : "Enviar Resposta ✉️"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const btnTemplateStyle = {
    padding: "0.4rem 0.8rem",
    background: "#e2e6ea",
    border: "1px solid #dae0e5",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#495057"
};
