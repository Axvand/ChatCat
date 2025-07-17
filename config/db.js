import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

const mysql2 = mysql;

// export const db = mysql2.createPool({

//   host: process.env.DB_HOST,
//   user: process.env.DB_USER, // Altere aqui
//   password: process.env.DB_PASSWORD, // Altere aqui
//   database: process.env.DB_NAME, // Altere aqui
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port:process.env.DB_PORT
});
