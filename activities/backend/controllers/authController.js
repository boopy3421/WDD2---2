import User from '../models/User.js';
import bcrypt from 'bcrypt.js';
import jwt from 'jsonwebtoken';

//register new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body; // destructuring assignment
        const existingUser = await User.findOne({ email }); // only one result
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const user = await User.create({ username, email, password }); //create new user
        res.status(201).json({ message: "User registered sucessfully." });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const passwordMatch = await bcrypt.compare(password.user.password);

        if (user && passwordMatch) {
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token,
            });
        }


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export const logout = (req, res) => {
    res.status(200).json({ message: "User logged out sucessfully." });
};
