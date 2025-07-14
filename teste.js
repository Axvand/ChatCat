import bcrypt from "bcrypt";

const senha = "1234";
const hash = "$2b$10$8la8EzIdTQQ00JrwHlEbdOYZSZl7PQQi2oojOvs.MwbGm5c3g6vPK";

console.log("Senha:", senha);
console.log("Hash gerado:", hash);

const ok = await bcrypt.compare(senha, hash);
console.log("Hash confere?", ok); // precisa ser true
