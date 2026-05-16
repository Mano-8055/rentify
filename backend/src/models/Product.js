import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Electronics", "Vehicles", "Tools", "Sports", "Furniture", "Clothing", "Books", "Other"],
      default: "Other",
    },
    images: [{ type: String }],
    priceHour: { type: Number, required: true, min: 0 },
    priceDay: { type: Number, required: true, min: 0 },
    availability: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
