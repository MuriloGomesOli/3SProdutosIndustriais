import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EstoqueTab from "../components/EstoqueTab";
import PedidosTab from "../components/PedidosTab";
import ContatosTab from "../components/ContatosTab";
import OrcamentosTab from "../components/OrcamentosTab";
import "../App.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("pedidos");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className="admin-dashboard" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Painel Administrativo</h1>
                <button onClick={logout} style={{ padding: "0.5rem 1rem", background: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Sair</button>
            </header>

            <div className="admin-tabs" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
                <button
                    onClick={() => setActiveTab("pedidos")}
                    style={{
                        padding: "0.8rem 1.5rem",
                        background: activeTab === "pedidos" ? "#ff6600" : "#f0f0f0",
                        color: activeTab === "pedidos" ? "white" : "#333",
                        border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    Pedidos
                </button>
                <button
                    onClick={() => setActiveTab("contatos")}
                    style={{
                        padding: "0.8rem 1.5rem",
                        background: activeTab === "contatos" ? "#ff6600" : "#f0f0f0",
                        color: activeTab === "contatos" ? "white" : "#333",
                        border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    Contatos Rápidos
                </button>
                <button
                    onClick={() => setActiveTab("orcamentos")}
                    style={{
                        padding: "0.8rem 1.5rem",
                        background: activeTab === "orcamentos" ? "#ff6600" : "#f0f0f0",
                        color: activeTab === "orcamentos" ? "white" : "#333",
                        border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    Solicitações de Orçamento
                </button>
                <button
                    onClick={() => setActiveTab("estoque")}
                    style={{
                        padding: "0.8rem 1.5rem",
                        background: activeTab === "estoque" ? "#ff6600" : "#f0f0f0",
                        color: activeTab === "estoque" ? "white" : "#333",
                        border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    Controle de Estoque
                </button>
            </div>

            {loading ? (
                <p>Carregando dados...</p>
            ) : (
                <div className="tab-content">
                    {/* ABA PEDIDOS */}
                    {activeTab === "pedidos" && (
                        <PedidosTab />
                    )}

                    {/* ABA CONTATOS */}
                    {activeTab === "contatos" && (
                        <ContatosTab />
                    )}

                    {/* ABA ORÇAMENTOS */}
                    {activeTab === "orcamentos" && (
                        <OrcamentosTab />
                    )}

                    {/* ABA ESTOQUE */}
                    {activeTab === "estoque" && (
                        <EstoqueTab />
                    )}
                </div>
            )}
        </div>
    );
}
