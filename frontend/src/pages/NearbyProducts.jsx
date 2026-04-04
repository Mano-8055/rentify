import { useEffect, useState } from "react";
import API from "../services/api";

export default function NearbyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p._id} className="border p-4 rounded shadow">
          <h3>{p.name}</h3>
          <p>₹{p.priceDay}/day</p>
        </div>
      ))}
    </div>
  );
}