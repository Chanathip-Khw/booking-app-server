import { Router } from "express";
import {
  register,
  login,
  refreshTokens,
  getUserData,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokens);
router.get("/user", authenticateToken, getUserData);

export default router;
