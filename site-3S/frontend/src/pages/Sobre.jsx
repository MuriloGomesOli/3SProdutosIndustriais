import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./Sobre.css";
import logo from "../assets/3S/logopreta.jpeg";


export default function Sobre() {
  return (
    <div className="about-page">
      {/* Header */}
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
            <Link to="/#contato" className="nav-link">CONTATO</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* 1. Apresentação Clara */}
        <section className="about-hero animate-fade-in">
          <div className="about-hero-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', textAlign: 'left' }}>
            <div>
              <h1>Quem Somos</h1>
              <p className="lead">
                A 3S Produtos Industriais é uma empresa com foco inovador, que visa atender a necessidade das indústrias em diversos segmentos; com expertise no relacionamento B2B, consegue atuar nas adversidades apresentadas pelos clientes!
              </p>
            </div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                alt="Armazém Industrial"
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </section>

        {/* NOSSOS 3 PILARES (New Section) */}
        {/* NOSSOS 3 PILARES */}
        {/* NOSSOS 3 PILARES */}
        <section className="pillars-section animate-fade-in delay-1">
          <h2>Nossos 3 Pilares</h2>
          <div className="pillars-grid">
            <div className="pillar-card">
              <i className="fas fa-heart"></i>
              <h3>Mente, Família, Qualidade de Vida</h3>
            </div>
            <div className="pillar-card">
              <i className="fas fa-book-reader"></i>
              <h3>Estudo, Tecnologia, Treinamento</h3>
            </div>
            <div className="pillar-card">
              <i className="fas fa-handshake"></i>
              <h3>Relacionamento, Investimento, Empreendedorismo</h3>
            </div>
          </div>
        </section>

        {/* 2. Missão, Visão e Valores */}
        <section className="mission-values-section animate-fade-in delay-2">
          <div className="mvv-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="mvv-image">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                alt="Reunião de Negócios"
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
            <div className="mvv-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div className="mvv-card">
                <i className="fas fa-bullseye"></i>
                <h3>Missão</h3>
                <p>Atender e entender os clientes e juntos encontrarem uma solução ideal para as necessidades adversas; bem como trabalhar em alta performance, mantendo sempre a ética e desenvolvimento contínuo!</p>
              </div>
              <div className="mvv-card">
                <i className="fas fa-eye"></i>
                <h3>Visão</h3>
                <p>Oferecer o melhor atendimento para as indústrias e empresas de diversos segmentos através dos produtos e tecnologia!</p>
              </div>
              <div className="mvv-card">
                <i className="fas fa-gem"></i>
                <h3>Valor</h3>
                <p>Respeito, Visão de Empreendedorismo, Profissionalismo, Responsabilidade Social</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. História (Timeline) */}
        <section className="history-section">
          <h2>Nossa História</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="year">2022</div>
              <div className="content">
                <h3>Fundação</h3>
                <p>Início das operações da 3S Produtos Industriais.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="year">2023</div>
              <div className="content">
                <h3>Crescimento</h3>
                <p>Expansão da carteira de clientes e portfólio.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="year">2024</div>
              <div className="content">
                <h3>Consolidação</h3>
                <p>Fortalecimento da marca no mercado B2B.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Nossos Diferenciais (Kept as it wasn't asked to be removed, but simplified if needed. Keeping generic structure for now) */}
        <section className="differentials-list-section">
          <h2>Por que a 3S?</h2>
          <div className="diff-grid">
            <div className="diff-item"><i className="fas fa-check-circle"></i> Foco Inovador</div>
            <div className="diff-item"><i className="fas fa-check-circle"></i> Expertise B2B</div>
            <div className="diff-item"><i className="fas fa-check-circle"></i> Soluções Personalizadas</div>
            <div className="diff-item"><i className="fas fa-check-circle"></i> Atendimento Consultivo</div>
          </div>
        </section>

        {/* 6. Estrutura da Empresa (Kept) */}
        <section className="structure-section">
          <h2>Nossa Estrutura</h2>
          <div className="structure-grid">
            <div className="structure-card">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Escritório" />
              <h3>Escritório Central</h3>
              <p>Equipe preparada para atender suas demandas.</p>
            </div>
          </div>
        </section>

        {/* Marcas Parceiras - Added for visibility */}
        <section className="partners-section" style={{ padding: '4rem 2rem', background: 'white' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: '#333' }}>Nossos Parceiros</h2>
          <div className="partners-grid" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {/* Using the logo we have as placeholder for partners for now, or text if preferred. 
                 User asked for "logos", so I'll put some placeholders styled as logos. */}
            <div className="partner-logo" style={{ padding: '2rem', border: '2px solid #eee', borderRadius: '12px' }}>Parceiro 1</div>
            <div className="partner-logo" style={{ padding: '2rem', border: '2px solid #eee', borderRadius: '12px' }}>Parceiro 2</div>
            <div className="partner-logo" style={{ padding: '2rem', border: '2px solid #eee', borderRadius: '12px' }}>Parceiro 3</div>
            <div className="partner-logo" style={{ padding: '2rem', border: '2px solid #eee', borderRadius: '12px' }}>Parceiro 4</div>
          </div>
        </section>

        {/* 8. Equipe de Liderança */}
        <section className="team-section">
          <h2>Liderança</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="avatar"></div>
              <h4>Manoel Custódio</h4>
              <p>Líder / Fundador</p>
            </div>
            <div className="team-member">
              <div className="avatar"></div>
              <h4>Rosangela Gomes</h4>
              <p>Líder / Fundadora</p>
            </div>
          </div>
        </section>

        {/* 10. CTA Final */}
        <section className="final-cta-section">
          <h2>Entre em contato</h2>
          <p>Estamos prontos para atender sua empresa.</p>
          <div className="contact-details-highlight">
            <p><i className="fab fa-whatsapp"></i> 11 97844.7675</p>
            <p><i className="fas fa-envelope"></i> vendas@comercial3s.com.br</p>
          </div>
          <div className="cta-buttons">
            <Link to="/contato" className="btn-primary">Falar com Consultor</Link>
          </div>
        </section>
      </main>

      <footer className="main-footer-b2b">
        <p>© 2025 3S Produtos Industriais. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
