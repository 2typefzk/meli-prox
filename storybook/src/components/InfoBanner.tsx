import type { ReactNode } from "react";
import { Info, CheckCircle2 } from "lucide-react";

export interface InfoBannerProps {
  tone?: "info" | "positive";
  children: ReactNode;
  action?: ReactNode;
}

export function InfoBanner({ tone = "info", children, action }: InfoBannerProps) {
  const Icon = tone === "positive" ? CheckCircle2 : Info;
  return (
    <div className={`m-banner${tone === "positive" ? " m-banner--positive" : ""}`} role="status">
      <span className="m-banner__icon"><Icon size={24} fill="currentColor" stroke="var(--color-surface-default)" /></span>
      <div>{children}</div>
      {action && <div className="m-banner__action">{action}</div>}
    </div>
  );
}
