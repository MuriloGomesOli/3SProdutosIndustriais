import React, { useState, useEffect } from "react";

export default function OrcamentosTab() {
    const [orcamentos, setOrcamentos] = useState([]);
    const [stats, setStats] = useState({ pendentes: 0, hoje: 0, comAnexo: 0, respondidasSemana: 0 });
    const [loading, setLoading] = useState(true);

    // Filtros
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [temAnexo, setTemAnexo] = useState(false);

    // Modais
    const [modalDetalhes, setModalDetalhes] = useState(false);
    const [modalResposta, setModalResposta] = useState(false);
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [resposta, setResposta] = useState("");
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        carregarOrcamentos();
    }, [filtroStatus, dataInicio, dataFim, busca, temAnexo]);

    const carregarDados = async () => {
        await Promise.all([carregarStats(), carregarOrcamentos()]);
    };

    const carregarStats = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/orcamentos/stats");
            if (res.ok) setStats(await res.json());
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    };

    const carregarOrcamentos = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroStatus !== "todos") params.append("status", filtroStatus);
            if (dataInicio) params.append("dataInicio", dataInicio);
            if (dataFim) params.append("dataFim", dataFim);
            if (busca) params.append("busca", busca);
            if (temAnexo) params.append("temAnexo", "true");

            const res = await fetch(`http://localhost:3000/api/orcamentos?${params}`);
            if (res.ok) setOrcamentos(await res.json());
        } catch (error) {
            console.error("Erro ao carregar orçamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    const abrirDetalhes = async (orcamento) => {
        setOrcamentoSelecionado(orcamento);

        // Carregar histórico
        try {
            const res = await fetch(`http://localhost:3000/api/orcamentos/${orcamento.id}/historico`);
            if (res.ok) setHistorico(await res.json());
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        }

        setModalDetalhes(true);
    };

    const abrirResposta = (orcamento) => {
        setOrcamentoSelecionado(orcamento);
        setResposta("");
        setModalResposta(true);
    };

    const usarTemplate = (tipo) => {
        const templates = {
            orcamento: `Olá ${orcamentoSelecionado.nome},\n\nObrigado pela sua solicitação de orçamento para ${orcamentoSelecionado.produto_procurado}.\n\nJá estamos analisando sua solicitação e em breve enviaremos os valores detalhados.\n\nAtenciosamente,\nEquipe 3S Produtos Industriais`,
            duvidas: `Olá ${orcamentoSelecionado.nome},\n\nRecebemos sua dúvida sobre ${orcamentoSelecionado.produto_procurado}.\n\nSegue abaixo a explicação:\n\n[INSERIR EXPLICAÇÃO]\n\nQualquer outra dúvida, estamos à disposição!\n\nAtenciosamente,\nEquipe 3S`,
            disponibilidade: `Olá ${orcamentoSelecionado.nome},\n\nSobre a disponibilidade de ${orcamentoSelecionado.produto_procurado}:\n\n[INSERIR DETALHES DE ESTOQUE E PRAZO]\n\nAtenciosamente,\nEquipe 3S`,
            geral: `Olá ${orcamentoSelecionado.nome},\n\nAgradecemos o contato! Recebemos sua solicitação e retornaremos o mais breve possível.\n\nAtenciosamente,\nEquipe 3S`
        };
        setResposta(templates[tipo] || "");
    };

    const enviarResposta = async () => {
        if (!resposta.trim()) return alert("Digite uma resposta!");

        setEnviando(true);
        try {
            const res = await fetch(`http://localhost:3000/api/orcamentos/${orcamentoSelecionado.id}/responder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resposta,
                    respondido_por: "Admin",
                    email_cliente: orcamentoSelecionado.email,
                    assunto: `Resposta: ${orcamentoSelecionado.assunto || 'Sua solicitação'} - 3S`
                })
            });

            if (res.ok) {
                alert("Resposta enviada com sucesso!");
                setModalResposta(false);
                carregarDados();
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

    const mudarStatus = async (id, novoStatus) => {
        try {
            const res = await fetch(`http://localhost:3000/api/orcamentos/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus, usuario: "Admin" })
            });

            if (res.ok) {
                alert("Status atualizado!");
                carregarDados();
                if (modalDetalhes) setModalDetalhes(false);
            }
        } catch (error) {
            console.error("Erro ao mudar status:", error);
        }
    };

    const copiarDados = (orcamento) => {
        const texto = `Nome: ${orcamento.nome}\nEmpresa: ${orcamento.empresa || 'N/A'}\nCNPJ: ${orcamento.cnpj || 'N/A'}\nEmail: ${orcamento.email}\nTelefone: ${orcamento.telefone || 'N/A'}\nProduto: ${orcamento.produto_procurado || 'N/A'}`;
        navigator.clipboard.writeText(texto);
        alert("Dados copiados!");
    };

    const abrirWhatsApp = (telefone, nome) => {
        if (!telefone) return alert("Telefone não disponível");
        const numero = telefone.replace(/\D/g, '');
        const mensagem = encodeURIComponent(`Olá ${nome}, tudo bem? Aqui é da 3S Produtos Industriais...`);
        window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendente': return { bg: '#fff3cd', color: '#856404', emoji: '🔴' };
            case 'em_analise': return { bg: '#fff3e0', color: '#e65100', emoji: '🟡' };
            case 'respondido': return { bg: '#d4edda', color: '#155724', emoji: '🟢' };
            default: return { bg: '#e2e3e5', color: '#383d41', emoji: '⚪' };
        }
    };

    return (
        <div className="orcamentos-tab">
            {/* CARDS DE RESUMO */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.pendentes}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>📩 Pendentes</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.hoje}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>📥 Recebidas Hoje</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.comAnexo}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>📎 Com Anexo</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.respondidasSemana}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>✔ Respondidas (Semana)</div>
                </div>
            </div>

            {/* BARRA DE FILTROS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
                <input
                    placeholder="🔍 Buscar por nome, email, empresa, produto..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    style={{ flex: 1, minWidth: "250px", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" }}
                />

                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={selectStyle}>
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">🔴 Pendentes</option>
                    <option value="em_analise">🟡 Em Análise</option>
                    <option value="respondido">🟢 Respondidos</option>
                </select>

                <input
                    type="date"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                    placeholder="Data Início"
                    style={selectStyle}
                />

                <input
                    type="date"
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                    placeholder="Data Fim"
                    style={selectStyle}
                />

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem", background: "white", borderRadius: "4px", border: "1px solid #ddd", cursor: "pointer" }}>
                    <input type="checkbox" checked={temAnexo} onChange={e => setTemAnexo(e.target.checked)} />
                    Apenas com anexo
                </label>
            </div>

            {/* TABELA */}
            {loading ? <p>Carregando solicitações...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <thead>
                            <tr style={{ background: "#f1f1f1", textAlign: "left", color: "#555" }}>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Nome</th>
                                <th style={thStyle}>Empresa</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Telefone</th>
                                <th style={thStyle}>Produto</th>
                                <th style={thStyle}>Assunto</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Data</th>
                                <th style={thStyle}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orcamentos.map(orc => {
                                const statusStyle = getStatusColor(orc.status);
                                return (
                                    <tr key={orc.id} style={{ borderBottom: "1px solid #eee", background: orc.status === 'pendente' ? '#fffbf0' : 'white' }}>
                                        <td style={tdStyle}>#{orc.id}</td>
                                        <td style={tdStyle}>{orc.nome}</td>
                                        <td style={tdStyle}>{orc.empresa || '-'}</td>
                                        <td style={tdStyle}>{orc.email}</td>
                                        <td style={tdStyle}>{orc.telefone || '-'}</td>
                                        <td style={tdStyle}>{orc.produto_procurado || '-'}</td>
                                        <td style={{ ...tdStyle, maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {orc.assunto || '-'}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: "0.3rem 0.6rem",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                fontWeight: "bold",
                                                background: statusStyle.bg,
                                                color: statusStyle.color
                                            }}>
                                                {statusStyle.emoji} {orc.status.toUpperCase().replace('_', ' ')}
                                            </span>
                                            {orc.anexo && <span style={{ marginLeft: "0.5rem" }}>📎</span>}
                                        </td>
                                        <td style={tdStyle}>{new Date(orc.data_solicitacao).toLocaleDateString()}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button onClick={() => abrirDetalhes(orc)} style={btnPrimaryStyle}>Ver</button>
                                                {orc.status !== 'respondido' && (
                                                    <button onClick={() => abrirResposta(orc)} style={btnSuccessStyle}>Responder</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DE DETALHES */}
            {modalDetalhes && orcamentoSelecionado && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, maxWidth: "900px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem" }}>
                            <h2 style={{ margin: 0 }}>Detalhes da Solicitação #{orcamentoSelecionado.id}</h2>
                            <button onClick={() => setModalDetalhes(false)} style={closeButtonStyle}>&times;</button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                            {/* DADOS DO CLIENTE */}
                            <div>
                                <h3 style={{ marginTop: 0, color: "#333", borderBottom: "2px solid #ff6600", paddingBottom: "0.5rem" }}>👤 Dados do Cliente</h3>
                                <div style={infoBlockStyle}>
                                    <strong>Nome:</strong> {orcamentoSelecionado.nome}<br />
                                    <strong>Cargo:</strong> {orcamentoSelecionado.cargo || 'N/A'}<br />
                                    <strong>Empresa:</strong> {orcamentoSelecionado.empresa || 'N/A'}<br />
                                    <strong>CNPJ:</strong> {orcamentoSelecionado.cnpj || 'N/A'}<br />
                                    <strong>Email:</strong> {orcamentoSelecionado.email}<br />
                                    <strong>Telefone:</strong> {orcamentoSelecionado.telefone || 'N/A'}
                                </div>
                            </div>

                            {/* INFORMAÇÕES COMERCIAIS */}
                            <div>
                                <h3 style={{ marginTop: 0, color: "#333", borderBottom: "2px solid #ff6600", paddingBottom: "0.5rem" }}>💼 Informações Comerciais</h3>
                                <div style={infoBlockStyle}>
                                    <strong>Perfil da Empresa:</strong> {orcamentoSelecionado.perfil_empresa || 'N/A'}<br />
                                    <strong>Produto Procurado:</strong> {orcamentoSelecionado.produto_procurado || 'N/A'}<br />
                                    <strong>Assunto:</strong> {orcamentoSelecionado.assunto || 'N/A'}<br />
                                    <strong>Quer Catálogo:</strong> {orcamentoSelecionado.quer_catalogo ? '✅ Sim' : '❌ Não'}
                                </div>
                            </div>
                        </div>

                        {/* MENSAGEM */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h3 style={{ color: "#333", borderBottom: "2px solid #ff6600", paddingBottom: "0.5rem" }}>💬 Mensagem</h3>
                            <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "6px", whiteSpace: "pre-wrap" }}>
                                {orcamentoSelecionado.mensagem || 'Sem mensagem'}
                            </div>
                        </div>

                        {/* ANEXO */}
                        {orcamentoSelecionado.anexo && (
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ color: "#333", borderBottom: "2px solid #ff6600", paddingBottom: "0.5rem" }}>📎 Anexo</h3>
                                <a
                                    href={`http://localhost:3000/api/orcamentos/${orcamentoSelecionado.id}/anexo`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: "0.6rem 1rem", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px", display: "inline-block" }}
                                >
                                    📥 Baixar Anexo: {orcamentoSelecionado.anexo}
                                </a>
                            </div>
                        )}

                        {/* RESPOSTA (SE RESPONDIDO) */}
                        {orcamentoSelecionado.status === 'respondido' && orcamentoSelecionado.resposta_enviada && (
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ color: "#155724", borderBottom: "2px solid #28a745", paddingBottom: "0.5rem" }}>✉️ Resposta Enviada</h3>
                                <div style={{ background: "#d4edda", padding: "1rem", borderRadius: "6px", borderLeft: "4px solid #28a745" }}>
                                    <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                                        Respondido por {orcamentoSelecionado.respondido_por} em {new Date(orcamentoSelecionado.data_resposta).toLocaleString()}
                                    </div>
                                    <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{orcamentoSelecionado.resposta_enviada}</p>
                                </div>
                            </div>
                        )}

                        {/* HISTÓRICO */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h3 style={{ color: "#333", borderBottom: "2px solid #ff6600", paddingBottom: "0.5rem" }}>📋 Histórico de Interações</h3>
                            <div style={{ maxHeight: "200px", overflowY: "auto", background: "#f8f9fa", padding: "1rem", borderRadius: "6px" }}>
                                {historico.length === 0 ? (
                                    <p style={{ margin: 0, color: "#666" }}>Nenhuma interação registrada</p>
                                ) : (
                                    historico.map(h => (
                                        <div key={h.id} style={{ marginBottom: "0.8rem", paddingBottom: "0.8rem", borderBottom: "1px solid #ddd" }}>
                                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                                {new Date(h.data_acao).toLocaleString()} - <strong>{h.usuario}</strong>
                                            </div>
                                            <div style={{ fontSize: "0.9rem" }}>
                                                <strong>{h.tipo_acao.replace('_', ' ').toUpperCase()}:</strong> {h.descricao}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* AÇÕES RÁPIDAS */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "2px solid #f0f0f0" }}>
                            <button onClick={() => copiarDados(orcamentoSelecionado)} style={btnActionStyle}>📋 Copiar Dados</button>
                            <button onClick={() => abrirWhatsApp(orcamentoSelecionado.telefone, orcamentoSelecionado.nome)} style={btnActionStyle}>💬 WhatsApp</button>
                            {orcamentoSelecionado.status !== 'em_analise' && (
                                <button onClick={() => mudarStatus(orcamentoSelecionado.id, 'em_analise')} style={btnActionStyle}>🟡 Marcar Em Análise</button>
                            )}
                            {orcamentoSelecionado.status !== 'respondido' && (
                                <button onClick={() => { setModalDetalhes(false); abrirResposta(orcamentoSelecionado); }} style={btnSuccessStyle}>✉️ Responder</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE RESPOSTA */}
            {modalResposta && orcamentoSelecionado && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ margin: 0 }}>Responder Solicitação</h2>
                            <button onClick={() => setModalResposta(false)} style={closeButtonStyle}>&times;</button>
                        </div>

                        {/* MENSAGEM ORIGINAL */}
                        <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "6px", marginBottom: "1.5rem", borderLeft: "4px solid #007bff" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                                {orcamentoSelecionado.nome} <span style={{ fontWeight: "normal", color: "#666" }}>&lt;{orcamentoSelecionado.email}&gt;</span>
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: "0.5rem" }}>
                                Assunto: {orcamentoSelecionado.assunto || 'Sem assunto'}
                            </div>
                            <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{orcamentoSelecionado.mensagem}</p>
                        </div>

                        {/* TEMPLATES */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Modelos Rápidos:</label>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                <button onClick={() => usarTemplate('orcamento')} style={btnTemplateStyle}>💰 Orçamento</button>
                                <button onClick={() => usarTemplate('duvidas')} style={btnTemplateStyle}>❓ Dúvidas</button>
                                <button onClick={() => usarTemplate('disponibilidade')} style={btnTemplateStyle}>📦 Disponibilidade</button>
                                <button onClick={() => usarTemplate('geral')} style={btnTemplateStyle}>👋 Geral</button>
                            </div>
                        </div>

                        {/* CAMPO DE RESPOSTA */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Sua Resposta:</label>
                            <textarea
                                value={resposta}
                                onChange={e => setResposta(e.target.value)}
                                rows="10"
                                style={{ width: "100%", padding: "0.8rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "inherit" }}
                                placeholder="Digite sua resposta aqui..."
                            />
                        </div>

                        {/* BOTÕES */}
                        <div style={{ textAlign: "right" }}>
                            <button onClick={() => setModalResposta(false)} style={{ marginRight: "1rem", padding: "0.6rem 1.2rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                            <button
                                onClick={enviarResposta}
                                disabled={enviando}
                                style={{ padding: "0.6rem 1.2rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", opacity: enviando ? 0.7 : 1 }}
                            >
                                {enviando ? "Enviando..." : "Enviar Resposta ✉️"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos
const thStyle = { padding: "1rem", fontWeight: "bold" };
const tdStyle = { padding: "1rem" };
const selectStyle = { padding: "0.6rem", borderRadius: "4px", border: "1px solid #ddd" };
const btnPrimaryStyle = { padding: "0.4rem 0.8rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" };
const btnSuccessStyle = { padding: "0.4rem 0.8rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" };
const btnActionStyle = { padding: "0.5rem 1rem", background: "#e2e6ea", border: "1px solid #dae0e5", borderRadius: "4px", cursor: "pointer", fontSize: "0.9rem" };
const btnTemplateStyle = { padding: "0.4rem 0.8rem", background: "#e2e6ea", border: "1px solid #dae0e5", borderRadius: "20px", cursor: "pointer", fontSize: "0.9rem", color: "#495057" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, overflowY: "auto", padding: "2rem" };
const modalContentStyle = { background: "white", padding: "2rem", borderRadius: "8px", width: "700px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" };
const closeButtonStyle = { background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "#999", lineHeight: 1 };
const infoBlockStyle = { background: "#f8f9fa", padding: "1rem", borderRadius: "6px", lineHeight: "1.8" };
