import { Router } from "express";
import { autenticarToken } from "../middlewares/authPage.js";
import { postUsuarioData } from "../controllers/perfilPostController.js";
import { dashboardPerfilController } from "../controllers/dashboardPerfilController.js";

const router = Router();

router.post("/perfil", autenticarToken, postUsuarioData);
router.get("/dashboardperfil", autenticarToken, dashboardPerfilController);

export default router;
