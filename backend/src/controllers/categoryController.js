const Category = require('../models/Category');

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
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const deletedCategory = await Category.findByIdAndRemove(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
};

exports.searchCategories = async (req, res) => {
    try {
        const { name, type } = req.query;
        const searchCriteria = {};

        if (name) {
            // If name is provided, add it to the search criteria
            searchCriteria.title = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
        }

        if (type) {
            // If type is provided, add it to the search criteria
            searchCriteria.type = type;
        }

        const categories = await Category.find(searchCriteria);

        if (categories.length === 0) {
            return res.status(404).json({ error: 'No categories found for the specified criteria' });
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error searching for categories' });
    }
};