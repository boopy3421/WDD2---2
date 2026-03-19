import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['User', 'Admin', 'Moderator'],
            default: 'User'
        },
    },
    { timestamps: true }
);

// Mongoose 9 uses promise-style async hooks; no next callback needed.
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model('User', userSchema);