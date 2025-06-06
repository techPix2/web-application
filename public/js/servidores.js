document.addEventListener("DOMContentLoaded", function () {
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");
    const container = document.getElementById("serverContainer");

    if (!idEmpresa || !container) {
        console.error("ID da empresa não encontrado ou container ausente.");
        return;
    }

    fetch(`/company/listar/${idEmpresa}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(servers => {
            if (servers.length === 0) {
                container.innerHTML = "<p>Nenhum usuário encontrado.</p>";
                return;
            }

            servers.forEach(server => {
                const userEl = document.createElement("server-element");
                userEl.setAttribute("hostName", server.hostName || "");
                userEl.setAttribute("macAddress", server.macAddress || "");
                userEl.setAttribute("mobuId", server.mobuId || "");
                container.appendChild(userEl);
            });
        })
        .catch(erro => {
            console.error("Erro ao carregar usuários:", erro);
            container.innerHTML = "<p>Erro ao carregar usuários.</p>";
        });
});
