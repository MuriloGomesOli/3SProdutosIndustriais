import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../db.js";
import { enviarEmail } from "../emailConfig.js";

const router = express.Router();

// Configuração do Multer para upload de anexos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/orcamentos";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo não permitido"));
        }
    }
});

// ============================================
// HELPER: Registrar ação no histórico
// ============================================
async function registrarHistorico(solicitacaoId, tipoAcao, descricao, usuario = "Sistema") {
    try {
        await db.query(
            "INSERT INTO historico_orcamentos (solicitacao_id, tipo_acao, descricao, usuario) VALUES (?, ?, ?, ?)",
            [solicitacaoId, tipoAcao, descricao, usuario]
        );
    } catch (erro) {
        console.error("Erro ao registrar histórico:", erro);
    }
}

// ============================================
// GET /api/orcamentos/stats - Estatísticas
// ============================================
router.get("/stats", async (req, res) => {
    try {
        // Pendentes
        const [pendentes] = await db.query(
            "SELECT COUNT(*) as total FROM solicitacoes_orcamento WHERE status = 'pendente'"
        );

        // Recebidas hoje
        const [hoje] = await db.query(
            "SELECT COUNT(*) as total FROM solicitacoes_orcamento WHERE DATE(data_solicitacao) = CURDATE()"
        );

        // Com anexo
        const [comAnexo] = await db.query(
            "SELECT COUNT(*) as total FROM solicitacoes_orcamento WHERE anexo IS NOT NULL AND anexo != ''"
        );

        // Respondidas esta semana
        const [respondidas] = await db.query(
            "SELECT COUNT(*) as total FROM solicitacoes_orcamento WHERE status = 'respondido' AND YEARWEEK(data_resposta) = YEARWEEK(NOW())"
        );

        res.json({
            pendentes: pendentes[0].total,
            hoje: hoje[0].total,
            comAnexo: comAnexo[0].total,
            respondidasSemana: respondidas[0].total
        });
    } catch (erro) {
        console.error("Erro ao buscar estatísticas:", erro);
        res.status(500).json({ erro: "Erro ao buscar estatísticas" });
    }
});

// ============================================
// GET /api/orcamentos - Listar com filtros
// ============================================
router.get("/", async (req, res) => {
    try {
        const { status, dataInicio, dataFim, busca, temAnexo } = req.query;

        let query = `
            SELECT 
                s.*,
                c.nome, c.cargo, c.empresa, c.cnpj, c.email, c.telefone
            FROM solicitacoes_orcamento s
            LEFT JOIN clientes_contatos c ON s.contato_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Filtro de status
        if (status && status !== "todos") {
            query += " AND s.status = ?";
            params.push(status);
        }

        // Filtro de data
        if (dataInicio) {
            query += " AND DATE(s.data_solicitacao) >= ?";
            params.push(dataInicio);
        }
        if (dataFim) {
            query += " AND DATE(s.data_solicitacao) <= ?";
            params.push(dataFim);
        }

        // Filtro de busca
        if (busca) {
            query += ` AND (
                c.nome LIKE ? OR 
                c.email LIKE ? OR 
                c.empresa LIKE ? OR 
                s.produto_procurado LIKE ? OR 
                s.assunto LIKE ?
            )`;
            const buscaTerm = `%${busca}%`;
            params.push(buscaTerm, buscaTerm, buscaTerm, buscaTerm, buscaTerm);
        }

        // Filtro de anexo
        if (temAnexo === "true") {
            query += " AND s.anexo IS NOT NULL AND s.anexo != ''";
        }

        query += " ORDER BY s.data_solicitacao DESC";

        const [orcamentos] = await db.query(query, params);
        res.json(orcamentos);
    } catch (erro) {
        console.error("Erro ao listar orçamentos:", erro);
        res.status(500).json({ erro: "Erro ao listar orçamentos" });
    }
});

// ============================================
// GET /api/orcamentos/:id - Detalhes
// ============================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [orcamentos] = await db.query(`
            SELECT 
                s.*,
                c.nome, c.cargo, c.empresa, c.cnpj, c.email, c.telefone
            FROM solicitacoes_orcamento s
            LEFT JOIN clientes_contatos c ON s.contato_id = c.id
            WHERE s.id = ?
        `, [id]);

        if (orcamentos.length === 0) {
            return res.status(404).json({ erro: "Solicitação não encontrada" });
        }

        // Registrar visualização
        await registrarHistorico(id, "visualizacao", "Solicitação visualizada no dashboard", "Admin");

        res.json(orcamentos[0]);
    } catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);
        res.status(500).json({ erro: "Erro ao buscar detalhes" });
    }
});

// ============================================
// GET /api/orcamentos/:id/historico
// ============================================
router.get("/:id/historico", async (req, res) => {
    try {
        const { id } = req.params;

        const [historico] = await db.query(
            "SELECT * FROM historico_orcamentos WHERE solicitacao_id = ? ORDER BY data_acao DESC",
            [id]
        );

        res.json(historico);
    } catch (erro) {
        console.error("Erro ao buscar histórico:", erro);
        res.status(500).json({ erro: "Erro ao buscar histórico" });
    }
});

// ============================================
// POST /api/orcamentos - Criar solicitação
// ============================================
router.post("/", upload.single("anexo"), async (req, res) => {
    try {
        const {
            nome, cargo, empresa, cnpj, email, telefone,
            perfil_empresa, produto_procurado, assunto, mensagem, quer_catalogo
        } = req.body;

        // Validações
        if (!nome || !email) {
            return res.status(400).json({ erro: "Nome e email são obrigatórios" });
        }

        // 1. Criar ou buscar contato
        let contatoId;
        const [contatoExistente] = await db.query(
            "SELECT id FROM clientes_contatos WHERE email = ?",
            [email]
        );

        if (contatoExistente.length > 0) {
            contatoId = contatoExistente[0].id;
            // Atualizar dados do contato
            await db.query(
                "UPDATE clientes_contatos SET nome=?, cargo=?, empresa=?, cnpj=?, telefone=? WHERE id=?",
                [nome, cargo, empresa, cnpj, telefone, contatoId]
            );
        } else {
            const [resultado] = await db.query(
                "INSERT INTO clientes_contatos (nome, cargo, empresa, cnpj, email, telefone) VALUES (?, ?, ?, ?, ?, ?)",
                [nome, cargo, empresa, cnpj, email, telefone]
            );
            contatoId = resultado.insertId;
        }

        // 2. Criar solicitação
        const anexo = req.file ? req.file.filename : null;
        const [solicitacao] = await db.query(
            `INSERT INTO solicitacoes_orcamento 
            (contato_id, perfil_empresa, produto_procurado, assunto, mensagem, anexo, quer_catalogo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [contatoId, perfil_empresa, produto_procurado, assunto, mensagem, anexo, quer_catalogo ? 1 : 0]
        );

        const solicitacaoId = solicitacao.insertId;

        // 3. Registrar no histórico
        await registrarHistorico(
            solicitacaoId,
            "criacao",
            `Solicitação criada por ${nome} (${email})`,
            "Sistema"
        );

        res.status(201).json({
            mensagem: "Solicitação criada com sucesso",
            id: solicitacaoId
        });
    } catch (erro) {
        console.error("Erro ao criar solicitação:", erro);
        res.status(500).json({ erro: "Erro ao criar solicitação" });
    }
});

