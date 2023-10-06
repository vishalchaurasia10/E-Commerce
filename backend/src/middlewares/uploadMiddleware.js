const multer = require('multer');

// Define multer storage configuration for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split('.').pop(); // Get the file extension
        const filename = `${uniqueId}.${fileExtension}`;
        req.uploadedFileId = uniqueId; // Store the unique ID in the request object
        cb(null, filename);
    },
});

const upload = multer({ storage });

module.exports = upload;