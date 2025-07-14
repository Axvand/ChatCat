import { Router } from "express";
import salaController from "../controllers/salaController.js";
import dashboardController from "../controllers/dashboardController.js";
import { autenticarToken } from "../middlewares/authPage.js";

const router = Router();

router.get("/dashboard", autenticarToken, dashboardController);
router.get("/sala", autenticarToken, salaController);

export default router;
