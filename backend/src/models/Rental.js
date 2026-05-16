import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rentalType: { type: String, enum: ["hour", "day"], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "active", "returned", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rental", rentalSchema);
