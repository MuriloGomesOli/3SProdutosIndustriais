import express from "express";
import cors from "cors";
import { db } from "./db.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(express.json());

// Testa conexão ao iniciar
async function conectarBanco() {
  try {
    await db.getConnection();
    console.log("✅ Conectado ao MySQL!");
  } catch (erro) {
    console.error("❌ Erro ao conectar ao MySQL:", erro);
  }
}

conectarBanco();

// Rotas
app.use("/admin", adminRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
