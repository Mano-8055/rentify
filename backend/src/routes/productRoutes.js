import express from "express";
import { addProduct, getNearbyProducts } from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/nearby", protect, getNearbyProducts);

export default router;