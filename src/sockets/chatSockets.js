// export default function chatSocket(io) {
//   io.on("connection", (socket) => {
//     console.log("🔌 Novo usuário conectado:", socket.id);

//     socket.on("registrarUsuario", (usuarioId) => {
//       usuariosConectados[usuarioId] = socket.id;
//       socket.data.usuarioId = usuarioId;

//       console.log("Registrado:", usuarioId, "->", socket.id);
//     });
//     socket.on("disconnect", () => {
//       const userId = socket.data.usuarioId;
//       if (userId) {
//         delete usuariosConectados[userId];
//         console.log("Desconectado:", userId);
//       }
//     });

//     // Quando o usuário entra na sala
//     socket.on("entrarSala", ({ nome, sala }) => {
//       socket.join(sala);
//       socket.data.nome = nome;
//       socket.data.sala = sala;
//       console.log(`👥 ${nome} entrou na sala ${sala}`);
//     });

//     // Quando o usuário digita uma letra
//     socket.on("digitando", ({ texto }) => {
//       const nome = socket.data.nome;
//       const sala = socket.data.sala;

//       if (!sala || !nome) return;

//       socket.to(sala).emit("digitando", { nome, texto });
//     });

//     // Quando o usuário envia a mensagem completa
//     socket.on("mensagem", ({ texto }) => {
//       const nome = socket.data.nome;
//       const sala = socket.data.sala;

//       if (!sala || !nome) return;

//       io.to(sala).emit("mensagem", { nome, texto });
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Usuário desconectado:", socket.id);
//     });

//     socket.on(
//       "aceitarSolicitacao",
//       ({ idSolicitante, idAceitador, nomeSolicitante, nomeAceitador }) => {
//         const sala = `sala-${idSolicitante}-${idAceitador}`;

//         // Enviar evento para o solicitante entrar também
//         io.to(solicitanteSocketId).emit("aceito", {
//           sala,
//           nome: nomeSolicitante,
//         });

//         // Aqui, o usuário que aceitou já foi redirecionado pelo frontend
//       }
//     );
//   });
// }
import { usuariosConectados } from "./usuariosConectados.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Novo usuário conectado:", socket.id);

    // Registrar usuário com seu socket
    socket.on("registrarUsuario", (usuarioId) => {
      usuariosConectados[usuarioId] = socket.id;
      socket.data.usuarioId = usuarioId;
      console.log("✅ Registrado:", usuarioId, "->", socket.id);
    });

    // Entrar em sala de chat
    socket.on("entrarSala", ({ nome, sala }) => {
      socket.join(sala);
      socket.data.nome = nome;
      socket.data.sala = sala;
      console.log(`👥 ${nome} entrou na sala ${sala}`);
    });

    // Evento de digitação em tempo real
    socket.on("digitando", ({ texto }) => {
      const { nome, sala } = socket.data;
      if (!sala || !nome) return;
      socket.to(sala).emit("digitando", { nome, texto });
    });

    // Enviar mensagem completa
    socket.on("mensagem", ({ texto }) => {
      const { nome, sala } = socket.data;
      if (!sala || !nome) return;
      io.to(sala).emit("mensagem", { nome, texto });
    });

    // Aceitação de solicitação de chat
    socket.on(
      "aceitarSolicitacao",
      ({ idSolicitante, idAceitador, nomeSolicitante, nomeAceitador }) => {
        const sala = `sala-${idSolicitante}-${idAceitador}`;
        const solicitanteSocketId = usuariosConectados[idSolicitante];

        if (solicitanteSocketId) {
          io.to(solicitanteSocketId).emit("aceito", {
            sala,
            nome: nomeAceitador, // quem aceitou
          });
        } else {
          console.log("⚠️ Solicitante não está conectado.");
        }
      }
    );

    // Desconexão do usuário
    socket.on("disconnect", () => {
      const userId = socket.data.usuarioId;
      if (userId) {
        delete usuariosConectados[userId];
        console.log("❌ Desconectado:", userId);
      }
      console.log("📴 Socket desconectado:", socket.id);
    });
  });
}
