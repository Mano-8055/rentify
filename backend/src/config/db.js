import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      console.error("❌ MongoDB connection failed: cluster not found.");
      console.error("   → Fix: update MONGO_URI in backend/.env with your Atlas connection string.");
      console.error("   → Atlas dashboard → Connect → Drivers → copy the connection string.");
    } else {
      console.error("❌ MongoDB error:", error.message);
    }
    process.exit(1);
  }
};

export default connectDB;