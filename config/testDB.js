// testDB.js
import { db } from "./db.js"; // Corrigido o nome da importação

async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS resultado");
    console.log(
      "✅ Conexão bem-sucedida! Resultado da query:",
      rows[0].resultado
    );
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
  } finally {
    process.exit();
  }
}

testConnection();
