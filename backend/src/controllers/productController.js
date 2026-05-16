import Product from "../models/Product.js";
import { haversineDistance } from "../utils/geoLocation.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, priceHour, priceDay, lat, lng } = req.body;

    if (!name || !priceHour || !priceDay)
      return res.status(400).json({ message: "Name and prices are required" });

    const images = req.files
      ? req.files.map((f) => `/uploads/products/${f.filename}`)
      : [];

    const productLat = parseFloat(lat) || req.user.location?.lat;
    const productLng = parseFloat(lng) || req.user.location?.lng;

    if (!productLat || !productLng)
      return res.status(400).json({ message: "Product location is required" });

    const product = await Product.create({
      name,
      description,
      category,
      priceHour: parseFloat(priceHour),
      priceDay: parseFloat(priceDay),
      images,
      location: { lat: productLat, lng: productLng },
      owner: req.user._id,
    });

    await product.populate("owner", "name email likelihoodPoints profileImage");
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ availability: true })
      .populate("owner", "name email likelihoodPoints profileImage isVerified")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNearbyProducts = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng)
      return res.status(400).json({ message: "Location coordinates required" });

    const products = await Product.find({ availability: true }).populate(
      "owner",
      "name email likelihoodPoints profileImage isVerified"
    );

    const nearby = products
      .map((p) => {
        if (!p.location?.lat || !p.location?.lng) return null;
        const distance = haversineDistance(
          parseFloat(lat),
          parseFloat(lng),
          p.location.lat,
          p.location.lng
        );
        return { ...p.toObject(), distance: parseFloat(distance.toFixed(2)) };
      })
      .filter((p) => p !== null && p.distance <= parseFloat(radius))
      .sort((a, b) => a.distance - b.distance);

    res.json(nearby);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id })
      .populate("owner", "name email likelihoodPoints")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "owner",
      "name email likelihoodPoints profileImage location isVerified"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
