const s3Model = require('../models/s3.model')

async function listarArquivos(req, res) {
    const { path } = req.query;

    // if (!path) {
    //     return res.status(400).json({ error: 'O parâmetro "path" é obrigatório.' });
    // }

    try {
        const arquivos = await s3Model.listarArquivosPorCaminho(path);

        if (!arquivos || arquivos.length === 0) {
            console.warn(`Nenhum arquivo encontrado no caminho: "${path}"`);
        }

        // 🔐 Validar cada item antes de processar
        const arquivosFormatados = arquivos
            .filter((arquivo) => arquivo && arquivo.key) // <-- evita undefined
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


module.exports = {
    listarArquivos
};