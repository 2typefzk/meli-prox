import { Landmark, CreditCard, ScanBarcode, ListPlus } from "lucide-react";

export type NavKey = "conta" | "cartoes" | "pix" | "pagamentos" | "mais";

export interface BottomNavProps {
  active?: NavKey;
  onChange?: (key: NavKey) => void;
}

/** Losango do Pix (4 quadrados rotacionados) */
export const PixGlyph = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
    <g fill="currentColor" transform="rotate(45 16 16)">
      <rect x="6" y="6" width="9" height="9" rx="2.5" />
      <rect x="17" y="6" width="9" height="9" rx="2.5" />
      <rect x="6" y="17" width="9" height="9" rx="2.5" />
      <rect x="17" y="17" width="9" height="9" rx="2.5" />
    </g>
  </svg>
);

const items: { key: NavKey; label: string; Icon: typeof Landmark }[] = [
  { key: "conta", label: "Conta", Icon: Landmark },
  { key: "cartoes", label: "Cartões", Icon: CreditCard },
  { key: "pagamentos", label: "Pagamentos", Icon: ScanBarcode },
  { key: "mais", label: "Mais", Icon: ListPlus },
];

export function BottomNav({ active = "conta", onChange }: BottomNavProps) {
  const btn = (k: (typeof items)[number]) => (
    <button key={k.key} className="m-bottom-nav__item" aria-current={active === k.key ? "page" : undefined} onClick={() => onChange?.(k.key)}>
      <k.Icon size={24} strokeWidth={1.75} />
      {k.label}
    </button>
  );
  const pixActive = active === "pix";
  return (
    <nav className="m-bottom-nav" aria-label="Navegação principal">
      {items.slice(0, 2).map(btn)}
      <div className={`m-bottom-nav__pix-wrap${pixActive ? " m-bottom-nav__pix-wrap--active" : ""}`}>
        <button className={`m-bottom-nav__pix${pixActive ? " m-bottom-nav__pix--active" : ""}`} aria-label="Pix" aria-current={pixActive ? "page" : undefined} onClick={() => onChange?.("pix")}>
          <PixGlyph />
        </button>
        Pix
      </div>
      {items.slice(2).map(btn)}
    </nav>
  );
}
