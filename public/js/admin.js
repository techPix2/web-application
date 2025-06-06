document.addEventListener("DOMContentLoaded", function () {
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");
    const container = document.getElementById("userContainer");

    if (!idEmpresa || !container) {
        console.error("ID da empresa não encontrado ou container ausente.");
        return;
    }

    fetch(`/user/listar/${idEmpresa}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(usuarios => {
            if (usuarios.length === 0) {
                container.innerHTML = "<p>Nenhum usuário encontrado.</p>";
                return;
            }

            usuarios.forEach(usuario => {
                const userEl = document.createElement("user-element");
                userEl.setAttribute("userName", usuario.name || "");
                userEl.setAttribute("email", usuario.email || "");
                userEl.setAttribute("role", usuario.role || "");
                userEl.setAttribute("lastAccess", usuario.ultimoAcesso || "Nunca acessou");
                container.appendChild(userEl);
            });
        })
        .catch(erro => {
            console.error("Erro ao carregar usuários:", erro);
            container.innerHTML = "<p>Erro ao carregar usuários.</p>";
        });
});
