import { db } from "../../config/db.js";
export const SolicitacaoController = async (req, res) => {
  const de_id = req.usuario.id;
  const { para_id } = req.body;

  if (!para_id) {
    return res.status(400).json({ erro: "ID do destinatário obrigatório" });
  }

  try {
    // Verifica se já existe uma solicitação pendente
    const [existe] = await db.execute(
      `SELECT * FROM solicitacoes WHERE de_id = ? AND para_id = ? AND status = 'pendente'`,
      [de_id, para_id]
    );

    if (existe.length > 0) {
      return res.status(400).json({ erro: "Solicitação já enviada" });
    }

    await db.execute(
      `INSERT INTO solicitacoes (de_id, para_id) VALUES (?, ?)`,
      [de_id, para_id]
    );

    res.json({ msg: "Solicitação enviada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao enviar solicitação" });
  }
};

// =======================recebida solicitação============================

// Evento delegado: como os botões são gerados dinamicamente
// routes/solicitacoes.js
export const RecebidaController = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const [solicitacoes] = await db.execute(
      `SELECT s.id, u.nome, u.id AS usuario_id
         FROM solicitacoes s
         JOIN usuarios u ON u.id = s.de_id
         WHERE s.para_id = ? AND s.status = 'pendente'`,
      [usuarioId]
    );

    res.json(solicitacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar solicitações" });
  }
};
//===============recusar socilitação===================

// routes/solicitacoes.js ou similar

// Rejeitar uma solicitação
export const DeletarSolicitacaoController = async (req, res) => {
  const usuarioLogado = req.usuario.id;
  const usuarioSolicitante = req.params.id;

  try {
    const [rows] = await db.query(
      "DELETE FROM solicitacoes WHERE de_id = ? AND para_id = ?",
      [usuarioSolicitante, usuarioLogado]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Solicitação não encontrada." });
    }

    res.json({ message: "Solicitação recusada com sucesso." });
  } catch (err) {
    console.error("Erro ao recusar solicitação:", err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

export const aceitarSolicitacaoController = async (req, res) => {
  try {
    const idAceitador = req.user.id;
    const { idSolicitante } = req.body;

    // Gera o nome da sala a partir dos dois IDs em ordem crescente
    const ids = [idSolicitante, idAceitador].sort((a, b) => a - b);
    const sala = `sala-${ids[0]}-${ids[1]}`;

    // Recupera os socketIds
    const socketIdSolicitante = usuariosConectados[idSolicitante];
    const socketIdAceitador = usuariosConectados[idAceitador];

    // Envia evento para o solicitante se ele estiver online
    if (socketIdSolicitante && io.sockets.sockets.get(socketIdSolicitante)) {
      io.to(socketIdSolicitante).emit("aceito", {
        nome: req.user.nome, // nome do aceitador
        sala,
      });
    }

    // Opcional: salva no banco que a solicitação foi aceita, etc.

    // Envia resposta para quem aceitou
    return res.json({
      ok: true,
      sala,
      idAceitador,
    });
  } catch (err) {
    console.error("Erro ao aceitar solicitação:", err.message);
    res.status(500).json({ erro: "Erro interno" });
  }
};
