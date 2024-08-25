import jwt from 'jsonwebtoken';
import User from '../Models/User.js'; // Adjust the import path as needed

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database to ensure it exists and is valid
        const user = await User.findById(decoded._id).select('-password');;
        if (!user) {
            return res.status(401).json({ message: 'Invalid Token: User not found' });
        }

        req.user = user;
        
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

// Middleware to check user role
export const checkUserRole = (roles) => {
    return (req, res, next) => {
        console.log('req.user.role', req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        next();
    };
};
