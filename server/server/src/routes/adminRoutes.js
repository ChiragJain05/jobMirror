import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect, // Step 1: verify token
  authorize("admin"), // Step 2: check role
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  },
);

export default router;
