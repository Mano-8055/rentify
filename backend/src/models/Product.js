import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  priceHour: Number,
  priceDay: Number,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
    lat: Number,
    lng: Number
  }
});

export default mongoose.model("Product", productSchema);