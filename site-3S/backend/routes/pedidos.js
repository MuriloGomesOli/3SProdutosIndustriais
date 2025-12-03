import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Criar novo pedido com itens
router.post("/", async (req, res) => {
    try {
        const { cliente_id, itens } = req.body;

        // Validação básica
        if (!cliente_id || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                erro: "Cliente e itens são obrigatórios"
            });
        }

        // Iniciar transação
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Criar pedido (você precisará criar a tabela 'pedidos' se não existir)
            const [pedido] = await connection.query(
                `INSERT INTO pedidos (cliente_id, data_pedido, status) 
         VALUES (?, NOW(), 'pendente')`,
                [cliente_id]
            );

            const pedidoId = pedido.insertId;

            // Inserir itens do pedido
            for (const item of itens) {
                const { produto_id, quantidade, preco_unit } = item;

                if (!produto_id || !quantidade || !preco_unit) {
                    throw new Error("Dados do item incompletos");
                }

                await connection.query(
                    `INSERT INTO pedidos_itens (pedido_id, produto_id, quantidade, preco_unit) 
           VALUES (?, ?, ?, ?)`,
                    [pedidoId, produto_id, quantidade, preco_unit]
                );
            }

            // Confirmar transação
            await connection.commit();

            res.status(201).json({
                mensagem: "Pedido criado com sucesso!",
                pedidoId: pedidoId
            });

        } catch (erro) {
            // Reverter transação em caso de erro
            await connection.rollback();
            throw erro;
        } finally {
            connection.release();
        }

    } catch (erro) {
        console.error("Erro ao criar pedido:", erro);
        res.status(500).json({
            erro: "Erro ao criar pedido"
        });
    }
});

// Buscar pedidos de um cliente
router.get("/cliente/:clienteId", async (req, res) => {
    try {
        const { clienteId } = req.params;

        const [pedidos] = await db.query(
            `SELECT p.*, 
              GROUP_CONCAT(
                CONCAT(pi.produto_id, ':', pi.quantidade, ':', pi.preco_unit)
              ) as itens
       FROM pedidos p
       LEFT JOIN pedidos_itens pi ON p.id = pi.pedido_id
       WHERE p.cliente_id = ?
       GROUP BY p.id
       ORDER BY p.data_pedido DESC`,
            [clienteId]
        );

        res.json(pedidos);

    } catch (erro) {
        console.error("Erro ao buscar pedidos:", erro);
        res.status(500).json({
            erro: "Erro ao buscar pedidos"
        });
    }
});

export default router;
