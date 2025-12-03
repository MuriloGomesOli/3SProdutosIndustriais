import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Listar todos os produtos com nome da categoria
router.get("/", async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT p.*, c.nome as categoria_nome 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `);
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Buscar produto por ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

export default router;
