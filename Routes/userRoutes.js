import express from 'express';
import {
    addUser,
    loginUser,
    deleteUser,
    getAllUsers,
    updateUser
} from '../Controllers/userController.js'; // Adjust the path as needed
import { authenticateToken, checkUserRole } from '../Middleware/authMiddleware.js'; // Adjust the path as needed

const router = express.Router();

// Route to add a new user
router.post('/add', authenticateToken, checkUserRole(['admin']), addUser);

// Route for user login
router.post('/login', loginUser);

// Route to get all users with pagination (admin only)
router.get('/all', authenticateToken, checkUserRole(['admin']), getAllUsers);

// Route to delete a user (admin only)
router.delete('/delete/:userId', authenticateToken, checkUserRole(['admin']), deleteUser);

// Route to update a user (admin only)
router.put('/update/:userId', authenticateToken, checkUserRole(['admin']), updateUser);

export default router;
