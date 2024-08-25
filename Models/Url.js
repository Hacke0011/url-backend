import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

// Create a custom alphabet for the short URL
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        default: () => nanoid(), // Generate a unique short URL with 10 characters
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Url = mongoose.model('Url', urlSchema);

export default Url;
