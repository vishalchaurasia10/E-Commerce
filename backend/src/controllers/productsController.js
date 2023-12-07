const Products = require('../models/Products');
const Category = require('../models/Category');
const aws = require('aws-sdk');
const { Readable } = require('stream');

// AWS S3 Configuration
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Products(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get products with pagination
exports.getProductsByPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
    const perPage = 12; // Number of products per page

    try {
        const totalProducts = await Products.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({ message: 'Invalid page number' });
        }

        const products = await Products.find()
            .skip((page - 1) * perPage) // Skip products on previous pages
            .limit(perPage); // Limit to perPage products

        res.status(200).json({ products, totalPages, currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
}

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productsId = req.params.productId;
        const products = await Products.findById(productsId);
        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
}

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const productsId = req.params.productId;
        const updatedProducts = await Products.findByIdAndUpdate(
            productsId,
            req.body,
            { new: true }
        );
        if (!updatedProducts) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating products' });
    }
}

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const productsId = req.params.productId;
        const deletedProducts = await Products.findByIdAndDelete(productsId);
        if (!deletedProducts) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting products' });
    }
}

exports.uploadProductImages = async (req, res) => {
    try {
        const files = req.files;

        // Ensure that files were uploaded
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }

        const uploadedFileIds = [];

        // Iterate through the files and upload them to S3
        for (const file of files) {
            const fileName = `products/${Date.now()}-${file.originalname}`; // Updated Key

            const fileStream = Readable.from(file.buffer);

            // Upload the file to S3
            const uploadResult = await s3.upload({
                Bucket: 'forevertrendin-bucket',
                Key: fileName,
                Body: fileStream,
                ContentType: file.mimetype,
            }).promise();

            uploadedFileIds.push(uploadResult.Location);
        }

        // Respond with success and file URLs
        res.status(200).json({ status: 'success', message: 'Files uploaded successfully', fileUrls: uploadedFileIds });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Error uploading files' });
    }
};

exports.getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Products.find({ featured: true });
        if (!featuredProducts) {
            return res.status(404).json({ message: 'Featured products not found' });
        }
        return res.status(200).json(featuredProducts);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching featured products' });
    }
}

exports.getProductsByType = async (req, res) => {
    try {
        const type = req.params.type;

        // Find all categories with the specified type
        const categories = await Category.find({ type });

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'Categories not found' });
        }

        // Collect the category IDs from the found categories
        const categoryIds = categories.map(category => category._id);

        // Find all products that have one of the matching category IDs
        const products = await Products.find({ category: { $in: categoryIds } });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products by type:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
}

exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Products.find({ category: categoryId });
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
}

exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Products.find({ $text: { $search: query } });
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
}