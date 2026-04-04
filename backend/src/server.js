import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();
connectDB();

app.listen(5000, () =>
  console.log("Server running on port 5000")
);