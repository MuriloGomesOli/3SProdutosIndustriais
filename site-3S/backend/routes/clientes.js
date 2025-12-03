import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db.js";

const router = express.Router();

// Função para padronizar e validar dados
function padronizarDados(dados) {
    const erros = [];
    const dadosPadronizados = { ...dados };

    // Padronizar telefone - remover tudo exceto números
    if (dados.telefone) {
        dadosPadronizados.telefone = dados.telefone.replace(/\D/g, "");
        // Validar tamanho (10 ou 11 dígitos)
        if (dadosPadronizados.telefone.length < 10 || dadosPadronizados.telefone.length > 11) {
            erros.push("Telefone deve ter 10 ou 11 dígitos");
        }
    }

    // Padronizar CPF - remover tudo exceto números
    if (dados.cpf) {
        dadosPadronizados.cpf = dados.cpf.replace(/\D/g, "");
        // Validar tamanho (11 dígitos)
        if (dadosPadronizados.cpf.length !== 11) {
            erros.push("CPF deve ter exatamente 11 dígitos");
        }
        // Manter como string (CPF é um identificador, não um número)
    }

    // Padronizar CNPJ - remover tudo exceto números
    if (dados.cnpj) {
        dadosPadronizados.cnpj = dados.cnpj.replace(/\D/g, "");
        // Validar tamanho (14 dígitos)
        if (dadosPadronizados.cnpj.length !== 14) {
            erros.push("CNPJ deve ter exatamente 14 dígitos");
        }
        // Manter como string (CNPJ é um identificador, não um número)
    }

    return { dadosPadronizados, erros };
}

// Cadastro de novo cliente
router.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha, telefone, endereco, cpf, cnpj } = req.body;

        // Validação básica
        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios"
            });
        }

        // Padronizar e validar dados
        const { dadosPadronizados, erros } = padronizarDados({
            telefone,
            cpf,
            cnpj
        });

        if (erros.length > 0) {
            return res.status(400).json({
                erro: erros.join(", ")
            });
        }

        // Verificar se email já existe
        const [emailExistente] = await db.query(
            "SELECT id FROM clientes WHERE email = ?",
            [email]
        );

        if (emailExistente.length > 0) {
            return res.status(400).json({
                erro: "Email já cadastrado"
            });
        }

        // Verificar se CPF já existe (se fornecido)
        if (dadosPadronizados.cpf) {
            const [cpfExistente] = await db.query(
                "SELECT id FROM clientes WHERE cpf = ?",
                [dadosPadronizados.cpf]
            );

            if (cpfExistente.length > 0) {
                return res.status(400).json({
                    erro: "CPF já cadastrado"
                });
            }
        }

        // Verificar se CNPJ já existe (se fornecido)
        if (dadosPadronizados.cnpj) {
            const [cnpjExistente] = await db.query(
                "SELECT id FROM clientes WHERE cnpj = ?",
                [dadosPadronizados.cnpj]
            );

            if (cnpjExistente.length > 0) {
                return res.status(400).json({
                    erro: "CNPJ já cadastrado"
                });
            }
        }

        // Criptografar senha com bcrypt (10 rounds)
        const senhaHash = await bcrypt.hash(senha, 10);

        // Inserir cliente no banco com dados padronizados
        const [resultado] = await db.query(
            `INSERT INTO clientes (nome, email, senha, telefone, endereco, cpf, cnpj) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                email,
                senhaHash,
                dadosPadronizados.telefone || null,
                endereco || null,
                dadosPadronizados.cpf || null,
                dadosPadronizados.cnpj || null
            ]
        );

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            clienteId: resultado.insertId
        });

    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro);
        res.status(500).json({
            erro: "Erro ao cadastrar cliente: " + erro.message
        });
    }
});

// Login de cliente
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        // Buscar cliente por email
        const [clientes] = await db.query(
            "SELECT * FROM clientes WHERE email = ?",
            [email]
        );

        if (clientes.length === 0) {
            return res.status(401).json({
                erro: "Email ou senha incorretos"
            });
        }

        const cliente = clientes[0];

        // Verificar senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, cliente.senha);

        if (!senhaValida) {
            return res.status(401).json({
                erro: "Email ou senha incorretos"
            });
        }

        // Retornar dados do cliente (sem a senha)
        const { senha: _, ...clienteSemSenha } = cliente;

        res.json({
            mensagem: "Login realizado com sucesso!",
            cliente: clienteSemSenha
        });

    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        res.status(500).json({
            erro: "Erro ao fazer login"
        });
    }
});

export default router;
