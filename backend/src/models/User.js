import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  likelihoodPoints: {
    type: Number,
    default: 100
  },

  governmentId: String,

  location: {
    lat: Number,
    lng: Number
  }
});

export default mongoose.model("User", userSchema);