import React, { useState } from "react";

export default function Admin() {
  const [categorias, setCategorias] = useState([
    { id: 1, nome: "Fixação" },
    { id: 2, nome: "Conexões" },
    { id: 3, nome: "Siderúrgicos" },
    { id: 4, nome: "Metais" },
    { id: 5, nome: "Vedação" },
    { id: 6, nome: "Plástico" },
  ]);
  const [novaCat, setNovaCat] = useState("");

  const adicionar = () => {
    if(novaCat.trim() === "") return;
    setCategorias([...categorias, { id: Date.now(), nome: novaCat }]);
    setNovaCat("");
  };

  const deletar = id => setCategorias(categorias.filter(c => c.id !== id));

  const editar = (id, nome) => {
    const novoNome = prompt("Novo nome:", nome);
    if(novoNome) setCategorias(categorias.map(c => c.id === id ? {...c, nome: novoNome} : c));
  };

  return (
    <div className="admin-container">
      <h2>Admin - Categorias</h2>
      <div className="admin-add">
        <input value={novaCat} onChange={e => setNovaCat(e.target.value)} placeholder="Nova categoria" />
        <button onClick={adicionar}>Adicionar</button>
      </div>
      <ul>
        {categorias.map(c => (
          <li key={c.id}>
            {c.nome}
            <button onClick={() => editar(c.id, c.nome)}>Editar</button>
            <button onClick={() => deletar(c.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
