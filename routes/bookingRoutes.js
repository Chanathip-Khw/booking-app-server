import { Router } from "express";
import { bookDate, getBookings } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/book", authMiddleware.authenticateToken, bookDate);
router.get("/", authMiddleware.authenticateToken, getBookings);

export default router;
