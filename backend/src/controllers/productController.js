import Product from "../models/Product.js";

// ➕ Add Product
export const addProduct = async (req, res) => {
  const { name, priceHour, priceDay, lat, lng } = req.body;

  const product = await Product.create({
    name,
    priceHour,
    priceDay,
    location: { lat, lng },
    owner: req.user._id
  });

  res.json(product);
};

// 📍 Get Nearby Products (10km logic)
export const getNearbyProducts = async (req, res) => {
  const { lat, lng } = req.query;

  const products = await Product.find();

  const nearby = products.filter((p) => {
    const dist = getDistance(lat, lng, p.location.lat, p.location.lng);
    return dist <= 10;
  });

  res.json(nearby);
};

// distance function
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};