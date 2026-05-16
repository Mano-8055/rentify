import express from "express";
import {
  getProfile,
  updateProfile,
  updateLocation,
  uploadGovernmentId,
  getUserById,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { profileUpload, govIdUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, profileUpload, updateProfile);
router.put("/location", protect, updateLocation);
router.post("/govt-id", protect, govIdUpload, uploadGovernmentId);
router.get("/:id", getUserById);

export default router;
