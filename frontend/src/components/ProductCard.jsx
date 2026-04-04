export default function ProductCard({ product }) {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>₹{product.priceHour}/hour</p>
      <p>₹{product.priceDay}/day</p>
      <p>Owner Trust: {product.ownerScore}</p>
      <button>Rent</button>
    </div>
  );
}