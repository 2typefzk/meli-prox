import { Eye, EyeOff } from "lucide-react";
import { formatBRL } from "../data";

export interface AmountEntryProps {
  cents: number;
  onChange: (cents: number) => void;
  balance: number;
  hideBalance: boolean;
  onToggleBalance: () => void;
  label: string;
  autoFocus?: boolean;
}

/** Valor em destaque (máscara de centavos) + saldo disponível com olho. Usado no Pix e na transferência por aproximação. */
export function AmountEntry({ cents, onChange, balance, hideBalance, onToggleBalance, label, autoFocus = true }: AmountEntryProps) {
  const amount = cents / 100;
  const over = amount > balance;
  const EyeIcon = hideBalance ? EyeOff : Eye;
  return (
    <>
      <label className="flow-amount">
        <span className="sr-only">{label}</span>
        <input className={`flow-amount__input${cents ? " flow-amount__input--filled" : ""}`} inputMode="numeric" value={formatBRL(amount)} autoFocus={autoFocus}
          onChange={(e) => onChange(Math.min(Number(e.target.value.replace(/\D/g, "") || 0), 99999999))} aria-invalid={over} />
      </label>
      <div className="flow-row t-body t-secondary">
        {over ? <span className="t-body" style={{ color: "var(--color-text-negative)" }}>Saldo insuficiente</span> : <>Saldo disponível: <b className="flow-strong">{hideBalance ? "R$ ••••" : formatBRL(balance)}</b></>}
        <button className="home-icon-link" aria-label={hideBalance ? "Mostrar saldo" : "Ocultar saldo"} onClick={onToggleBalance}><EyeIcon size={18} /></button>
      </div>
    </>
  );
}
