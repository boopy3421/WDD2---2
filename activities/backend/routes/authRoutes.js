import express from 'express';
import { register, login, logout } from '../controllers/authController'

const router = express.Router();

// Register route
router.port('/register', register);

// Login route
router.port('/login', login);

// Logout route
router.port('/logout', logout);

export default router;