import { db } from "../../config/db.js";
import bcrypt from "bcrypt";

export async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  try {
    // Verifica se o e-mail já está cadastrado
    const [existe] = await db.query("SELECT id FROM usuarios WHERE email = ?", [
      email,
    ]);
    // COLOCAR FILTRO DE DADOS.

    if (existe.length > 0) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere no banco
    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
}
