import { db } from "../../config/db.js";
export const BuscarController = async (req, res) => {
  const nomeParcial = req.query.nome;
  const usuarioId = req.usuario.id;

  try {
    const [resultados] = await db.execute(
      "SELECT id, nome FROM usuarios WHERE nome LIKE ? AND id != ?",
      [`%${nomeParcial}%`, usuarioId]
    );
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
};
