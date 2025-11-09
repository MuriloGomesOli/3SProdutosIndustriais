import express from "express";
import { openDb } from "../db.js";

const router = express.Router();

// Lista todos produtos
router.get("/", async (req, res) => {
  const db = await openDb();
  const produtos = await db.all("SELECT * FROM produtos");
  res.json(produtos);
});

// Produto por ID
router.get("/:id", async (req, res) => {
  const db = await openDb();
  const produto = await db.get("SELECT * FROM produtos WHERE id = ?", req.params.id);
  if (produto) res.json(produto);
  else res.status(404).json({ error: "Produto não encontrado" });
});

export default router;
