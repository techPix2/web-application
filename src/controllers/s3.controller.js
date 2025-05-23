const s3Model = require('../models/s3.model')

async function listarArquivos(req, res) {
    const { path } = req.query;

    try {
        const arquivos = await s3Model.listarArquivosPorCaminho(path);

        if (!arquivos || arquivos.length === 0) {
            console.warn(`Nenhum arquivo encontrado no caminho: "${path}"`);
        }

        const arquivosFormatados = arquivos
            .filter((arquivo) => arquivo && arquivo.key)
            .map((arquivo) => ({
                nome: arquivo.key.split('/').pop(),
                caminhoCompleto: arquivo.key,
                tamanho: arquivo.size,
                ultimaModificacao: arquivo.lastModified,
            }));

        res.json({ arquivos: arquivosFormatados });
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        res.status(500).json({ error: 'Erro ao listar os arquivos.' });
    }
}

async function getFilesContent(req, res) {
    try {
        const files = req.body.files;
        if (!files || !Array.isArray(files)) {
            return res.status(400).json({ error: 'O array "files" é obrigatório no corpo da requisição' });
        }

        const results = [];

        for (const filePath of files) {
            try {
                const content = await s3Model.getFileContent(filePath);
                results.push({ filePath, content });
            } catch (error) {
                results.push({ filePath, error: error.message });
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Erro no controller:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

module.exports = {
    listarArquivos,
    getFilesContent
};