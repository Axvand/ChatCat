import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import chatSocket from "./src/sockets/chatSockets.js";
import aceitarSolicitacao from "./src/controllers/aceitarSolicitacaoController.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(aceitarSolicitacao(io));

chatSocket(io); // Conecta lógica dos sockets

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
