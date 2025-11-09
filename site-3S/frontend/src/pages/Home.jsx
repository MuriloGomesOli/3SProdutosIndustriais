import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const categorias = [
    { id: 1, nome: "Fixação", img: "https://images.unsplash.com/photo-1581092333153-0d0f0fbd9d47?auto=format&fit=crop&w=800&q=80" },
    { id: 2, nome: "Conexões", img: "https://images.unsplash.com/photo-1602524818230-3cfd5c9b3b8d?auto=format&fit=crop&w=800&q=80" },
    { id: 3, nome: "Siderúrgicos", img: "https://images.unsplash.com/photo-1581091215361-d0d6e6d3bfa8?auto=format&fit=crop&w=800&q=80" },
    { id: 4, nome: "Metais", img: "https://images.unsplash.com/photo-1581091215363-efb1e01df7f1?auto=format&fit=crop&w=800&q=80" },
    { id: 5, nome: "Vedação", img: "https://images.unsplash.com/photo-1602524818254-0d0f0fbd9d47?auto=format&fit=crop&w=800&q=80" },
    { id: 6, nome: "Plástico", img: "https://images.unsplash.com/photo-1592289867202-7b183d057eb2?auto=format&fit=crop&w=800&q=80" },
  ];

  const [showRightMenu, setShowRightMenu] = useState(false);

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", position: "relative" }}>
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


      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #2c2c2c 0%, #555555 100%)",
        color: "#fff", textAlign: "center", padding: "6rem 2rem", margin: "2rem",
        borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
      }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800" }}>Bem-vindo à 3S Produtos Industriais</h1>
        <p style={{ fontSize: "1.2rem", color: "#ddd" }}>Soluções de qualidade para a sua indústria</p>
        <button style={{
          backgroundColor: "#ff6600", color: "#fff", border: "none", padding: "0.75rem 2rem",
          fontSize: "1.1rem", cursor: "pointer", borderRadius: "6px", fontWeight: "bold", boxShadow: "0 5px 15px rgba(255,102,0,0.3)"
        }}>Saiba Mais</button>
      </section>

      {/* Categorias */}
      <section style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem", padding: "0 2rem", marginBottom: "6rem"
      }}>
        {categorias.map(cat => (
          <Link key={cat.id} to={`/produtos/${cat.id}`} style={{
            position: "relative", height: "200px", borderRadius: "14px", overflow: "hidden",
            display: "flex", alignItems: "flex-end", color: "#fff", textDecoration: "none",
            fontSize: "1.3rem", fontWeight: "700", backgroundImage: `url(${cat.img})`,
            backgroundSize: "cover", backgroundPosition: "center", transition: "transform 0.3s, box-shadow 0.3s",
            boxShadow: "0 5px 15px rgba(0,0,0,0.15)"
          }} className="category-box">
            <div style={{
              position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)",
              transition: "background 0.3s"
            }} className="overlay"></div>
            <div style={{ position: "relative", width: "100%", textAlign: "center", paddingBottom: "20px" }}>{cat.nome}</div>
          </Link>
        ))}
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
    <Link to="/admin">Admin</Link>
  </div>
</div>
    </div>);
}

const iconBtnStyle = {
  fontSize: "1.5rem", marginLeft: "15px", background: "none", border: "none", cursor: "pointer", color: "#fff",
  transition: "color 0.3s, transform 0.2s"
};

const rightMenuLink = {
  color: "#fff",
  textDecoration: "none",
  padding: "1rem",
  fontWeight: "bold",
  transition: "color 0.3s",
  cursor: "pointer"
};
