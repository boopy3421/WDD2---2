import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    try {
        const { user, items } = req.body;

        if (!user || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'User and at least one item are required.' });
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
