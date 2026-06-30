import Magnetic from "./Magnetic";

// Botón premium. variant: "primary" | "ghost". Magnético opcional (CTA).
export default function Button({
  children,
  onClick,
  variant = "primary",
  magnetic = false,
  className = "",
  type = "button",
  ...rest
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-medium tracking-tight transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-spring)] active:translate-y-0 will-change-transform";

  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--glow-brand)]"
      : "border border-border-strong text-text-secondary hover:text-text-primary hover:border-white/30 hover:-translate-y-0.5";

  const btn = (
    <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`} {...rest}>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </button>
  );

  return magnetic ? <Magnetic strength={0.5}>{btn}</Magnetic> : btn;
}
