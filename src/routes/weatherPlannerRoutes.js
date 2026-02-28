import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { getSmartPlanner } from "../controllers/weatherPlannerController.js";
import { getWeather, getForecast } from "../services/weatherService.js";
const router = express.Router();


router.get("/", authMiddleware, getSmartPlanner);

export default router;