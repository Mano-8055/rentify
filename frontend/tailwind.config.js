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
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-up":      "fadeInUp 0.55s ease forwards",
        "fade-in":      "fadeIn 0.4s ease forwards",
        "slide-down":   "slideDown 0.3s ease forwards",
        glow:           "glow 2.5s ease infinite",
        float:          "float 3.5s ease-in-out infinite",
        "pulse-green":  "pulseGreen 2s ease infinite",
        shimmer:        "shimmer 1.6s infinite",
        "spin-slow":    "spin 3s linear infinite",
        "bounce-soft":  "bounceSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,197,94,0.12)" },
          "50%":       { boxShadow: "0 0 48px rgba(34,197,94,0.38)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-14px)" },
        },
        pulseGreen: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-6px)" },
        },
      },
      backgroundImage: {
        "green-gradient":  "linear-gradient(135deg, #22c55e, #16a34a)",
        "dark-gradient":   "linear-gradient(135deg, #0a0a0a, #111827)",
        "glass-gradient":  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
        "radial-green":    "radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, transparent 70%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "green-sm":  "0 4px 20px rgba(34,197,94,0.2)",
        "green-md":  "0 8px 36px rgba(34,197,94,0.3)",
        "green-lg":  "0 16px 64px rgba(34,197,94,0.4)",
        "card":      "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover":"0 24px 64px rgba(34,197,94,0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
