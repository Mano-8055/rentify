import User from "../models/User.js";
import { calculateTrustScore } from "../utils/calculateTrustScore.js";

export const updateRentalStatus = async (req, res) => {
  const { userId, status } = req.body;

  const user = await User.findById(userId);

  user.likelihoodPoints = calculateTrustScore(
    user.likelihoodPoints,
    status
  );

  await user.save();

  res.json({
    message: "Updated",
    points: user.likelihoodPoints
  });
};