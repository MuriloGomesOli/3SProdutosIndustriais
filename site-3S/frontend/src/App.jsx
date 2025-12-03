import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Carrinho from "./pages/Carrinho";
import AdminProdutos from "./pages/AdminProdutos";
import "./App.css";
import AdminLogin from "./pages/AdminLogin";


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
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/admin/login" element={<AdminLogin />} />
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
