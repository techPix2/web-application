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
            fileElement.setAttribute('fileSize', arquivo.tamanho ?? 0);
            fileElement.setAttribute('filePath', arquivo.caminhoCompleto);
            fileElement.setAttribute('type', isFolder ? 'folder' : 'file');

            if (isFolder) {
                fileElement.style.cursor = 'pointer';
                fileElement.onclick = () => buscarEListarArquivos(arquivo.caminhoCompleto);
            }

            container.appendChild(fileElement);
        });

    } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
        alert('Erro ao buscar arquivos.');
    }
}


buscarEListarArquivos('')