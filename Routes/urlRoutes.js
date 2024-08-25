// routes/urlRoutes.js
import express from 'express';
import { shortenUrl, redirectUrl, getAllUrls, deleteUrl } from '../Controllers/urlController.js';
import { authenticateToken, checkUserRole } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/:shortUrl', redirectUrl);

router.get('/', authenticateToken, checkUserRole(['admin']), getAllUrls); // Route to get all URLs with pagination
router.delete('/:id', authenticateToken, checkUserRole(['admin']), deleteUrl); // Route to delete a URL by its ID

export default router;
