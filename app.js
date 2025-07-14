import express from "express";
import path from "path";
import viewRoutes from "./src/routes/viewRoutes.js";
import authRoutes from "./src/routes/authRouter.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import logar from "./src/routes/logar.js";
import cors from "cors";
import dadosProtegidos from "./src/routes/dadosProtegidos.js";
import perfilRouter from "./src/routes/perfilRouter.js";
import buscarRouter from "./src/routes/buscarRouter.js";
import solicitacaoRouter from "./src/routes/solicitacaoRouter.js";
import aceitarSolicitacao from "./src/controllers/aceitarSolicitacaoController.js";

const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/", dadosProtegidos);

// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store"); // O mais seguro
//   next();
// });

//conversas:
app.use("/", buscarRouter);
app.use("/", solicitacaoRouter);
// Arquivos estáticos
app.use(express.static(path.join(__dirname, "./src/pages")));

// Middleware de body parser (opcional)
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", viewRoutes);
app.use("/", authRoutes);
app.use("/", loginRoutes);
app.use("/", logar);
app.use("/", perfilRouter);

export default app;
