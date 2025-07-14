// authRouter.js
import { db } from "../../config/db.js";

export const dashboardPerfilController = async (req, res) => {
  const userId = req.usuario.id;

  try {
    // Buscar nome do usuário + dados do perfil
    const [[dados]] = await db.query(
      `
      SELECT p.avatar, p.humor, p.frase
      FROM usuarios u
      LEFT JOIN perfis p ON u.id = p.user_id
      WHERE u.id = ?
    `,
      [userId]
    );

    if (!dados) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // Envia tudo já pronto pro frontend
    res.json({
      nome: dados.nome,
      avatarUrl: `/avatars/${dados.avatar || "default.jpg"}`,
      humor: dados.humor || "Não informado",
      frase: dados.frase || "Nenhuma frase definida",
    });
  } catch (err) {
    console.error("Erro no GET /dashboard:", err);
    res.status(500).json({ msg: "Erro ao carregar dashboard" });
  }
};
