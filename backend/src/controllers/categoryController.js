const Category = require('../models/Category');
const aws = require('aws-sdk');
const multer = require('multer');
const upload = multer();
const { Readable } = require('stream');

// AWS S3 Configuration
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { title, coverImageId, type } = req.body;
        const category = new Category({ title, coverImageId, type });
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all categories withoug pagination
exports.getAllCategoriesWithoutPagination = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            return res.status(404).json({ error: 'Categories not found' });
        }
        res.status(200).json({ categories: categories });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;
        const skipIndex = (page - 1) * limit;
        const categories = await Category.find().skip(skipIndex).limit(limit);
        const count = await Category.countDocuments();
        if (!categories) {
            return res.status(404).json({ error: 'Categories not found' });
        }
        res.status(200).json({ categories: categories, count: count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

//get categories by type
exports.getCategoriesByType = async (req, res) => {
    try {
        const type = req.params.type;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;
        const skipIndex = (page - 1) * limit;
        const categories = await Category.find({ type: type }).skip(skipIndex).limit(limit);
        const count = await Category.countDocuments({ type: type });
        if (!categories) {
            return res.status(404).json({ error: 'Categories not found' });
        }
        res.status(200).json({ categories: categories, count: count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};


// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching category' });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const file = req.file;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // If a new file is provided, delete the existing file from S3
        if (file && category.coverImageId) {
            try {
                const imageKey = category.coverImageId.split('/').pop(); // Extract the key from the URL
                await s3.deleteObject({
                    Bucket: 'forevertrendin-bucket',
                    Key: `categories/${imageKey}`, // Adjust the key based on your S3 structure
                }).promise();
            } catch (error) {
                console.error('Error deleting category image from S3:', error);
                return res.status(500).json({ error: 'Error deleting category image from S3' });
            }
        }

        // If a new file is provided, upload the new file to S3
        let updatedCoverImageId = category.coverImageId;
        if (file) {
            const fileName = `categories/${Date.now()}-${file.originalname}`;

            // Create a Readable stream from the buffer
            const fileStream = Readable.from(file.buffer);

            // Upload the file to S3
            const uploadParams = {
                Bucket: 'forevertrendin-bucket',
                Key: fileName,
                Body: fileStream,
                ContentType: file.mimetype,
            };

            const uploadResult = await s3.upload(uploadParams).promise();
            updatedCoverImageId = uploadResult.Location;
        }

        // Update the document with new data
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                title: req.body.title,
                type: req.body.type,
                coverImageId: updatedCoverImageId,
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({
            status: 'success',
            message: 'Category updated successfully',
            fileId: updatedCoverImageId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating category' });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // Find the category to get the image URL
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // If a category image exists, delete it from S3
        if (category.coverImageId) {
            try {
                const imageKey = category.coverImageId.split('/').pop(); // Extract the key from the URL
                await s3.deleteObject({
                    Bucket: 'forevertrendin-bucket',
                    Key: `categories/${imageKey}`, // Adjust the key based on your S3 structure
                }).promise();
            } catch (error) {
                console.error('Error deleting category image from S3:', error);
                return res.status(500).json({ error: 'Error deleting category image from S3' });
            }
        }

        // Remove the category document from the database
        const deletedCategory = await Category.findByIdAndRemove(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Error deleting category' });
    }
};

exports.searchCategories = async (req, res) => {
    try {
        const { title, type } = req.query;
        const searchCriteria = {};

        if (title) {
            // If name is provided, add it to the search criteria
            searchCriteria.title = { $regex: new RegExp(title, 'i') }; // Case-insensitive search
        }

        if (type) {
            // If type is provided, add it to the search criteria
            searchCriteria.type = type;
        }

        const categories = await Category.find(searchCriteria);

        if (categories.length === 0) {
            return res.status(404).json({ message: 'No categories found for the specified criteria' });
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};