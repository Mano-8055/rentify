import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rental route working");
});

export default router;