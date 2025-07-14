// Pega o token do localStorage
const token = localStorage.getItem("token");

if (!token) {
  // Se não tiver token, redireciona para o login
  window.location.href = "login.html";
} else {
  // Faz a requisição para a rota protegida (de dados)
  fetch("http://localhost:3000/api/dados-dashboard", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(async (res) => {
      const text = await res.text();

      if (res.status !== 200) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        const data = JSON.parse(text);
      }
    })
    .catch((err) => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("nome");
  localStorage.removeItem("avatar");
  window.location.href = "login.html";
  localStorage.removeItem("token");
  location.reload();
  setTimeout(() => {
    console.log("On!");
  }, 2000);
});

// ======================Post dados do usuário=========================================

// const token = localStorage.getItem("token");

const nome = localStorage.getItem("nome");

document.getElementById("nomeUsuario").innerText = nome;

if (!token) {
  window.location.href = "login.html";
}

// Seleção de avatar
const avatarImgs = document.querySelectorAll(".avatar-option");
avatarImgs.forEach((img) => {
  img.addEventListener("click", () => {
    avatarImgs.forEach((i) => i.classList.remove("selecionado"));
    img.classList.add("selecionado");
    document.getElementById("avatarSelecionado").value = img.dataset.avatar;
    console.log("Avatar selecionado:", img.dataset.avatar);
  });
});

// Envio do formulário
document.getElementById("perfilForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    humor: document.getElementById("humor").value,
    frase: document.getElementById("frase").value,
    avatar: document.getElementById("avatarSelecionado").value,
  };
  try {
    const res = await fetch("http://localhost:3000/perfil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    location.reload();
    alert(data.msg || "Perfil atualizado com sucesso!");
  } catch (err) {
    alert("Erro ao salvar perfil");
    console.log(err.message);
  }
});

// =======================Carregar dados=======================
// Carrega perfil formatado
// const nome = localStorage.getItem("nome");
// const token = localStorage.getItem("token");

fetch("http://localhost:3000/dashboardperfil", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("nomeUsuario").innerText = nome;
    document.getElementById("humorUsuario").innerText = data.humor;
    document.getElementById("fraseUsuario").innerText = `"${data.frase}"`;
    document.getElementById("avatarUsuario").src = "../imgs" + data.avatarUrl;
  })
  .catch((err) => {
    console.error(err);
    window.location.href = "login.html";
  });

// =========================================
document.getElementById("btnBuscar").addEventListener("click", async () => {
  const termo = document.getElementById("buscaUsuario").value;
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:3000/buscar?nome=${encodeURIComponent(termo)}`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  const usuarios = await res.json();

  const resultadosDiv = document.getElementById("resultadosBusca");
  resultadosDiv.innerHTML = ""; // limpa antes de preencher

  if (usuarios.length === 0) {
    resultadosDiv.innerText = "Nenhum usuário encontrado.";
    return;
  }

  usuarios.forEach((user) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <span>${user.nome}</span>
        <button class="btnSolicitar" data-id="${user.id}">Solicitar Conversa</button>
      `;
    resultadosDiv.appendChild(div);
  });
});
// ===========================================
// Evento delegado: como os botões são gerados dinamicamente
document
  .getElementById("resultadosBusca")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("btnSolicitar")) {
      const paraId = e.target.dataset.id;
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/solicitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ para_id: paraId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.msg);
        e.target.disabled = true;
        e.target.innerText = "Solicitado";
      } else {
        alert(data.erro || "Erro ao enviar solicitação");
      }
    }
  });

// ===============================================

async function carregarSolicitacoesRecebidas() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/recebidas", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const dados = await res.json();

    const lista = document.getElementById("solicitacoesRecebidas");
    lista.innerHTML = "";

    dados.forEach((sol) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${sol.nome}
        <button class="btnAceitar" data-id="${sol.usuario_id}">Aceitar</button>
        <button class="btnRecusar" data-id="${sol.usuario_id}">Recusar</button>
      `;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar solicitações:", err.message);
  }
}

document
  .getElementById("solicitacoesRecebidas")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("btnRecusar")) {
      const id = e.target.dataset.id;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`http://localhost:3000/recusar/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (res.ok) {
          alert("Solicitação recusada.");
          carregarSolicitacoesRecebidas(); // Recarrega a lista
        } else {
          const erro = await res.json();
          alert("Erro: " + erro.message);
        }
      } catch (err) {
        console.error("Erro ao recusar:", err.message);
      }
    }
  });

// Chama ao carregar
carregarSolicitacoesRecebidas();

//===========================================================
// Conectar com Socket.IO
const socket = io();

// Pegar dados salvos do usuário
const idUsuario = localStorage.getItem("id");
const nomeUsuario = localStorage.getItem("nome");

// Registrar o usuário no servidor
socket.emit("registrarUsuario", idUsuario);

// Aceitar solicitação
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnAceitar")) {
    const idSolicitante = e.target.dataset.id;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/aceitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ idSolicitante }),
      });

      const dados = await res.json();

      // Emitir evento para o servidor avisar o solicitante
      socket.emit("aceitarSolicitacao", {
        idSolicitante,
        idAceitador: idUsuario,
        nomeSolicitante: "", // não necessário aqui, só o nome de quem aceitou importa
        nomeAceitador: nomeUsuario,
      });

      // Redirecionar quem aceitou
      localStorage.setItem("sala", dados.sala);
      window.location.href = "sala.html";
    } catch (err) {
      console.error("Erro ao aceitar:", err.message);
    }
  }
});

// Receber evento de aceitação (para o solicitante)
socket.on("aceito", ({ sala, nome }) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <p>${nome} aceitou sua solicitação!</p>
    <button id="btnEntrarSala">Entrar na sala</button>
  `;
  document.body.appendChild(div);

  document.getElementById("btnEntrarSala").addEventListener("click", () => {
    localStorage.setItem("sala", sala);
    window.location.href = "sala.html";
  });
});
