import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = ação principal (sólido índigo); secondary = tint; transparent = link-button; on-dark = superfícies escuras */
  variant?: "primary" | "secondary" | "transparent" | "on-dark";
  /** lg = 48px (CTA de tela), md = 40px, sm = 32px */
  size?: "lg" | "md" | "sm";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  /** Ícone após o rótulo (ex.: seta em "Selecionar →") */
  trailingIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({ variant = "primary", size = "lg", fullWidth, loading, icon, trailingIcon, children, disabled, className = "", ...rest }: ButtonProps) {
  const cls = ["m-btn", `m-btn--${variant}`, size !== "lg" && `m-btn--${size}`, fullWidth && "m-btn--full", className].filter(Boolean).join(" ");
  return (
    <button className={cls} disabled={disabled} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="m-btn__spinner" aria-label="Carregando" /> : <>{icon}{children}{trailingIcon}</>}
    </button>
  );
}
