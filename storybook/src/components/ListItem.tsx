import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface ListItemProps {
  icon?: ReactNode;
  label: string;
  description?: string;
  trailing?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
}

export function ListItem({ icon, label, description, trailing, chevron = true, onClick }: ListItemProps) {
  return (
    <li className="m-list-item" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}>
      {icon && <span className="m-list-item__icon">{icon}</span>}
      <span className="m-list-item__label">
        {label}
        {description && <span className="m-list-item__sub">{description}</span>}
      </span>
      {trailing}
      {chevron && <span className="m-list-item__chevron"><ChevronRight size={20} /></span>}
    </li>
  );
}

export const ListDivider = () => <hr className="m-list-divider" />;
