import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    governmentId: { type: String, default: null },
    likelihoodPoints: { type: Number, default: 100, min: 0, max: 100 },
    profileImage: { type: String, default: null },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
