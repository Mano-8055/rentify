import { useState } from "react";
import API from "../services/api";

export default function AddProduct() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await API.post("/products", form);
    alert("Added");
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow p-6 rounded w-80">
        <h2>Add Product</h2>

        <input
          className="border w-full p-2 mb-3"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border w-full p-2 mb-3"
          placeholder="Price/day"
          onChange={(e) =>
            setForm({ ...form, priceDay: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full py-2"
        >
          Add
        </button>
      </div>
    </div>
  );
}