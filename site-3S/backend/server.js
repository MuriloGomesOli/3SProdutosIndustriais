import express from "express";
import cors from "cors";
import produtosRouter from "./routes/produtos.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/produtos", produtosRouter);

app.listen(3000, () => console.log("Backend rodando em http://localhost:3000"));
