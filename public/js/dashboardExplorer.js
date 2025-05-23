
let selects = [];

function selecionarArquivo(fileElement) {
    const filePath = fileElement.getAttribute('filePath');
    const index = selects.indexOf(filePath);
    const dropList = document.querySelector('drop-list');

    if (index !== -1) {
        selects.splice(index, 1);
        fileElement.setAttribute('selected', 'no');

        const itemParaRemover = dropList.querySelector(`list-item[filePath="${filePath}"]`);
        if (itemParaRemover) itemParaRemover.remove();
    } else {
        if (selects.length >= 10) {
            Swal.fire({
                icon: "error",
                title: "Limite de arquivos alcançado",
                text: "Só é possível selecionar 10 arquivos para análise",
            });
            return;
        }

        selects.push(filePath);
        fileElement.setAttribute('selected', 'yes');

        const listItem = document.createElement('list-item');
        listItem.setAttribute('fileName', fileElement.getAttribute('machineName'));
        listItem.setAttribute('fileDate', fileElement.getAttribute('fileDate').split(',')[0]);
        listItem.setAttribute('filePath', filePath);

        listItem.remover = () => {
            selecionarArquivo(fileElement);
        };

        dropList.appendChild(listItem);
    }

    if (dropList) {
        dropList.setAttribute('qtdSelects', selects.length);
        dropList.shadowRoot.querySelector('.SelectValue').textContent = `${selects.length} DE 10`;
    }

    console.log(selects);
}

function formatarNomeArquivo(nomeArquivo) {
    if (!nomeArquivo) return '[Sem nome]';

    const partes = nomeArquivo.split('_');

    if (partes.length >= 2) {
        const empresa = partes[0];
        const id = partes[1];
        return `${empresa} ${id}`;
    }

    return nomeArquivo;
}

function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

async function buscarEListarArquivos(path) {
    try {
        const response = await fetch(`/s3/listar-arquivos?path=${encodeURIComponent(path)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro desconhecido');
        }

        const container = document.getElementById('explorer-container');
        container.innerHTML = '';

        const arquivosNoNivelAtual = data.arquivos.filter(arquivo => {
            const key = arquivo.caminhoCompleto;
            const subPath = key.replace(path, '').replace(/^\/+/, '');
            const partes = subPath.split('/').filter(Boolean);
            return partes.length === 1;
        });

        arquivosNoNivelAtual.forEach(arquivo => {
            const fileElement = document.createElement('file-element');

            const isFolder = arquivo.caminhoCompleto.endsWith('/');

            const nomeExtraido = isFolder
                ? arquivo.caminhoCompleto.split('/').filter(Boolean).pop() || '[Pasta]'
                : formatarNomeArquivo(arquivo.nome);

            fileElement.setAttribute('machineName', nomeExtraido);
            fileElement.setAttribute('fileDate', arquivo.ultimaModificacao ? new Date(arquivo.ultimaModificacao).toLocaleString() : '---');
            fileElement.setAttribute('fileSize', formatSize(arquivo.tamanho ?? 0));
            fileElement.setAttribute('filePath', arquivo.caminhoCompleto);
            fileElement.setAttribute('type', isFolder ? 'folder' : 'file');
            fileElement.setAttribute('selected', selects.includes(arquivo.caminhoCompleto) ? 'yes' : 'no');

            if (isFolder) {
                fileElement.style.cursor = 'pointer';
                fileElement.onclick = () => buscarEListarArquivos(arquivo.caminhoCompleto);
            } else {
                fileElement.onclick = () => selecionarArquivo(fileElement);
            }

            container.appendChild(fileElement);
        });

        // 🔄 Atualiza a navegação de caminho (breadcrumb)
        atualizarPathContainer(path);

    } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
        alert('Erro ao buscar arquivos.');
    }
}

function atualizarPathContainer(path) {
    const pathContainer = document.querySelector('path-container');
    pathContainer.innerHTML = '';

    const partes = path.split('/').filter(Boolean);

    const rootElement = document.createElement('path-element');
    rootElement.setAttribute('pathPart', 'Meus Arquivos');
    rootElement.setAttribute('root', 'true');
    rootElement.addEventListener('click', () => buscarEListarArquivos(''));
    pathContainer.appendChild(rootElement);

    partes.forEach((parte, index) => {
        const separador = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        separador.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        separador.setAttribute('width', '40');
        separador.setAttribute('height', '40');
        separador.setAttribute('fill', 'currentColor');
        separador.setAttribute('class', 'bi bi-chevron-right');
        separador.setAttribute('viewBox', '0 0 16 16');
        separador.innerHTML = `
            <path fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
        `;
        pathContainer.appendChild(separador);

        const caminhoAtual = partes.slice(0, index + 1).join('/') + '/';

        const pathElement = document.createElement('path-element');
        pathElement.setAttribute('pathPart', parte);
        pathElement.addEventListener('click', () => buscarEListarArquivos(caminhoAtual));
        pathContainer.appendChild(pathElement);
    });
}

let arquivosRecebidos = [];

async function enviarArquivosSelecionados() {
    try {
        const response = await fetch('/s3/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ files: selects })
        });

        if (!response.ok) {
            throw new Error('Erro ao recuperar conteúdos dos arquivos.');
        }

        arquivosRecebidos = await response.json();
        console.log('Arquivos JSON recebidos:', arquivosRecebidos);


    } catch (error) {
        console.error('Erro no front-end ao buscar arquivos:', error);
        alert(error.message);
    }
}




buscarEListarArquivos('')