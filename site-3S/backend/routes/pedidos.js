import express from "express";
import { db } from "../db.js";

const router = express.Router();

// =========================
//   CRIAR NOVO PEDIDO
// =========================

router.post("/", async (req, res) => {
    try {
        const {
            cliente_id, itens,
            nome, email, mensagem
        } = req.body;

        // 1. Validar itens
        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ erro: "Itens são obrigatórios" });
        }

        // 2. Se cliente não tem login → nome e email obrigatórios
        if (!cliente_id && (!nome || !email)) {
            return res.status(400).json({
                erro: "Nome e Email são obrigatórios para cotação sem login"
            });
        }

        // ============================
        // INICIAR TRANSAÇÃO
        // ============================
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            let clienteIdFinal = cliente_id;

            // ============================
            // 3. Cliente não logado → criar ou encontrar contato
            // ============================
            if (!clienteIdFinal) {
                const [verifica] = await connection.query(
                    "SELECT idcontato FROM contato WHERE email = ?",
                    [email]
                );

                if (verifica.length > 0) {
                    clienteIdFinal = verifica[0].idcontato;
                } else {
                    const [novoContato] = await connection.query(
                        "INSERT INTO contato (nome, email) VALUES (?, ?)",
                        [nome, email]
                    );
                    clienteIdFinal = novoContato.insertId;
                }
            }

            // ============================
            // 4. Criar pedido
            // ============================
            const [pedido] = await connection.query(
                `INSERT INTO pedidos (cliente_id, mensagem, data_pedido, status)
                 VALUES (?, ?, NOW(), 'pendente')`,
                [clienteIdFinal, mensagem]
            );

            const pedidoId = pedido.insertId;

            // ============================
            // 5. Inserir itens do pedido
            // ============================
            for (const item of itens) {
                // ADAPTADO: Usando nome_produto em vez de produto_id conforme schema anterior
                const { nome_produto, quantidade, especificacao } = item;

                if (!nome_produto || !quantidade) {
                    throw new Error("Dados do item incompletos");
                }

                await connection.query(
                    `INSERT INTO pedidos_itens 
                     (pedido_id, nome_produto, quantidade, especificacao) 
                     VALUES (?, ?, ?, ?)`,
                    [pedidoId, nome_produto, quantidade, especificacao || null]
                );
            }

            // Confirmar tudo
            await connection.commit();

            res.status(201).json({
                mensagem: "Cotação enviada com sucesso!",
                pedidoId
            });

        } catch (erro) {
            await connection.rollback();
            throw erro;
        } finally {
            connection.release();
        }

    } catch (erro) {
        console.error("Erro ao criar pedido:", erro);
        res.status(500).json({ erro: "Erro ao criar pedido" });
    }
});


// =========================
//   BUSCAR PEDIDOS DO CLIENTE
// =========================

router.get("/cliente/:clienteId", async (req, res) => {
    try {
        const { clienteId } = req.params;

        const [pedidos] = await db.query(
            `SELECT p.*,
                    GROUP_CONCAT(
                        CONCAT_WS(':', pi.nome_produto, pi.quantidade, pi.especificacao)
                    ) AS itens
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
        res.status(500).json({ erro: "Erro ao buscar pedidos" });
    }
});

// =========================
//   LISTAR TODOS OS PEDIDOS (ADMIN)
// =========================
router.get("/", async (req, res) => {
    try {
        const [pedidos] = await db.query(
            `SELECT p.*, 
                    c.nome as nome_contato, 
                    c.email as email_contato,
                    GROUP_CONCAT(
                        CONCAT_WS(' | ', pi.nome_produto, pi.quantidade, IFNULL(pi.especificacao, ''))
                        SEPARATOR '; '
                    ) AS itens_formatados
             FROM pedidos p
             LEFT JOIN contato c ON p.cliente_id = c.idcontato
             LEFT JOIN pedidos_itens pi ON p.id = pi.pedido_id
             GROUP BY p.id
             ORDER BY p.data_pedido DESC`
        );

        res.json(pedidos);

    } catch (erro) {
        console.error("Erro ao buscar todos os pedidos:", erro);
        res.status(500).json({ erro: "Erro ao buscar pedidos" });
    }
});


// Atualizar status do pedido
router.put("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ erro: "Status é obrigatório" });
        }

        // Se o novo status for "aprovado", debitar do estoque
        if (status === 'aprovado') {
            // 1. Buscar itens do pedido
            const [itens] = await db.query("SELECT nome_produto, quantidade FROM pedidos_itens WHERE pedido_id = ?", [id]);

            // 2. Atualizar estoque para cada item
            for (const item of itens) {
                // Atualiza estoque buscando produto pelo nome (já que pedidos_itens usa nome)
                await db.query(`
                    UPDATE estoque e
                    JOIN produtos p ON e.produto_id = p.id
                    SET e.quantidade = e.quantidade - ?
                    WHERE p.nome = ?
                `, [item.quantidade, item.nome_produto]);
            }
        }

        await db.query("UPDATE pedidos SET status = ? WHERE id = ?", [status, id]);

        res.json({ mensagem: "Status atualizado com sucesso" });

    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);
        res.status(500).json({ erro: "Erro ao atualizar status" });
    }
});

export default router;
