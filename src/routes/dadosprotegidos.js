// src/routes/dadosProtegidos.js
import { Router } from "express";
import { autenticarToken } from "../middlewares/authPage.js";

const router = Router();

router.get("/api/dados-dashboard", autenticarToken, (req, res) => {
  res.json({
    msg: "Dados protegidos recebidos!",
    usuario: req.usuario,
  });
});

export default router;
