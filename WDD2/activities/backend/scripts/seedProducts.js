import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
    {
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 24.99,
        description: 'Ergonomic 2.4GHz wireless mouse with silent click buttons.',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=900',
        countInStock: 40,
    },
    {
        name: 'Mechanical Keyboard',
        category: 'Accessories',
        price: 79.99,
        description: 'RGB mechanical keyboard with hot-swappable blue switches.',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=900',
        countInStock: 22,
    },
    {
        name: '27-inch Monitor',
        category: 'Displays',
        price: 219.99,
        description: 'Full HD IPS monitor with 75Hz refresh rate and ultra-thin bezel.',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900',
        countInStock: 16,
    },
    {
        name: 'USB-C Docking Station',
        category: 'Accessories',
        price: 54.5,
        description: 'Multi-port dock with HDMI, Ethernet, and USB 3.0 expansion.',
        image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=900',
        countInStock: 30,
    },
    {
        name: 'Noise Cancelling Headphones',
        category: 'Audio',
        price: 129,
        description: 'Over-ear headphones with active noise cancellation and deep bass.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900',
        countInStock: 18,
    },
    {
        name: 'Portable SSD 1TB',
        category: 'Storage',
        price: 94.99,
        description: 'High-speed USB 3.2 portable SSD with metal shockproof casing.',
        image: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?w=900',
        countInStock: 35,
    },
    {
        name: '1080p Webcam',
        category: 'Video',
        price: 39.99,
        description: 'Full HD webcam with dual microphones and privacy shutter.',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900',
        countInStock: 27,
    },
    {
        name: 'Laptop Stand',
        category: 'Office',
        price: 21,
        description: 'Aluminum adjustable stand for better ergonomics and airflow.',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900',
        countInStock: 45,
    },
    {
        name: 'Gaming Chair',
        category: 'Furniture',
        price: 189.99,
        description: 'Reclining gaming chair with lumbar support and headrest pillow.',
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900',
        countInStock: 12,
    },
    {
        name: 'Bluetooth Speaker',
        category: 'Audio',
        price: 49.99,
        description: 'Portable waterproof speaker with 12-hour battery life.',
        image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=900',
        countInStock: 33,
    },
    {
        name: 'LED Desk Lamp',
        category: 'Office',
        price: 28.75,
        description: 'Dimmable LED lamp with USB charging port and touch controls.',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900',
        countInStock: 38,
    },
    {
        name: 'Smart Watch',
        category: 'Wearables',
        price: 159.99,
        description: 'Fitness smartwatch with heart-rate monitor and sleep tracking.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900',
        countInStock: 20,
    },
];

const seedProducts = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const operations = sampleProducts.map((product) => ({
        updateOne: {
            filter: { name: product.name },
            update: { $set: product },
            upsert: true,
        },
    }));

    const result = await Product.bulkWrite(operations);

    console.log(`Products inserted: ${result.upsertedCount}`);
    console.log(`Products updated: ${result.modifiedCount}`);
    console.log(`Total catalog size: ${await Product.countDocuments()}`);

    await mongoose.connection.close();
};

seedProducts()
    .then(() => {
        console.log('Product seeding complete.');
        process.exit(0);
    })
    .catch(async (error) => {
        console.error(`Seeding failed: ${error.message}`);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit(1);
    });
