import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Ensure CSS is imported

export default function Home() {
  const [showRightMenu, setShowRightMenu] = useState(false);
  const [destaques, setDestaques] = useState([]);
  const [ofertas, setOfertas] = useState([]);

  // Categories list with sub-items as requested
  const categorias = [
    { id: 7, nome: "Válvulas", sub: ["Esfera", "Gaveta", "Globo", "Retenção", "Borboleta"] },
    { id: 1, nome: "Fixação", sub: ["Parafuso", "Arruelas", "Barra Roscada", "Buchas", "Chumbador", "Escapula", "Gancho", "Pregos"] },
    { id: 2, nome: "Conexões", sub: ["Flange", "Curvas", "Teg", "Cotovelos", "Cruzetas", "Conectores", "Luvas"] },
    { id: 3, nome: "Siderúrgicos", sub: ["Materiais Siderúrgicos"] },
    { id: 4, nome: "Metais Não Ferrosos", sub: ["Latão", "Cobre", "Alumínio", "Bronze", "Inox"] },
    { id: 5, nome: "Vedação Industrial", sub: ["Juntas", "Expansão", "Papelão Hidr.", "Isolação", "Fitas", "Graxetas"] },
    { id: 6, nome: "Plástico", sub: ["Placas", "Tarugos", "Tubos", "Películas", "Barras", "Usinados"] },
  ];

  useEffect(() => {
    // Fetch products for "Destaques" and "Ofertas"
    fetch("http://localhost:3000/api/produtos")
      .then(res => res.json())
      .then(data => {
        setDestaques(data.slice(0, 4)); // Show first 4 as highlights
        setOfertas(data); // All products for carousel
      })
      .catch(err => console.error("Erro ao buscar produtos:", err));
  }, []);

  return (
    <div className="home-container">
      {/* Top Bar / Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">3S Produtos Industriais</div>
          <div className="search-bar">
            <input type="text" placeholder="Buscar produtos, marcas e muito mais..." />
            <button><i className="fas fa-search"></i></button>
          </div>
          <div className="header-actions">
            <Link to="/login" className="header-link">Contato</Link>
            <Link to="/sobre" className="header-link">Quem Somos</Link>
            <Link to="/login" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Banner */}
      <div className="main-layout">
        <aside className="categories-sidebar">
          <h3>Categorias</h3>
          <ul>
            {categorias.map(cat => (
              <li key={cat.id} className="cat-item">
                <Link to={`/produtos?cat=${cat.id}`} className="cat-link">
                  {cat.nome}
                  <i className="fas fa-chevron-right"></i>
                </Link>
                {/* Hover Menu for Sub-items */}
                <div className="sub-menu">
                  <h4>{cat.nome}</h4>
                  <ul>
                    {cat.sub.map((sub, idx) => (
                      <li key={idx}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content-area">
          {/* Hero Banner */}
          <section className="hero-banner">
            <div className="banner-text">
              <h1>Soluções Industriais de Alta Performance</h1>
              <p>Qualidade e confiança para sua empresa.</p>
              <Link to="/produtos" className="cta-button">Ver Ofertas</Link>
            </div>
          </section>

          {/* Ofertas Carousel - Auto-scrolling */}
          <section className="ofertas-section">
            <h2>🔥 Ofertas Especiais</h2>
            <div className="carousel-container">
              <div className="carousel-track">
                {/* Duplicate products for infinite scroll effect */}
                {ofertas.concat(ofertas).map((prod, idx) => (
                  <div key={`${prod.id}-${idx}`} className="carousel-card">
                    <img src={prod.imagem || "https://via.placeholder.com/150"} alt={prod.nome} />
                    <div className="prod-info">
                      <h3>{prod.nome}</h3>
                      <p className="price">R$ {prod.preco}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Destaques */}
          <section className="highlights">
            <h2>Destaques</h2>
            <div className="products-grid">
              {destaques.length > 0 ? destaques.map(prod => (
                <div key={prod.id} className="product-card-mini">
                  <img src={prod.imagem || "https://via.placeholder.com/150"} alt={prod.nome} />
                  <div className="prod-info">
                    <h3>{prod.nome}</h3>
                    <p className="price">R$ {prod.preco}</p>
                  </div>
                </div>
              )) : <p>Carregando destaques...</p>}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <p>© 2025 3S Produtos Industriais. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
