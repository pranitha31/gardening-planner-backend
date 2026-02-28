// src/routes/reminderRoutes.js
import express from "express";
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  completeReminder
} from "../controllers/reminderController.js";

//import { verifyToken } from "../middleware/authMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router(); 

// Apply middleware + controllers
router.post("/", authMiddleware, createReminder);
router.get("/", authMiddleware, getReminders);
router.put("/:id", authMiddleware, updateReminder);
router.delete("/:id", authMiddleware, deleteReminder);
router.put("/:id/complete", authMiddleware, completeReminder);




export default router;
