import API from "./api";

export const createRental = async (data) => {
  const res = await API.post("/rentals", data);
  return res.data;
};

export const getMyRentals = async () => {
  const res = await API.get("/rentals/my-rentals");
  return res.data;
};

export const getOwnerRequests = async () => {
  const res = await API.get("/rentals/owner-requests");
  return res.data;
};

export const acceptRental = async (id) => {
  const res = await API.put(`/rentals/${id}/accept`);
  return res.data;
};

export const rejectRental = async (id) => {
  const res = await API.put(`/rentals/${id}/reject`);
  return res.data;
};

export const markReturned = async (id) => {
  const res = await API.put(`/rentals/${id}/return`);
  return res.data;
};

export const completeRental = async (id, returnType = "onTime") => {
  const res = await API.put(`/rentals/${id}/complete`, { returnType });
  return res.data;
};
