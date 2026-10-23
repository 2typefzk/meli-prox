import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helper?: string;
  error?: string;
  trailing?: ReactNode;
}

export function TextField({ label, helper, error, trailing, disabled, ...rest }: TextFieldProps) {
  const id = useId();
  const cls = ["m-field", error && "m-field--error", disabled && "m-field--disabled"].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      {label && <label className="m-field__label" htmlFor={id}>{label}</label>}
      <div className="m-field__box">
        <input id={id} className="m-field__input" disabled={disabled} aria-invalid={!!error} aria-describedby={helper || error ? `${id}-h` : undefined} {...rest} />
        {trailing}
      </div>
      {(error || helper) && <span id={`${id}-h`} className="m-field__helper">{error ?? helper}</span>}
    </div>
  );
}
