const {S3Client, ListObjectsV2Command} = require('@aws-sdk/client-s3');
require('dotenv');

const bucket = process.env.S3_BUCKET

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

async function listarArquivosPorCaminho(caminho) {
    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        Prefix: caminho
    });

    const response = await s3.send(command);

    console.log('Objetos retornados:', response.Contents);

    return (response.Contents || []).map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified
    }));
}


module.exports = {
    listarArquivosPorCaminho
}

