import API from "./api";

export const rentProduct = async (data) => {
  const res = await API.post("/rentals", data);
  return res.data;
};

export const getRentHistory = async () => {
  const res = await API.get("/rentals/history");
  return res.data;
};