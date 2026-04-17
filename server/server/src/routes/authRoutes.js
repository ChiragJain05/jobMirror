import express from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/refresh", refresh);
router.post("/logout", logout);

// Example protected route
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
