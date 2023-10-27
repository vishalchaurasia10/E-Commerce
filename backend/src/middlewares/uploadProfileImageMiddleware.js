const multer = require('multer');
const fs = require('fs');

// Define the destination folder path
const destinationFolder = './uploads/profiles';

// Create the destination folder if it doesn't exist
if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
}

// Define multer storage configuration for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destinationFolder); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split('.').pop(); // Get the file extension
        const filename = `${uniqueId}.${fileExtension}`;
        req.uploadedFileId = filename; // Store the unique ID in the request object
        cb(null, filename);
    },
});

const upload = multer({ storage });

module.exports = upload;
