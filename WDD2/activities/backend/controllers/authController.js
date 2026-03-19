import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//register new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body; // destructuring assignment
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        const existingUser = await User.findOne({ email }); // only one result
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create({ username, email, password }); //create new user
        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (user && passwordMatch) {
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token,
            });
        }

        return res.status(401).json({ message: 'Invalid email or password.' });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export const logout = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully.' });
};
