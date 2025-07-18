const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const rota2 = "https://chatcat-1-5v1n.onrender.com/cadastro";
  const rotalocal2 = "http://localhost:3006/cadastro";

  const res = await fetch(rota2, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resultado = await res.json();
  alert(resultado.mensagem || resultado.erro);
});
