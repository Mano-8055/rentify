import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (req.file) updateData.profileImage = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng)
      return res.status(400).json({ message: "lat and lng required" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { location: { lat: parseFloat(lat), lng: parseFloat(lng) } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadGovernmentId = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        governmentId: `/uploads/govids/${req.file.filename}`,
        isVerified: true,
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -governmentId -email"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
