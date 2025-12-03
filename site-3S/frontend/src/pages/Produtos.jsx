import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../App.css";

export default function Produtos() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoriaId = searchParams.get("cat"); // Get category from URL query
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/produtos")
      .then(res => res.json())
      .then(data => {
        if (categoriaId) {
          // Filter by category if present in URL
          const filtrados = data.filter(p => p.categoria_id === parseInt(categoriaId));
          setProdutos(filtrados);
        } else {
          setProdutos(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, [categoriaId]);

  const adicionarAoCarrinho = (produto) => {
    // Verificar se cliente está logado
    const cliente = localStorage.getItem("cliente");
    if (!cliente) {
      navigate("/login");
      return;
    }

    // Pegar carrinho atual do localStorage
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");

    // Verificar se produto já está no carrinho
    const produtoExistente = carrinhoAtual.find(item => item.produto_id === produto.id);

    if (produtoExistente) {
      // Aumentar quantidade
      produtoExistente.quantidade += 1;
    } else {
      // Adicionar novo produto
      carrinhoAtual.push({
        produto_id: produto.id,
        quantidade: 1,
        preco_unit: parseFloat(produto.preco)
      });
    }

    // Salvar no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));

    // Mostrar mensagem
    setMensagem(`${produto.nome} adicionado ao carrinho!`);
    setTimeout(() => setMensagem(""), 3000);
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-content">
          <div className="logo"><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>3S Produtos Industriais</Link></div>
          <div className="search-bar">
            <input type="text" placeholder="Buscar produtos..." />
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

      {mensagem && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: '#28a745',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          {mensagem}
        </div>
      )}

      <div className="main-layout">
        <main className="content-area" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>{categoriaId ? "Produtos da Categoria" : "Todos os Produtos"}</h2>
            <Link to="/" className="cta-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Voltar</Link>
          </div>

          {loading ? <p>Carregando produtos...</p> : (
            <div className="products-grid">
              {produtos.length > 0 ? produtos.map(prod => (
                <div key={prod.id} className="product-card-mini">
                  <img src={prod.imagem || "https://via.placeholder.com/200"} alt={prod.nome} />
                  <div className="prod-info">
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{prod.categoria_nome}</span>
                    <h3>{prod.nome}</h3>
                    <p className="price">R$ {prod.preco}</p>
                    <button
                      onClick={() => adicionarAoCarrinho(prod)}
                      style={{
                        width: '100%',
                        marginTop: '0.8rem',
                        padding: '0.6rem',
                        background: 'linear-gradient(to right, #ff6600, #ff8533)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      🛒 Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              )) : <p>Nenhum produto encontrado.</p>}
            </div>
          )}
        </main>
      </div>
      <footer className="main-footer">
        <p>© 2025 3S Produtos Industriais. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
