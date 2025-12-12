import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../assets/3S/logopreta.jpeg";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    cnpj: "",
    cargo: "",
    email: "",
    telefone: "",
    assunto: "orcamento",
    mensagem: "",
    tipoCliente: "",
    produtoInteresse: "",
    receberCatalogo: false,
    arquivo: null
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Criar FormData para suportar upload de arquivo
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("empresa", formData.empresa);
      formDataToSend.append("cnpj", formData.cnpj);
      formDataToSend.append("cargo", formData.cargo);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telefone", formData.telefone);
      formDataToSend.append("assunto", formData.assunto);
      formDataToSend.append("mensagem", formData.mensagem);

      // Mapear campos para os nomes esperados pelo backend
      formDataToSend.append("perfil_empresa", formData.tipoCliente);
      formDataToSend.append("produto_procurado", formData.produtoInteresse);
      formDataToSend.append("quer_catalogo", formData.receberCatalogo ? "1" : "0");

      // Adicionar arquivo se existir
      if (formData.arquivo) {
        formDataToSend.append("anexo", formData.arquivo);
      }

      const response = await fetch("http://localhost:3000/api/orcamentos", {
        method: "POST",
        body: formDataToSend
      });

      if (response.ok) {
        setEnviado(true);
        window.scrollTo(0, 0);
      } else {
        alert("Erro ao enviar mensagem. Tente novamente.");
      }
    } catch (erro) {
      console.error("Erro ao enviar contato:", erro);
      alert("Erro de conexão com o servidor.");
    }
  };

  if (enviado) {
    return (
      <div className="contato-sucesso-container">
        <div className="sucesso-card">
          <i className="fas fa-check-circle"></i>
          <h2>Recebemos sua solicitação!</h2>
          <p>Obrigado pelo contato, <strong>{formData.nome}</strong>.</p>
          <p>Nossa equipe comercial responderá em até <strong>24h úteis</strong>.</p>
          <p>Um e-mail de confirmação foi enviado para <strong>{formData.email}</strong>.</p>
          <button onClick={() => setEnviado(false)} className="btn-voltar">Voltar ao site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="b2b-contact-page">
      {/* Header da Página */}
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

      <main className="contact-main">
        <div className="contact-grid">
          {/* Coluna da Esquerda: Informações e Diferenciais */}
          <div className="contact-info-col">
            <section className="info-block">
              <h2>Fale com um Especialista</h2>
              <p>Estamos prontos para atender sua indústria com agilidade e precisão.</p>

              <div className="contact-methods">
                <div className="method">
                  <i className="fab fa-whatsapp"></i>
                  <div>
                    <h4>WhatsApp Comercial</h4>
                    <p>(11) 97844-7675</p>
                  </div>
                </div>
                <div className="method">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h4>Telefone Fixo</h4>
                    <p>(11) 3333-3333</p>
                  </div>
                </div>
                <div className="method">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>E-mail de Vendas</h4>
                    <p>vendas@comercial3s.com.br</p>
                  </div>
                </div>
                <div className="method">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Endereço</h4>
                    <p>R. Elias Nagem Haidamus, 204 - Sacomã</p>
                  </div>
                </div>
                <div className="method">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h4>Horário de Atendimento</h4>
                    <p>Seg a Sex: 08h às 18h</p>
                  </div>
                </div>
              </div>

              <a href="https://wa.me/5511978447675" target="_blank" rel="noreferrer" className="btn-whatsapp-full">
                <i className="fab fa-whatsapp"></i> Falar com consultor agora
              </a>


            </section>
            <div className="cta-item">
              <i className="fas fa-file-pdf"></i>
              <h4>Catálogo Completo</h4>
              <button>Baixar PDF</button>
            </div>
          </div>

          {/* Coluna da Direita: Formulário B2B */}
          <div className="contact-form-col">
            <div className="form-card">
              <h2>Solicite um Orçamento</h2>
              <p>Preencha o formulário abaixo para receber uma cotação personalizada.</p>

              <form onSubmit={handleSubmit} className="b2b-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input type="text" name="nome" required value={formData.nome} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Cargo / Função</label>
                    <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Empresa *</label>
                    <input type="text" name="empresa" required value={formData.empresa} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>CNPJ</label>
                    <input type="text" name="cnpj" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-mail Corporativo *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Telefone / WhatsApp *</label>
                    <input type="text" name="telefone" required value={formData.telefone} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Perfil da Empresa *</label>
                  <select name="tipoCliente" required value={formData.tipoCliente} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    <option value="industria">Indústria</option>
                    <option value="distribuidora">Distribuidora</option>
                    <option value="revenda">Revenda</option>
                    <option value="integrador">Integrador</option>
                    <option value="corporativo">Consumidor Corporativo</option>
                    <option value="governo">Governo / Licitação</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Qual produto você procura?</label>
                  <input type="text" name="produtoInteresse" placeholder="Ex: Válvula Esfera, Parafusos..." value={formData.produtoInteresse} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Assunto</label>
                  <select name="assunto" value={formData.assunto} onChange={handleChange}>
                    <option value="orcamento">Solicitar Orçamento</option>
                    <option value="comercial">Falar com Comercial</option>
                    <option value="duvida">Dúvida Técnica</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mensagem</label>
                  <textarea name="mensagem" rows="4" value={formData.mensagem} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label>Anexar Arquivo (Lista de produtos, projeto, etc)</label>
                  <input type="file" name="arquivo" onChange={handleChange} />
                </div>

                <div className="form-check">
                  <input type="checkbox" id="catalogo" name="receberCatalogo" checked={formData.receberCatalogo} onChange={handleChange} />
                  <label htmlFor="catalogo">Quero receber o catálogo técnico digital</label>
                </div>

                <button type="submit" className="btn-submit">Enviar Solicitação</button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="contact-footer">
        <p>© 2025 3S Produtos Industriais. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
