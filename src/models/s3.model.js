const {S3Client, ListObjectsV2Command} = require('@aws-sdk/client-s3');
require('dotenv');

const bucket = process.env.S3_BUCKET

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function listarArquivosPorCaminho(path) {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: path
    })

    const response = await s3.send(command);
    return (response.Contents || []).map(obj => ({
        key: obj.key,
        size: obj.Size,
        lastModified: obj.LastModified
    }))
};

module.exports = {
    listarArquivosPorCaminho
}

