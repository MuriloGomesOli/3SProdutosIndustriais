import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProdutoDetalhe({ adicionarCarrinho }) {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/produtos/${id}`)
      .then(res => res.json())
      .then(setProduto);
  }, [id]);

  if (!produto) return <p>Carregando...</p>;

  return (
    <section className="produto-detalhe">
      <h2>{produto.nome}</h2>
      <img src={produto.imagem || "/placeholder.png"} alt={produto.nome} />
      <p>{produto.descricao}</p>
      <p>Preço: R$ {produto.preco}</p>
      <button onClick={() => adicionarCarrinho(produto)} className="btn">
        Solicitar Orçamento
      </button>
    </section>
  );
}
