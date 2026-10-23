import type { ReactNode } from "react";

export interface BadgeProps {
  tone?: "positive" | "info" | "meli-plus" | "negative" | "neutral";
  /** loud = sólido; quiet = fundo suave */
  emphasis?: "loud" | "quiet";
  children: ReactNode;
}

export function Badge({ tone = "positive", emphasis = "loud", children }: BadgeProps) {
  return <span className={`m-badge m-badge--${tone}${emphasis === "quiet" ? " m-badge--quiet" : ""}`}>{children}</span>;
}
