// ===========================================================

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const senha = e.target.senha.value;

  const rota1 = "https://chatcat-1-5v1n.onrender.com/login";
  const rotalocal1 = "http://localhost:3006/login";

  try {
    const resposta = await fetch(rota1, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }), //aplicar filtro
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      // Salvar token e redirecionar
      localStorage.setItem("token", dados.token);
      localStorage.setItem("nome", dados.usuario.nome);
      localStorage.setItem("avatar", dados.usuario.avatar || "");
      window.location.href = "./dashboard.html";
    } else {
      document.getElementById("mensagemErro").innerText = dados.msg;
    }
  } catch (err) {
    document.getElementById("mensagemErro").innerText =
      "Erro ao conectar com o servidor.";
    console.error(err);
  }
});
