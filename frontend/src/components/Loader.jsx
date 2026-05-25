import { memo } from "react";

const Loader = memo(function Loader({ size = "md", text = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizes[size]} rounded-full border-2 border-green-500/15 border-t-green-500 animate-spin`}
        />
        {/* Inner ring */}
        <div
          className={`absolute inset-[3px] rounded-full border border-green-400/20 border-b-green-400/60 animate-spin`}
          style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-green-500/60 animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="text-sm text-slate-500 animate-pulse tracking-wide">{text}</p>
      )}
    </div>
  );
});

export default Loader;
