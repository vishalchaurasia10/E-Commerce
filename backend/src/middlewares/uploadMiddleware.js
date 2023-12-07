const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// Configure AWS SDK with your credentials
aws.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    region: 'YOUR_AWS_REGION',
});

// Create an S3 instance
const s3 = new aws.S3();

// Define the S3 bucket name
const bucketName = 'your-s3-bucket-name';

// Define multer storage configuration for S3
const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read', // Set ACL permissions for the uploaded file
    key: (req, file, cb) => {
        const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split('.').pop();
        const filename = `${uniqueId}.${fileExtension}`;
        req.uploadedFileId = filename;
        cb(null, filename);
    },
});

const upload = multer({ storage });

module.exports = upload;