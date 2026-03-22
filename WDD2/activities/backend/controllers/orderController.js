import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const { user, items } = req.body;

        if (!user || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'User and at least one item are required.' });
        }

        // Validate stock availability for all items before processing
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            const qty = Number(item.quantity || 0);

            if (product.countInStock < qty) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.name}". Available: ${product.countInStock}, Requested: ${qty}`,
                });
            }
        }

        // Decrement stock for each item
        for (const item of items) {
            const qty = Number(item.quantity || 0);
            await Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -qty },
            });
        }

        const totalPrice = items.reduce((sum, item) => {
            const qty = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            return sum + qty * price;
        }, 0);

        const order = await Order.create({
            user,
            items,
            totalPrice,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};