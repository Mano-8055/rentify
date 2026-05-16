import Rental from "../models/Rental.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { calculateTrustScore } from "../utils/calculateTrustScore.js";

export const createRental = async (req, res) => {
  try {
    const { productId, startDate, endDate, rentalType } = req.body;

    if (!productId || !startDate || !endDate || !rentalType)
      return res.status(400).json({ message: "All rental fields are required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.availability)
      return res.status(400).json({ message: "Product is not available" });
    if (product.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot rent your own product" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;

    if (diffMs <= 0)
      return res.status(400).json({ message: "End date must be after start date" });

    let totalAmount;
    if (rentalType === "hour") {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      totalAmount = hours * product.priceHour;
    } else {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      totalAmount = days * product.priceDay;
    }

    const rental = await Rental.create({
      renter: req.user._id,
      owner: product.owner,
      product: productId,
      startDate: start,
      endDate: end,
      rentalType,
      totalAmount,
    });

    await rental.populate([
      { path: "product", select: "name priceHour priceDay images" },
      { path: "renter", select: "name email likelihoodPoints" },
      { path: "owner", select: "name email" },
    ]);

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user._id })
      .populate("product", "name images priceDay priceHour category")
      .populate("owner", "name email likelihoodPoints profileImage")
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOwnerRequests = async (req, res) => {
  try {
    const rentals = await Rental.find({ owner: req.user._id })
      .populate("product", "name images priceDay priceHour category")
      .populate("renter", "name email likelihoodPoints profileImage isVerified")
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (rental.status !== "pending")
      return res.status(400).json({ message: "Rental is not in pending state" });

    rental.status = "accepted";
    await rental.save();
    await Product.findByIdAndUpdate(rental.product, { availability: false });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    rental.status = "rejected";
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markReturned = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.renter.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (rental.status !== "accepted")
      return res.status(400).json({ message: "Rental must be accepted before returning" });

    rental.status = "returned";
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const completeRental = async (req, res) => {
  try {
    const { returnType = "onTime" } = req.body;

    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (rental.status !== "returned")
      return res.status(400).json({ message: "Renter must mark item as returned first" });

    rental.status = "completed";
    await rental.save();

    const renter = await User.findById(rental.renter);
    renter.likelihoodPoints = calculateTrustScore(renter.likelihoodPoints, returnType);
    await renter.save();

    await Product.findByIdAndUpdate(rental.product, { availability: true });

    res.json({ rental, renterPoints: renter.likelihoodPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
