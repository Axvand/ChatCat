// const socket = io();

// // Recupera nome e sala (supondo que você salva isso no localStorage ao aceitar o chat)
// const nome = localStorage.getItem("nome");
// const sala = localStorage.getItem("sala");

// // Entra na sala
// socket.emit("entrarSala", { nome, sala });

// const input = document.getElementById("mensagemInput");
// const form = document.getElementById("formMensagem");
// const mensagensDiv = document.getElementById("mensagens");
// const digitandoDiv = document.getElementById("digitando");

// // Quando alguém está digitando
// input.addEventListener("input", () => {
//   socket.emit("digitando", { sala, texto: input.value });
// });

// // Quando envia mensagem
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const msg = input.value.trim();
//   if (msg) {
//     socket.emit("mensagem", { sala, nome, texto: msg });
//     input.value = "";
//     socket.emit("digitando", { sala, texto: "" }); // limpa aviso de digitação
//   }
// });

// // Recebe mensagem
// socket.on("mensagem", ({ nome, texto }) => {
//   const p = document.createElement("p");
//   p.textContent = `${nome}: ${texto}`;
//   mensagensDiv.appendChild(p);
//   digitandoDiv.innerText = ""; // limpa se alguém estava digitando
// });

// // Mostra digitação em tempo real
// socket.on("digitando", ({ nome, texto }) => {
//   digitandoDiv.innerText = texto ? `${nome} está digitando: ${texto}` : "";
// });
// socket.on("iniciarChat", ({ nomeSala }) => {
//   localStorage.setItem("sala", nomeSala);
//   window.location.href = "sala.html";
// });
const socket = io("http://localhost:3000");

// Pegando nome e sala do localStorage
const nome = localStorage.getItem("nome");
const sala = localStorage.getItem("sala");

if (!nome || !sala) {
  alert("Nome ou sala não definidos.");
  window.location.href = "dashboard.html";
}

socket.emit("entrarSala", { nome, sala });

const inputMensagem = document.getElementById("mensagem");
const chat = document.getElementById("chat");

// Enviar mensagem ao apertar Enter
inputMensagem.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const texto = inputMensagem.value.trim();
    if (texto !== "") {
      socket.emit("mensagem", { sala, nome, texto });
      inputMensagem.value = "";
    }
  } else {
    // Emitir evento digitando a cada tecla
    socket.emit("digitando", { sala, texto: inputMensagem.value });
  }
});

// Mostrar mensagem recebida
socket.on("mensagem", ({ nome, texto }) => {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${nome}:</strong> ${texto}`;
  chat.appendChild(div);
});

// Mostrar o texto em tempo real que o outro está digitando
socket.on("digitando", ({ nome, texto }) => {
  const id = `preview-${nome}`;
  let preview = document.getElementById(id);

  if (!preview) {
    preview = document.createElement("div");
    preview.id = id;
    preview.style.fontStyle = "arial san-serife";
    preview.style.color = "gray";
    chat.appendChild(preview);
  }

  preview.innerText = `${nome}: ${texto}`;

  // Limpar preview depois de 2s sem digitação
  clearTimeout(preview.timeout);
  preview.timeout = setTimeout(() => {
    preview.remove();
  }, 2000);
});
