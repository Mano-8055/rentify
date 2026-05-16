import express from "express";
import {
  createRental,
  getMyRentals,
  getOwnerRequests,
  acceptRental,
  rejectRental,
  markReturned,
  completeRental,
} from "../controllers/rentalControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRental);
router.get("/my-rentals", protect, getMyRentals);
router.get("/owner-requests", protect, getOwnerRequests);
router.put("/:id/accept", protect, acceptRental);
router.put("/:id/reject", protect, rejectRental);
router.put("/:id/return", protect, markReturned);
router.put("/:id/complete", protect, completeRental);

export default router;
