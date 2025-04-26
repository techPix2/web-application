var razaoSocial;
var cnpj;
var cep;
var rua;
var bairro;
var cidade;
var estado;
var numero;
function prosseguir(){

    if (document.getElementById('iptrazaosocial').value != null ||
        document.getElementById('iptcnpj').value != null ||
        document.getElementById('iptcep').value != null ||
        document.getElementById('iptrua').value != null ||
        document.getElementById('iptbairro').value != null ||
        document.getElementById('iptcidade').value != null ||
        document.getElementById('iptestado').value != null ||
        document.getElementById('iptnumero').value != null
    ){
        razaoSocial = document.getElementById('iptrazaosocial').value;
        cnpj = document.getElementById('iptcnpj').value;
        cep = document.getElementById('iptcep').value;
        rua = document.getElementById('iptrua').value;
        bairro = document.getElementById('iptbairro').value;
        cidade = document.getElementById('iptcidade').value;
        estado = document.getElementById('iptestado').value;
        numero = document.getElementById('iptnumero').value;
    } else{
        divmsg.innerHTML = "Preencha todos os campos"
    }
    form_login.innerHTML = `<div class="form_login_titulo">
                <h1>Bem-vindo(a)!</h1>
            </div>
            <div class="form_login_subtitulo">
                <h1>Cadastre-se</h1>
            </div>

            <div class="form">
                <input id="iptnome" placeholder="Nome">
            </div>
            
            <div class="form">
                <input id="iptemail" placeholder="Email">
            </div>

            <div class="form">
                <input id="iptcpf" placeholder="CPF">
            </div>
            
            <div class="form">
                <input id="iptsenha" placeholder="Senha">
            </div>

            <div class="form">
                <input id="iptconfsenha" placeholder="Confirmar senha">
            </div>
            
            <div class="form">
                <button onclick="cadastrarUsuario()">Cadastrar</button>
            </div>
            `

}
async function cadastrarEmpresa(){
    //const fk_endereco = sessionStorage.FK_ENDERECO;
    fk_endereco = 1;
    try {
        const response = await fetch(`/empresas/cadastrarEmpresa/${razaoSocial}/${cnpj}/${fk_endereco}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                razaoSocial: razaoSocial,
                cnpj: cnpj,
                fk_endereco: fk_endereco
            })
        })
        const respostaJson = await response.json();
        sessionStorage.FK_EMPRESA = await respostaJson["data"]["insertId"];
        if (!response.ok) {
            throw new Error(data.message || "Erro ao cadastrar funcionário");
        }
        alert("Funcionário cadastrado com sucesso!");
        closeModal();
        mostrarCards();
    } catch (error) {
        console.error("Erro:", error);
        alert(`Erro ao cadastrar: ${error.message}`);
    }
}
async function cadastrarEndereco(){
    fk_cidade = 1;
    try {
        const response = await fetch(`/empresas/cadastrarEndereco/${rua}/${numero}/${cep}/${bairro}/${fk_empresa}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rua:rua,
                numero:numero,
                cep:cep,
                bairro:bairro,
                fk_cidade:fk_cidade
            })

        })
        const respostaJson = await response.json();
        sessionStorage.FK_CIDADE = await respostaJson["data"]["insertId"];
        if (!response.ok) {
            throw new Error(data.message || "Erro ao cadastrar funcionário");
        }
        alert("Funcionário cadastrado com sucesso!");
        closeModal();
        mostrarCards();
    } catch (error) {
        console.error("Erro:", error);
        alert(`Erro ao cadastrar: ${error.message}`);
    }
}
async function cadastrarCidade(){
    if(document.getElementById('iptcidade').value != null){
        let cidade =  document.getElementById('iptcidade').value;
        try {
            const response = await fetch(`/empresas/cadastrarCidade/${cidade}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cidade: cidade,
                })

            })
            const respostaJson = await response.json();
            sessionStorage.FK_CIDADE = await respostaJson["data"]["insertId"];
            if (!response.ok) {
                throw new Error(data.message || "Erro ao cadastrar funcionário");
            }
            alert("Funcionário cadastrado com sucesso!");
            closeModal();
            mostrarCards();
        } catch (error) {
            console.error("Erro:", error);
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    }
}


async function cadastrarUsuario(){
        const email = document.getElementById("iptemail").value
        const nome = document.getElementById("iptnome").value
        const cpf = document.getElementById("iptcpf").value
        const senha = document.getElementById("iptsenha").value
        const fk_empresa = 1;
        try {
            await fetch(`/usuarios/cadastrar/${nome}/${cpf}/${email}/${senha}/${fk_empresa}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha,
                    cpf: cpf,
                    nome: nome,
                    fk_empresa:fk_empresa
                })

            })
        } catch (error) {
            console.error("Erro:", error);
            alert(`Erro ao cadastrar: ${error.message}`);
        }
}