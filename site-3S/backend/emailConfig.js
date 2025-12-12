import nodemailer from 'nodemailer';

// Configuração do transporter de email
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Função auxiliar para enviar email
export async function enviarEmail({ para, assunto, texto, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"3S Produtos Industriais" <${process.env.SMTP_USER}>`,
            to: para,
            subject: assunto,
            text: texto,
            html: html || texto
        });

        console.log('Email enviado:', info.messageId);
        return { sucesso: true, messageId: info.messageId };
    } catch (erro) {
        console.error('Erro ao enviar email:', erro);
        return { sucesso: false, erro: erro.message };
    }
}

// Verificar configuração do email
export async function verificarConfiguracao() {
    try {
        await transporter.verify();
        console.log('✅ Servidor de email configurado e pronto');
        return true;
    } catch (erro) {
        console.error('❌ Erro na configuração de email:', erro.message);
        return false;
    }
}
