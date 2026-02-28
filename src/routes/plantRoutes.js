import express from "express";
import {
  createPlant,
  getPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE plant with image
router.post("/", authMiddleware, upload.single("image"), createPlant);

// GET all
router.get("/", authMiddleware, getPlants);

// GET single
router.get("/:id", authMiddleware, getPlantById);

// UPDATE with optional image
router.put("/:id", authMiddleware, upload.single("image"), updatePlant);

// DELETE
router.delete("/:id", authMiddleware, deletePlant);

export default router;