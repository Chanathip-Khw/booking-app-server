import { Router } from 'express';
import { bookDate, getBookings } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/book', authMiddleware, bookDate);
router.get('/', authMiddleware, getBookings);

export default router;