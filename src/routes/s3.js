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

const bucketName = process.env.AWS_BUCKET_NAME;
router.get('/arquivos', async (req, res) => {
    const allFilesData = [];
    arquivos64 = [];
    try {
        const listObjectsCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: req.query.prefix || ''
        });

        const s3ObjectList = await s3Client.send(listObjectsCommand);

        if (!s3ObjectList.Contents || s3ObjectList.Contents.length === 0) {
            return res.status(200).json({ message: 'Nenhum arquivo encontrado.', files: [] });
        }

        for (const s3Object of s3ObjectList.Contents) {
            const fileKey = s3Object.Key;

            if (fileKey.endsWith('/')) {
                continue;
            }
            let fileType = '';
            let mimeType = '';
            let parsedContent = null;
            let base64Data = '';

            const nomeArquivo = fileKey.toLowerCase();
            try {
                const getObjectCommand = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: fileKey
                });
                const arquivo = await s3Client.send(getObjectCommand);

                const arquivoEmString = await arquivo.Body.transformToString('utf-8');

                if (nomeArquivoLowerCase.endsWith('.csv')) {
                    mimeTypeParaFrontend = 'text/csv';
                    tipoArquivoParaResposta = 'csv';
                    arquivosPreparadosParaIA.push({
                        mimeType: mimeTypeParaFrontend,
                        content: arquivoEmString,
                        nomeArquivo: nomeArquivoOriginal
                    });
                    conteudoParseadoParaResposta = parse(arquivoEmString, {
                        columns: true,
                        skip_empty_lines: true,
                        trim: true
                    });
                } else {
                    continue;
                }

                if (nomeArquivo.endsWith('.csv')) {
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
                console.error(`Erro ao processar o arquivo ${fileKey}:`, error.message);
                allFilesData.push({
                    fileName: fileKey,
                    error: `Falha ao processar arquivo: ${error.message}`
                });
            }
        }
        res.status(200).json({
            message: 'Arquivos processados com sucesso.',
            files: allFilesData,
            arquivos64: arquivos64
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