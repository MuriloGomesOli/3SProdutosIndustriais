import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Salvar novo contato
router.post("/", async (req, res) => {
    try {
        const {
            nome, email
        } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ erro: "Nome e Email são obrigatórios" });
        }

        const query = `
            INSERT INTO contato 
            (nome, email, mensagem)
            VALUES (?, ?, ?)
        `;

        const values = [
            nome, email, mensagem
        ];

        await db.query(query, values);

        res.status(201).json({ mensagem: "Contato salvo com sucesso!" });

    } catch (erro) {
        console.error("Erro ao salvar contato:", erro);
        res.status(500).json({ erro: "Erro ao processar solicitação" });
    }
});

// Listar todos os contatos
router.get("/", async (req, res) => {
    try {
        const [contatos] = await db.query("SELECT * FROM contato ORDER BY idcontato DESC");
        res.json(contatos);
    } catch (erro) {
        console.error("Erro ao buscar contatos:", erro);
        res.status(500).json({ erro: "Erro ao buscar contatos" });
    }
});

export default router;
