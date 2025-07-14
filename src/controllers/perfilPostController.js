import { db } from "../../config/db.js";

export const postUsuarioData = async (req, res) => {
  const userId = req.usuario.id;
  const { avatar, humor, frase } = req.body;

  try {
    // Verifica se o perfil já existe
    const [perfil] = await db.execute(
      "SELECT * FROM perfis WHERE user_id = ?",
      [userId]
    );

    if (perfil.length > 0) {
      // Atualiza
      await db.execute(
        "UPDATE perfis SET avatar = ?, humor = ?, frase = ?, atualizado_em = NOW() WHERE user_id = ?",
        [avatar, humor, frase, userId]
      );
    } else {
      // Insere
      await db.execute(
        "INSERT INTO perfis (user_id, avatar, humor, frase) VALUES (?, ?, ?, ?)",
        [userId, avatar, humor, frase]
      );
    }

    res.json({ msg: "Perfil salvo com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro ao salvar perfil" });
  }
};
