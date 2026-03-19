import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, default: 'General', trim: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        countInStock: { type: Number, required: true, default: 0, min: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('Product', productSchema);
