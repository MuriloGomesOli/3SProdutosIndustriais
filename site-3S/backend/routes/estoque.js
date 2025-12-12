import express from "express";
import { db } from "../db.js";

const router = express.Router();

// =========================
//   REGISTRAR MOVIMENTAÇÃO
// =========================
router.post("/movimentacao", async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { produto_id, tipo, quantidade, motivo, responsavel } = req.body;

        if (!produto_id || !tipo || !quantidade) {
            return res.status(400).json({ erro: "Dados incompletos" });
        }

        await connection.beginTransaction();

        // 1. Registrar no histórico
        await connection.query(
            `INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, motivo, responsavel)
             VALUES (?, ?, ?, ?, ?)`,
            [produto_id, tipo, quantidade, motivo, responsavel]
        );

        // 2. Atualizar estoque atual
        // Verifica se já existe registro na tabela estoque
        const [estoque] = await connection.query("SELECT * FROM estoque WHERE produto_id = ?", [produto_id]);

        if (estoque.length === 0) {
            // Se não existe, cria (apenas se for entrada, ou permite negativo se saída)
            const novaQtd = tipo === 'entrada' ? quantidade : -quantidade;
            await connection.query("INSERT INTO estoque (produto_id, quantidade) VALUES (?, ?)", [produto_id, novaQtd]);
        } else {
            // Atualiza
            const operador = tipo === 'entrada' ? '+' : '-';
            await connection.query(
                `UPDATE estoque SET quantidade = quantidade ${operador} ? WHERE produto_id = ?`,
                [quantidade, produto_id]
            );
        }

        await connection.commit();
        res.json({ mensagem: "Movimentação registrada com sucesso" });

    } catch (erro) {
        await connection.rollback();
        console.error("Erro na movimentação:", erro);
        res.status(500).json({ erro: "Erro ao registrar movimentação" });
    } finally {
        connection.release();
    }
});

// =========================
//   HISTÓRICO DE MOVIMENTAÇÕES
// =========================
router.get("/movimentacoes", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, p.nome as nome_produto 
            FROM movimentacoes_estoque m
            JOIN produtos p ON m.produto_id = p.id
            ORDER BY m.data_movimentacao DESC
            LIMIT 50
        `);
        res.json(rows);
    } catch (erro) {
        console.error("Erro ao buscar histórico:", erro);
        res.status(500).json({ erro: "Erro ao buscar histórico" });
    }
});

// =========================
//   RESUMO DO ESTOQUE
// =========================
router.get("/resumo", async (req, res) => {
    try {
        // Total de produtos
        const [totalProd] = await db.query("SELECT COUNT(*) as total FROM produtos");

        // Produtos com estoque baixo (menor que minimo)
        const [baixoEstoque] = await db.query(`
            SELECT COUNT(*) as total 
            FROM estoque 
            WHERE quantidade < minimo AND quantidade > 0
        `);

        // Produtos sem estoque (<= 0)
        const [semEstoque] = await db.query(`
            SELECT COUNT(*) as total 
            FROM estoque 
            WHERE quantidade <= 0
        `);

        res.json({
            total_produtos: totalProd[0].total,
            baixo_estoque: baixoEstoque[0].total,
            sem_estoque: semEstoque[0].total
        });

    } catch (erro) {
        console.error("Erro ao buscar resumo:", erro);
        res.status(500).json({ erro: "Erro ao buscar resumo" });
    }
});

export default router;
