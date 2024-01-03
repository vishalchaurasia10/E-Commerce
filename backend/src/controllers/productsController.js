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
        const productId = req.params.productId;
        const originalProduct = await Products.findById(productId);
        if (!originalProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse the JSON-encoded object in productDetails
        const productDetails = JSON.parse(req.body.productDetails);

        // Extract imageId from the parsed productDetails
        const imagesToDelete = originalProduct.imageId.filter(imageUrl => !productDetails.imageId.includes(imageUrl));

        if (imagesToDelete.length > 0) {
            try {
                const deletePromises = imagesToDelete.map(async imageUrl => {
                    const imageKey = imageUrl.split('/').pop(); // Extract the key from the URL
                    await s3.deleteObject({
                        Bucket: 'forevertrendin-bucket',
                        Key: `products/${imageKey}`, // Adjust the key based on your S3 structure
                    }).promise();
                });

                // Wait for all delete promises to complete
                await Promise.all(deletePromises);
            } catch (error) {
                console.error('Error deleting product images from S3:', error);
                return res.status(500).json({ error: 'Error deleting product images from S3' });
            }
        }

        // Handle uploaded files
        const files = req.files || [];
        const uploadedFileUrls = [];

        // Process files (e.g., upload to S3)
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

            uploadedFileUrls.push(uploadResult.Location);
        }

        // Combine existing and uploaded image URLs
        const updatedImageUrls = [...productDetails.imageId, ...uploadedFileUrls];

        // Update the product with new details
        const updatedProduct = await Products.findByIdAndUpdate(
            productId,
            {
                ...productDetails,
                imageId: updatedImageUrls,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
        console.error('Error updating product:', error);
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the product to get the image URLs
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // If product images exist, delete them from S3
        if (product.imageId && product.imageId.length > 0) {
            try {
                const deletePromises = product.imageId.map(async imageUrl => {
                    const imageKey = imageUrl.split('/').pop(); // Extract the key from the URL
                    await s3.deleteObject({
                        Bucket: 'forevertrendin-bucket',
                        Key: `products/${imageKey}`, // Adjust the key based on your S3 structure
                    }).promise();
                });

                // Wait for all delete promises to complete
                await Promise.all(deletePromises);
            } catch (error) {
                console.error('Error deleting product images from S3:', error);
                return res.status(500).json({ error: 'Error deleting product images from S3' });
            }
        }

        // Remove the product document from the database
        const deletedProduct = await Products.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
};

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