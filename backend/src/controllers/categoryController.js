const Category = require('../models/Category');
const aws = require('aws-sdk');

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

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
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
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            req.body,
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
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