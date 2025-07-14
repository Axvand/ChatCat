import { Router } from "express";
import {
  aceitarSolicitacaoController,
  DeletarSolicitacaoController,
  RecebidaController,
  SolicitacaoController,
} from "../controllers/solicitacaoController.js";
import { autenticarToken } from "../middlewares/authPage.js";

const router = Router();

router.post("/solicitar", autenticarToken, SolicitacaoController);
router.get("/recebidas", autenticarToken, RecebidaController);
router.delete("/recusar/:id", autenticarToken, DeletarSolicitacaoController);
export default router;
