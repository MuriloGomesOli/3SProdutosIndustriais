import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../assets/3S/logopreta.jpeg";

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [ofertas, setOfertas] = useState([]);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    nome: "",
    email: "",
    mensagem: ""
  });

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        alert("Mensagem enviada com sucesso!");
        setContactForm({ nome: "", email: "", mensagem: "" });
      } else {
        alert("Erro ao enviar mensagem.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão.");
    }
  };

  // Categories list
  const categorias = [
    { id: 7, nome: "Válvulas", icon: "fas fa-filter" },
    { id: 1, nome: "Fixação", icon: "fas fa-solid fa-network-wired" },
    { id: 2, nome: "Conexões", icon: "fas fa-project-diagram" },
    { id: 3, nome: "Siderúrgicos", icon: "fas fa-industry" },
    { id: 4, nome: "Metais Não Ferrosos", icon: "fas fa-layer-group" },
    { id: 5, nome: "Vedação Industrial", icon: "fas fa-ring" },
    { id: 6, nome: "Plástico", icon: "fas fa-cube" },
  ];

  // Segments list
  const segmentos = [
    { nome: "Construção Civil", icon: "fas fa-building" },
    { nome: "Indústrias", icon: "fas fa-cogs" },
    { nome: "Logística", icon: "fas fa-truck-loading" },
    { nome: "Energia", icon: "fas fa-bolt" },
    { nome: "Saneamento", icon: "fas fa-water" },
  ];

  useEffect(() => {
    // Fetch products for "Destaques" and "Ofertas"
    fetch("http://localhost:3000/api/produtos")
      .then(res => res.json())
      .then(data => {
        setDestaques(data.slice(0, 4));
        setOfertas(data);
      })
      .catch(err => console.error("Erro ao buscar produtos:", err));
  }, []);

  return (
    <div className="home-container">
      {/* Top Bar / Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="3S Produtos Industriais" style={{ height: '60px', paddingTop: '10px', paddingLeft: '80px' }} />
            </Link>
          </div>
          <nav className="main-nav">
            <Link to="/produtos" className="nav-link">PRODUTOS</Link>
            <Link to="/sobre" className="nav-link">SOBRE</Link>
            <a href="#contato" className="nav-link">CONTATO</a>
          </nav>
        </div>
      </header>

      <main className="content-area-full">
        {/* 1. Hero Banner */}
        <section className="hero-banner-b2b animate-fade-in">
          <div className="banner-text">
            <h1>Soluções industriais para construção, energia e infraestrutura.</h1>
            <div className="banner-buttons">
              {/* Login Link Removed */}
              <a href="#contato" className="cta-button secondary">Fale Conosco</a>
            </div>
          </div>
        </section>

        {/* 2. Segmentos */}
        <section className="segments-section animate-fade-in delay-1">
          <h2>Setores Atendidos</h2>
          <div className="segments-grid">
            {segmentos.map((seg, idx) => (
              <div key={idx} className="segment-card">
                <i className={seg.icon}></i>
                <p>{seg.nome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Categorias de Produtos */}
        <section className="categories-section animate-fade-in delay-2">
          <h2>Nossos Produtos</h2>
          <div className="categories-grid">
            {categorias.map(cat => (
              <Link key={cat.id} to={`/produtos?cat=${cat.id}`} className="category-card">
                <i className={cat.icon}></i>
                <h3>{cat.nome}</h3>
                <span>Ver categoria</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Destaques da Semana (Carousel) */}
        <section className="highlights-section animate-fade-in delay-3">
          <h2>Destaques da Semana</h2>
          <div className="carousel-container">
            <div className="carousel-track">
              {/* Duplicate products for infinite scroll effect */}
              {destaques.concat(destaques).map((prod, idx) => (
                <div key={`${prod.id}-${idx}`} className="carousel-card-b2b">
                  <img src={prod.imagem || "https://via.placeholder.com/150"} alt={prod.nome} />
                  <div className="prod-info">
                    <h3>{prod.nome}</h3>
                    <p className="price">R$ {prod.preco}</p>
                    <Link to={`/produto/${prod.id}`} className="btn-details">Ver Detalhes</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Diferenciais */}
        <section className="differentials-section animate-fade-in delay-1">
          <div className="differential-item">
            <i className="fas fa-shipping-fast"></i>
            <h3>Entrega Rápida</h3>
            <p>Logística eficiente para todo o Brasil.</p>
          </div>
          <div className="differential-item">
            <i className="fas fa-tools"></i>
            <h3>Suporte Técnico</h3>
            <p>Especialistas prontos para ajudar.</p>
          </div>
          <div className="differential-item">
            <i className="fas fa-boxes"></i>
            <h3>Alta Disponibilidade</h3>
            <p>Estoque robusto para grandes pedidos.</p>
          </div>
          <div className="differential-item">
            <i className="fas fa-certificate"></i>
            <h3>Certificações</h3>
            <p>Produtos com garantia de qualidade.</p>
          </div>
        </section>

        {/* 6. Fale Conosco (New Section) */}
        <section id="contato" className="fale-conosco-section">
          <div className="fale-conosco-container">
            <div className="fale-conosco-info">
              <h2>FALE<br />CONOSCO</h2>
              <div className="info-item">
                <i className="fas fa-phone-alt"></i>
                <p>11 97844.7675 </p>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <p>vendas@comercial3s.com.br</p>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <p>
                  R. Elias Nagem Haidamus, 204 - Sacomã<br />
                  São Paulo - SP, 04240030
                </p>
              </div>
            </div>

            <div className="fale-conosco-form">
              <h3>Quer falar com a gente? Envie sua mensagem por aqui!</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Seu nome"
                    value={contactForm.nome}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Digite sua mensagem aqui...</label>
                  <textarea
                    rows="4"
                    name="mensagem"
                    placeholder="Sua mensagem"
                    value={contactForm.mensagem}
                    onChange={handleContactChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-enviar">Enviar</button>
              </form>
            </div>
          </div>
        </section>

        {/* 7. Marcas Parceiras */}
        <section className="partners-section">
          <h2>Marcas Parceiras</h2>
          <div className="partners-grid">
            {/* Placeholders for logos */}
            <div className="partner-logo">Logo 1</div>
            <div className="partner-logo">Logo 2</div>
            <div className="partner-logo">Logo 3</div>
            <div className="partner-logo">Logo 4</div>
            <div className="partner-logo">Logo 5</div>
          </div>
        </section>

        {/* 8. Sobre a Empresa */}
        <section className="about-summary-section">
          <div className="about-content">
            <h2>Sobre a 3S Produtos Industriais</h2>
            <p>
              Há mais de 10 anos no mercado, a 3S é referência no fornecimento de materiais industriais de alta performance.
              Nossa missão é garantir que sua operação nunca pare, oferecendo produtos de qualidade com agilidade e transparência.
            </p>
            <Link to="/sobre" className="btn-text">Saiba mais sobre nós &rarr;</Link>
          </div>
        </section>
      </main>

      {/* 9. Rodapé Completo */}
      <footer className="main-footer-b2b">
        <div className="footer-cols">
          <div className="footer-col">
            <h4>3S Produtos Industriais</h4>
            <p>CNPJ: 00.000.000/0001-00</p>
            <p>11 97844.7675 </p>
          </div>
          <div className="footer-col">
            <h4>Atendimento</h4>
            <p>Seg a Sex: 08h às 18h</p>
            <p>vendas@comercial3s.com.br</p>
          </div>
          <div className="footer-col">
            <h4>Links Úteis</h4>
            <Link to="/sobre">Quem Somos</Link>
            <Link to="/politica">Política de Privacidade</Link>
          </div>
          <div className="footer-col">
            <h4>Redes Sociais</h4>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-facebook"></i>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 3S Produtos Industriais. Todos os direitos reservados.</p>
          <div style={{ marginTop: '10px' }}>
            <Link to="/admin/login" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>Área do Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

