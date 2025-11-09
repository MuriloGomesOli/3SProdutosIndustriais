import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Produtos() {
  const { categoriaId } = useParams(); // captura a categoria da URL
  const [produtos, setProdutos] = useState([]);
  const [categoriaNome, setCategoriaNome] = useState("");

  useEffect(() => {
    // busca produtos do backend
    fetch("http://localhost:3000/api/produtos")
      .then(res => res.json())
      .then(data => {
        // filtra por categoria se categoriaId existir
        const filtrados = categoriaId
          ? data.filter(p => p.categoria === parseInt(categoriaId))
          : data;
        setProdutos(filtrados);

        // opcional: pegar nome da categoria (caso backend retorne categorias)
        if(filtrados.length > 0) setCategoriaNome(filtrados[0].categoriaNome || "");
      });
  }, [categoriaId]);

  return (
    <section className="produtos">
      <h2>{categoriaNome || "Catálogo de Produtos"}</h2>
      <Link to="/" className="btn-voltar">← Voltar</Link>
      <div className="grid">
        {produtos.map(prod => (
          <div key={prod.id} className="card">
            <img src={prod.imagem || "https://via.placeholder.com/200x150?text=Produto"} alt={prod.nome} />
            <h3>{prod.nome}</h3>
            <p>R$ {prod.preco}</p>
            <Link to={`/produto/${prod.id}`} className="btn">Ver Detalhes</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
