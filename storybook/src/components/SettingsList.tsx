import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/** Card de configurações: título + linhas separadas por divisórias (padrão "Informações do seu perfil"). */
export function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="settings-card">
      <h2 className="settings-card__title">{title}</h2>
      <ul className="settings-card__rows">{children}</ul>
    </section>
  );
}

export interface SettingsRowProps {
  icon: ReactNode;
  /** Valor atual (texto principal) */
  value: ReactNode;
  /** Legenda: o que a opção significa */
  caption: string;
  /** Ação à direita (Toggle, status…) */
  trailing?: ReactNode;
  /** Com conteúdo, a linha vira um botão que expande no lugar (chevron gira 90°) */
  children?: ReactNode;
  defaultOpen?: boolean;
}

/** Linha: ícone · valor + legenda · ação à direita. */
export function SettingsRow({ icon, value, caption, trailing, children, defaultOpen = false }: SettingsRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const text = (
    <>
      <span className="settings-row__icon" aria-hidden>{icon}</span>
      <span className="settings-row__text">
        <span className="settings-row__value">{value}</span>
        <span className="settings-row__caption">{caption}</span>
      </span>
    </>
  );
  if (!children) return <li className="settings-row">{text}<span className="settings-row__end">{trailing}</span></li>;
  return (
    <li className={`settings-row-wrap${open ? " is-open" : ""}`}>
      <button type="button" className="settings-row settings-row--button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {text}
        <span className="settings-row__end">{trailing}<ChevronRight size={20} className="settings-row__chevron" /></span>
      </button>
      <div className="settings-row__panel"><div>{children}</div></div>
    </li>
  );
}

/** Opções em pílulas (uma escolhida). `value: null` = nenhuma marcada (ações). */
export function ChoiceChips<T extends string | number>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void;
}) {
  return (
    <div className="settings-chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className="settings-chip" onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Lista de opções exclusivas com descrição. */
export function RadioList<T extends string>({ label, name, options, value, onChange }: {
  label: string; name: string; options: { value: T; label: string; text?: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="settings-radios" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={o.value} className="settings-radio">
          <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="settings-radio__dot" aria-hidden />
          <span><span className="settings-radio__label">{o.label}</span>{o.text && <span className="settings-row__caption">{o.text}</span>}</span>
        </label>
      ))}
    </div>
  );
}

/** Chave liga/desliga sem rótulo próprio (o rótulo é a linha). */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="m-switch" onClick={() => onChange(!checked)}>
      <span className="m-switch__thumb" />
    </button>
  );
}

/** Ponto verde pulsando: algo está ligado agora. */
export const LiveDot = ({ label }: { label?: string }) => <span className="settings-live__dot" aria-label={label} aria-hidden={!label || undefined} />;
