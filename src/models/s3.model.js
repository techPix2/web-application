const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { parse } = require('csv-parse/sync');
const { Readable } = require('stream');
require('dotenv').config();

const bucket = process.env.S3_BUCKET;

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
        Bucket: bucket,
        Prefix: caminho
    });

    const response = await s3.send(command);

    return (response.Contents || []).map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified
    }));
}

async function streamToString(stream) {
    return await new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
}

async function getFileContent(filePath) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: filePath
    });

    const response = await s3.send(command);
    const csvString = await streamToString(response.Body);

    const records = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    return records;
}

module.exports = {
    listarArquivosPorCaminho,
    getFileContent
};