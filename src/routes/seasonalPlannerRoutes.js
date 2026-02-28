import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import {
  createSeasonalPlant,
  getSeasonalPlants,
  updateSeasonalPlant,
  deleteSeasonalPlant
} from "../controllers/seasonalPlannerController.js";


//import { verifyToken } from "../middleware/authMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
// CREATE plant with image
router.post("/", authMiddleware, upload.single("image"), createSeasonalPlant);

router.post("/", authMiddleware, createSeasonalPlant);
router.get("/", authMiddleware, getSeasonalPlants);
router.put("/:id", authMiddleware, updateSeasonalPlant);
router.delete("/:id", authMiddleware, deleteSeasonalPlant);

export default router;