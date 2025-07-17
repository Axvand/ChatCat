const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const res = await fetch("https://chatcat-1-5v1n.onrender.com/cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resultado = await res.json();
  alert(resultado.mensagem || resultado.erro);
});
