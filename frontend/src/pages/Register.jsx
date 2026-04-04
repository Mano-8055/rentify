import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({});

  const handleRegister = async () => {
    await API.post("/auth/register", form);
    alert("Registered");
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow p-6 rounded w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          className="border w-full p-2 mb-3"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border w-full p-2 mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="border w-full p-2 mb-3"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleRegister}
          className="bg-green-500 text-white w-full py-2"
        >
          Register
        </button>
      </div>
    </div>
  );
}