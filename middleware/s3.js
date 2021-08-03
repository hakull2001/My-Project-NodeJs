const S3 = require("aws-sdk/clients/s3");
require("dotenv").config({ path: "./config/config.env" });
const fs = require("fs");
//upload a file to S3
const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});
module.exports = {
    uploadFileS3: (file) => {
        const fileStream = fs.createReadStream(file.path);
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fileStream,
            Key: file.filename
        };
        return s3.upload(uploadParams).promise();
    },
    getFileStreamS3: (keyStream) => {
        const downloadParams = {
        Key: keyStream,
        Bucket: process.env.AWS_BUCKET_NAME,
        };

        return s3.getObject(downloadParams).createReadStream();
  },
}