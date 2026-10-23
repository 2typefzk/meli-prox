import { useId } from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Chave liga/desliga (role="switch"): trilho 52×32, índigo quando ligada. */
export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  const id = useId();
  return (
    <div className="m-switch-row">
      <label className="m-switch-row__text" htmlFor={id}>
        <span className="m-switch-row__label">{label}</span>
        {description && <span className="m-switch-row__desc">{description}</span>}
      </label>
      <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled}
        className="m-switch" onClick={() => onChange(!checked)}>
        <span className="m-switch__thumb" />
      </button>
    </div>
  );
}
