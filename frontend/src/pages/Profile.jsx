import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="text-center mt-10">
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <p>Trust Score: {user?.likelihoodPoints}</p>
    </div>
  );
}