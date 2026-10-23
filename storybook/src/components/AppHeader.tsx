import type { ReactNode } from "react";
import { Search, Nfc, Bell } from "lucide-react";
import { IconButton } from "./IconButton";
import { Badge } from "./Badge";

export interface AppHeaderProps {
  name: string;
  initials?: string;
  /** Conteúdo do avatar (ex.: logo); substitui as iniciais */
  avatar?: ReactNode;
  meliPlus?: boolean;
  notifications?: number;
  onAction?: (action: "search" | "notifications" | "nfc") => void;
}

/** Cabeçalho amarelo da home do app (saudação + avatar + ações). */
export function AppHeader({ name, initials, avatar, meliPlus = true, notifications, onAction }: AppHeaderProps) {
  return (
    <header className="m-app-header">
      <div className="m-app-header__row">
        <span className="m-avatar">{avatar ?? initials ?? name.slice(0, 2).toUpperCase()}</span>
        <div>
          <div className="t-h5">Olá, {name}</div>
          {meliPlus && <Badge tone="meli-plus">meli+</Badge>}
        </div>
        <div className="m-app-header__actions">
          <IconButton variant="brand" icon={<Search size={22} />} aria-label="Buscar" onClick={() => onAction?.("search")} />
          <IconButton variant="brand" icon={<Bell size={22} />} aria-label="Notificações" badge={notifications} onClick={() => onAction?.("notifications")} />
          <IconButton variant="brand" icon={<Nfc size={22} />} aria-label="Aproximar e pagar" onClick={() => onAction?.("nfc")} />
        </div>
      </div>
    </header>
  );
}
