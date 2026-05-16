export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#22c55e",
          dark: "#0a0a0a",
        },
      },
      animation: {
        "fade-up": "fadeInUp 0.6s ease forwards",
        glow: "glow 2s ease infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-green": "pulseGreen 2s ease infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,197,94,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(34,197,94,0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGreen: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      backgroundImage: {
        "green-gradient": "linear-gradient(135deg, #22c55e, #16a34a)",
        "dark-gradient": "linear-gradient(135deg, #0a0a0a, #111827)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
