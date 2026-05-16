import express from "express";
import {
  addProduct,
  getAllProducts,
  getNearbyProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { productUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/nearby", getNearbyProducts);
router.get("/mine", protect, getMyProducts);
router.get("/:id", getProductById);
router.post("/", protect, productUpload, addProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
