const multer = require('multer');
const fs = require('fs');

// Function to create destination folder if it doesn't exist
const createDestinationFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Function to set the destination folder based on the folderName parameter
const setDestination = (folderName) => (req, file, cb) => {
    const destinationFolder = `./uploads/${folderName}`;
    createDestinationFolder(destinationFolder); // Create the folder if it doesn't exist
    cb(null, destinationFolder);
};

// Define multer storage configuration for local storage
const storage = multer.diskStorage({
    destination: setDestination('products'), // Default destination folder
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
