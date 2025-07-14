// // src/middlewares/auth.js
// import jwt from "jsonwebtoken";

// export function autenticarToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer token

//   if (!token) return res.status(401).json({ msg: "Token não fornecido." });

//   jwt.verify(token, "senha_senha", (err, usuario) => {
//     if (err) return res.status(403).json({ msg: "Token inválido." });
//     req.usuario = usuario;
//     next();
//   });
// }
// src/middlewares/authPage.js
// ==========================================
// import jwt from "jsonwebtoken";

// export function autenticarToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

//   if (!token) {
//     return res.status(401).json({ msg: "Token não fornecido." });
//   }

//   jwt.verify(token, "senha_senha", (err, usuario) => {
//     if (err) {
//       return res.status(403).json({ msg: "Token inválido." });
//     }

//     req.usuario = usuario; // <-- ESSA LINHA É FUNDAMENTAL
//     next();
//   });
// }
import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "Token não fornecido." });
  }

  jwt.verify(token, "senha_senha", (err, usuario) => {
    if (err) {
      return res.status(403).json({ msg: "Token inválido." });
    }

    // Debug: verificar o conteúdo do token decodificado
    console.log("Token decodificado:", usuario);

    // Garante que o req.usuario tenha id e nome
    if (!usuario.id || !usuario.nome) {
      return res
        .status(400)
        .json({ msg: "Token malformado: id ou nome ausente." });
    }

    req.usuario = usuario;
    next();
  });
}
