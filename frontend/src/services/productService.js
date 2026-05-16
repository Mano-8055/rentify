import API from "./api";

export const addProduct = async (formData) => {
  const res = await API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getAllProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const getNearbyProducts = async (lat, lng, radius = 10) => {
  const res = await API.get("/products/nearby", { params: { lat, lng, radius } });
  return res.data;
};

export const getMyProducts = async () => {
  const res = await API.get("/products/mine");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await API.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};
