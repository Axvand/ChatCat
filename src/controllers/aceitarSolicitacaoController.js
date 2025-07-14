// import express from "express";
// import { autenticarToken } from "../middlewares/authPage.js"; // Seu middleware JWT
// import { usuariosConectados } from "../sockets/usuariosConectados.js";

// const router = express.Router();

// export default function aceitarSolicitacao(io) {
//   router.post("/aceitar", autenticarToken, async (req, res) => {
//     try {
//       const idAceitador = req.usuario.id;
//       const { idSolicitante } = req.body;

//       // Sala ordenada (garante mesma sala para os dois)
//       const ids = [idSolicitante, idAceitador].sort((a, b) => a - b);
//       const sala = `sala-${ids[0]}-${ids[1]}`;

//       // Envia evento para o solicitante
//       // depois que a solicitação foi aceita com sucesso

//       // emitir evento para o solicitante (via socket)
//       const io = req.io;
//       const socketIdSolicitante = usuariosConectados[idSolicitante]; // precisa garantir que esse objeto existe
//       if (socketIdSolicitante) {
//         io.to(socketIdSolicitante).emit("solicitacaoAceita", {
//           sala,
//           nome: usuarioAceitador.nome,
//         });
//       }

//       if (socketIdSolicitante && io.sockets.sockets.get(socketIdSolicitante)) {
//         io.to(socketIdSolicitante).emit("aceito", {
//           nome: req.usuario.nome, // nome do aceitador
//           sala,
//         });
//       }

//       // Retorna para quem aceitou
//       return res.json({ ok: true, sala, idAceitador });
//     } catch (err) {
//       console.error("Erro ao aceitar solicitação:", err);
//       res.status(500).json({ erro: "Erro interno" });
//     }
//   });

//   return router;
// }
import express from "express";
import { autenticarToken } from "../middlewares/authPage.js";
import { usuariosConectados } from "../sockets/usuariosConectados.js";

const router = express.Router();

function debugRequisicaoAceitar(req) {
  console.log("===== DEBUG ACEITAR =====");
  console.log("Headers:", req.headers);
  console.log("Token decodificado (req.usuario):", req.usuario);
  console.log("Body recebido:", req.body);
  console.log("=========================");
}

export default function aceitarSolicitacao(io) {
  router.post("/aceitar", autenticarToken, async (req, res) => {
    try {
      const idAceitador = req.usuario.id;
      const nomeAceitador = req.usuario.nome;

      const idSolicitante = parseInt(req.body.idSolicitante);
      if (isNaN(idSolicitante)) {
        return res.status(400).json({ erro: "ID do solicitante inválido" });
      }

      if (idSolicitante === idAceitador) {
        return res
          .status(400)
          .json({ erro: "Não é possível aceitar sua própria solicitação" });
      }

      console.log("Aceitando solicitação de:", idSolicitante);
      console.log("Aceitador:", idAceitador, nomeAceitador);

      const ids = [idSolicitante, idAceitador].sort((a, b) => a - b);
      const sala = `sala-${ids[0]}-${ids[1]}`;

      const socketIdSolicitante = usuariosConectados[idSolicitante];

      if (socketIdSolicitante) {
        io.to(socketIdSolicitante).emit("aceito", {
          nome: nomeAceitador,
          sala,
        });
      } else {
        console.warn(`Solicitante (${idSolicitante}) não está online.`);
      }

      return res.json({ ok: true, sala, idAceitador });
    } catch (err) {
      console.error("Erro ao aceitar solicitação:", err);
      res.status(500).json({ erro: "Erro interno" });
    }
  });

  return router;
}
