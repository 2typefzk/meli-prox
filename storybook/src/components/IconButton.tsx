import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  /** Texto opcional ao lado do ícone (ex.: "Chaves") */
  label?: string;
  /** tint = fundo índigo claro; surface = branco com sombra; brand = sobre o amarelo */
  variant?: "tint" | "surface" | "brand";
  size?: "md" | "lg";
  /** Indicador de alerta: true = ponto "!", número = contador */
  badge?: boolean | number;
  "aria-label"?: string;
}

export function IconButton({ icon, label, variant = "tint", size = "md", badge, className = "", ...rest }: IconButtonProps) {
  const cls = ["m-icon-btn", variant !== "tint" && `m-icon-btn--${variant}`, size === "lg" && "m-icon-btn--lg", label && "m-icon-btn--labeled", className].filter(Boolean).join(" ");
  return (
    <button className={cls} {...rest}>
      {icon}
      {label}
      {badge !== undefined && badge !== false && <span className="m-dot">{badge === true ? "!" : badge}</span>}
    </button>
  );
}
