// db.js
import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "loja3s",
  waitForConnections: true,
  connectionLimit: 10,
});

db.getConnection()
  .then(() => console.log("📌 MySQL conectado com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar MySQL:", err));
