const s3Model = require('../models/s3.model')

async function  listarArquivos(req, res) {
    const { path } = req.query;

    if(!path){
        return res.status(400).json({error: 'O Caminho é obrigatório'})
    }

    try{
        const files = await s3Model.listarArquivosPorCaminho(path);
        res.json({ files });
    } catch (error) {
        console.error('Erro ao listar arquivos: ', error)
        res.status(500).json({ error: 'Erro ao listar os arquivos.'})
    }
}


module.exports = {
    listarArquivos
};