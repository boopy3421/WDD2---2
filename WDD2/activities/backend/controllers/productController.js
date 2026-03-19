import Product from '../models/Product.js';

export const getProducts = async (_req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, category, price, description, image, countInStock } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required.' });
        }

        const product = await Product.create({
            name,
            category,
            price,
            description,
            image,
            countInStock,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description, image, countInStock } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                category,
                price,
                description,
                image,
                countInStock,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
