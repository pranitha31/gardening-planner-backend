import express from "express";
import { updateLocation, getMyLocation } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed ✅",
    user: req.user,
  });
});

router.get("/my-location", protect, getMyLocation);
router.put("/update-location", protect, updateLocation);

export default router;