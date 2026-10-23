import type { ReactNode } from "react";
import { Badge } from "./Badge";

export interface ActionTileProps {
  icon: ReactNode;
  label: string;
  /** Selo sobreposto à borda inferior (ex.: "Sem taxas") */
  tag?: string;
  compact?: boolean;
  onClick?: () => void;
}

export function ActionTile({ icon, label, tag, compact, onClick }: ActionTileProps) {
  return (
    <button className={`m-tile${compact ? " m-tile--compact" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {tag && <Badge tone="positive">{tag}</Badge>}
    </button>
  );
}
