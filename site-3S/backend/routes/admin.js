import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

// LOGIN ADMIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  try {
    // Busca admin
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ? AND tipo = 'admin'",
      [email]
    );

    if (rows.length === 0) {
      console.log(`Login falhou: Admin não encontrado para email ${email}`);
      return res.status(404).json({ error: "Admin não encontrado" });
    }

    const admin = rows[0];

    // Confere senha
    const senhaOk = await bcrypt.compare(senha, admin.senha);

    if (!senhaOk) {
      console.log(`Login falhou: Senha incorreta para ${email}`);
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Cria token JWT
    const token = jwt.sign(
      {
        id: admin.id,
        nome: admin.nome,
        tipo: admin.tipo
      },
      "SEGREDO_SUPER_SEGURO",
      { expiresIn: "2h" }
    );

    console.log(`Login realizado com sucesso para ${email}`);

    res.json({
      mensagem: "Login realizado",
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email
      }
    });

  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

router.get("/login", (req, res) => {
  res.send("Rota de login funcionando! Para logar, use POST.");
});

export default router;
