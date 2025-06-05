const express = require('express');
const router = express.Router();
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { parse } = require('csv-parse/sync');

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

const bucketName = process.env.S3_BUCKET;
const baseDirectory = 'felipe/'; // Define o diretório base

router.get('/arquivos', async (req, res) => {
    const allFilesData = [];

    try {
        let effectivePrefix = baseDirectory;
        if (req.query.prefix) {
            // Remove uma possível barra inicial de req.query.prefix para evitar duplicidade
            const queryPrefix = req.query.prefix.startsWith('/') ? req.query.prefix.substring(1) : req.query.prefix;
            effectivePrefix += queryPrefix;
        }

        const listObjectsCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: effectivePrefix // Usa o prefixo modificado
        });

        const s3ObjectList = await s3Client.send(listObjectsCommand);

        if (!s3ObjectList.Contents || s3ObjectList.Contents.length === 0) {
            return res.status(200).json({ message: `'Nenhum arquivo encontrado em' ${effectivePrefix}`, files: [] });
        }

        for (const s3Object of s3ObjectList.Contents) {
            const fileKey = s3Object.Key;

            // Pula "pastas" (objetos que terminam com /)
            if (fileKey.endsWith('/')) {
                continue;
            }

            const nomeArquivo = fileKey.toLowerCase();
            try {
                const getObjectCommand = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: fileKey
                });
                const arquivo = await s3Client.send(getObjectCommand);

                const arquivoEmString = await arquivo.Body.transformToString('utf-8');

                let arquivoFInal;
                let fileType = '';

                if (nomeArquivo.endsWith('.csv')) {
                    fileType = 'csv';
                    arquivoFInal = parse(arquivoEmString, {
                        columns: true,
                        skip_empty_lines: true,
                        trim: true
                    });
                } else if (nomeArquivo.endsWith('.json')) {
                    fileType = 'json';
                    arquivoFInal = JSON.parse(arquivoEmString);
                }

                if (arquivoFInal) {
                    allFilesData.push({
                        fileName: fileKey,
                        fileType: fileType,
                        data: arquivoFInal
                    });
                }
            } catch (error) {
                console.error(`Erro ao processar o arquivo ${ fileKey }:`, error.message);
                allFilesData.push({
                    fileName: fileKey,
                    error: `Falha ao processar arquivo: ${ error.message }`
});
}
}
res.status(200).json({
    message: 'Arquivos processados com sucesso.',
    files: allFilesData
});

} catch (erro) {
    console.error('Erro geral ao listar ou processar arquivos do S3:', erro);
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Falha geral ao processar arquivos do S3.',
            details: erro.message
        });
    }
}
});

module.exports = router;