import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import AdminProdutos from "./pages/AdminProdutos";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
     <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/admin" element={<AdminProdutos />} />
        </Routes>
      </main>

      <footer>
        <p>© 2025 3S Produtos Industriais | Todos os direitos reservados</p>
        <p>
          Endereço: Rua Industrial, 123 - São Paulo | Email: contato@3s.com.br
        </p>
      </footer>
    </BrowserRouter>
  );
}
