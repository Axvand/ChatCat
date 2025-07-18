const rota1 = "https://chatcat-1-5v1n.onrender.com";
const rotalocal1 = "http://localhost:3006";

const socket = io(rota1);

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

  chat.scrollTop = chat.scrollHeight;
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
  }, 3000);
});
