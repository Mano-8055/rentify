import API from "./api";

export const addProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data;
};

export const getNearbyProducts = async (lat, lng) => {
  const res = await API.get("/products/nearby", {
    params: { lat, lng }
  });
  return res.data;
};