// ============================================
// PUT /api/orcamentos/:id/status
// ============================================
router.put("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, usuario = "Admin" } = req.body;

        if (!["pendente", "em_analise", "respondido"].includes(status)) {
            return res.status(400).json({ erro: "Status inválido" });
        }

        await db.query(
            "UPDATE solicitacoes_orcamento SET status = ? WHERE id = ?",
            [status, id]
        );

        await registrarHistorico(
            id,
            "mudanca_status",
            `Status alterado para: ${status}`,
            usuario
        );

        res.json({ mensagem: "Status atualizado com sucesso" });
    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);
        res.status(500).json({ erro: "Erro ao atualizar status" });
    }
});

// ============================================
// POST /api/orcamentos/:id/responder
// ============================================
router.post("/:id/responder", async (req, res) => {
    try {
        const { id } = req.params;
        const { resposta, respondido_por = "Admin", email_cliente, assunto } = req.body;

        if (!resposta || !email_cliente) {
            return res.status(400).json({ erro: "Resposta e email são obrigatórios" });
        }

        // 1. Enviar email
        const resultadoEmail = await enviarEmail({
            para: email_cliente,
            assunto: assunto || "Resposta à sua solicitação - 3S Produtos Industriais",
            texto: resposta,
            html: `<p>${resposta.replace(/\n/g, '<br>')}</p>`
        });

        if (!resultadoEmail.sucesso) {
            return res.status(500).json({ erro: "Erro ao enviar email" });
        }

        // 2. Atualizar solicitação
        await db.query(
            `UPDATE solicitacoes_orcamento 
            SET status = 'respondido', resposta_enviada = ?, respondido_por = ?, data_resposta = NOW() 
            WHERE id = ?`,
            [resposta, respondido_por, id]
        );

        // 3. Registrar no histórico
        await registrarHistorico(
            id,
            "resposta",
            `Resposta enviada por ${respondido_por} para ${email_cliente}`,
            respondido_por
        );

        res.json({ mensagem: "Resposta enviada com sucesso" });
    } catch (erro) {
        console.error("Erro ao enviar resposta:", erro);
        res.status(500).json({ erro: "Erro ao enviar resposta" });
    }
});

// ============================================
// GET /api/orcamentos/:id/anexo - Download
// ============================================
router.get("/:id/anexo", async (req, res) => {
    try {
        const { id } = req.params;

        const [orcamentos] = await db.query(
            "SELECT anexo FROM solicitacoes_orcamento WHERE id = ?",
            [id]
        );

        if (orcamentos.length === 0 || !orcamentos[0].anexo) {
            return res.status(404).json({ erro: "Anexo não encontrado" });
        }

        const anexo = orcamentos[0].anexo;
        const filePath = path.join(process.cwd(), "uploads", "orcamentos", anexo);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ erro: "Arquivo não encontrado" });
        }

        // Registrar download
        await registrarHistorico(id, "download_anexo", `Anexo baixado: ${anexo}`, "Admin");

        res.download(filePath);
    } catch (erro) {
        console.error("Erro ao baixar anexo:", erro);
        res.status(500).json({ erro: "Erro ao baixar anexo" });
    }
});

export default router;
