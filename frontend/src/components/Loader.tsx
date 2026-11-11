import React from 'react';
import { memo } from "react";

const Loader = memo(function Loader({ size = "md", text = "", inline = false }) {
  const sizes = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-5 h-5 border-[2px]",
    md: "w-8 h-8 border-[2.5px]",
    lg: "w-12 h-12 border-[3px]",
    xl: "w-16 h-16 border-[3px]",
  };

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`flex ${inline ? "items-center" : "flex-col items-center justify-center"} gap-3`}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizes[size]} rounded-full border-border-subtle border-t-green-500 animate-spin`}
          aria-hidden="true"
        />
        {/* Inner ring - subtle */}
        <div
          className={`absolute inset-[1.5px] rounded-full border border-green-500/20 border-b-green-500/60 animate-spin`}
          style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
          aria-hidden="true"
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full bg-green-500/60 animate-pulse-subtle ${size === "xs" ? "w-1 h-1" : size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        </div>
      </div>
      {text && !inline && (
        <p className={`${textSizes[size]} text-text-tertiary animate-pulse-subtle tracking-wide text-center`}>
          {text}
        </p>
      )}
      {text && inline && (
        <p className={`${textSizes[size]} text-text-tertiary animate-pulse-subtle tracking-wide`}>
          {text}
        </p>
      )}
    </div>
  );
});

Loader.displayName = "Loader";

export default Loader;