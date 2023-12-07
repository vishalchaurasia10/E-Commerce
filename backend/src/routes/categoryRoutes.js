const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const uploadMiddleware = require('../middlewares/uploadMiddleware');
const aws = require('aws-sdk');
const { Readable } = require('stream');
const multer = require('multer');

// AWS S3 Configuration
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Multer middleware to parse the form data
const upload = multer();

// Create a new category
router.post('/', categoryController.createCategory);

// Search categories by either title or type
router.get('/search', categoryController.searchCategories);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:categoryId', categoryController.getCategoryById);

// Update a category by ID
router.put('/:categoryId', categoryController.updateCategory);

// Delete a category by ID
router.delete('/:categoryId', categoryController.deleteCategory);

// Handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        // Ensure that the request contains a file
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const fileName = `categories/${Date.now()}-${file.originalname}`; // Updated Key

        // Create a Readable stream from the buffer
        const fileStream = Readable.from(file.buffer);

        // Upload the file to S3
        s3.upload(
            {
                Bucket: 'forevertrendin-bucket',
                Key: fileName,
                Body: fileStream,
                ContentType: file.mimetype,
            },
            (error, data) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error uploading file to S3' });
                }

                // File uploaded successfully, return S3 URL
                res.json({ status: 'success', message: 'File uploaded successfully', fileId: data.Location });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;