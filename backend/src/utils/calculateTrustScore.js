export const calculateTrustScore = (points, type) => {
  switch (type) {
    case "onTime":
      return Math.min(points + 5, 100);
    case "late":
      return Math.max(points - 10, 0);
    case "damage":
      return Math.max(points - 20, 0);
    case "fraud":
      return Math.max(points - 50, 0);
    default:
      return points;
  }
};