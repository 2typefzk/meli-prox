import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** outlined = borda 1px; elevated = sombra elevation/1; tint = índigo claro; dark = gradiente grafite (cartão de crédito) */
  variant?: "outlined" | "elevated" | "tint" | "dark";
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ variant = "outlined", interactive, className = "", children, ...rest }: CardProps) {
  return (
    <div className={["m-card", `m-card--${variant}`, interactive && "m-card--interactive", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
