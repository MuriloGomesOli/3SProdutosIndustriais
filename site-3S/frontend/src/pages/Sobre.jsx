import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sobre() {
  const [showRightMenu, setShowRightMenu] = useState(false);

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", position: "relative", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Top bar */}
      <header className="top-bar">
        <div className="logo">3S Produtos Industriais</div>

        <div className="actions">
          {/* Input de pesquisa */}
          <input
            type="text"
            placeholder="Pesquisar produto..."
            className="search-input"
          />

          {/* Ícones usando Font Awesome */}
          <button className="icon-btn">
            <i className="fas fa-heart"></i>
          </button>
          <button className="icon-btn">
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </header>

      {/* Conteúdo Quem Somos */}
      <section style={{
        background: "linear-gradient(135deg, #2c2c2c 0%, #555555 100%)",
        color: "#fff", padding: "4rem 2rem", margin: "2rem",
        borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2rem" }}>
          <div style={{ flex: "1 1 400px" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1.5rem" }}>Quem Somos</h1>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#ddd", marginBottom: "1rem" }}>
              A 3S Produtos Industriais é referência no fornecimento de soluções para a indústria.
              Com anos de experiência no mercado, nos dedicamos a oferecer produtos de alta qualidade,
              como fixadores, conexões, siderúrgicos, metais, vedações e plásticos industriais.
            </p>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#ddd" }}>
              Nossa missão é garantir a satisfação de nossos clientes através de um atendimento de excelência
              e produtos que atendem aos mais rigorosos padrões de qualidade. Estamos prontos para ser o seu
              parceiro estratégico no crescimento do seu negócio.
            </p>
          </div>
          <div style={{ flex: "1 1 400px" }}>
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
              alt="Indústria"
              style={{ width: "100%", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
            />
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer style={{
        width: "100%", background: "#1a1a1a", color: "#fff", textAlign: "center",
        padding: "1.5rem 0", position: "fixed", bottom: 0, left: 0, fontSize: "0.9rem"
      }}>
        3S Produtos Industriais © 2025 | Email: contato@3sind.com | Tel: (11) 99999-9999 | Rua Industrial, 123, São Paulo - SP
      </footer>

      {/* Menu lateral direito */}
      <div
        className={`right-menu ${showRightMenu ? "show" : ""}`}
        onMouseEnter={() => setShowRightMenu(true)}
        onMouseLeave={() => setShowRightMenu(false)}
      >
        {/* Links do menu */}
        <div className="menu-links">
          <Link to="/">Home</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </div>

        {/* Botão Admin fixo embaixo */}
        <div className="admin-btn">
          <Link to="/admin/login">Admin</Link>
        </div>
      </div>
    </div>
  );
}
