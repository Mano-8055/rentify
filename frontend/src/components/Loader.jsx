export default function Loader({ size = "md", text = "" }) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-2 border-green-500/20 border-t-green-500 animate-spin`}
        />
        <div
          className={`absolute inset-1 rounded-full border border-green-500/10 border-b-green-400/50 animate-spin`}
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
      </div>
      {text && <p className="text-sm text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
}
