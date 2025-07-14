// routes/usuarios.js
import { autenticarToken } from "../middlewares/authPage.js";
import { Router } from "express";
import { BuscarController } from "../controllers/buscarController.js";

const router = Router();

router.get("/buscar", autenticarToken, BuscarController);
export default router;
