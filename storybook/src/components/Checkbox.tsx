import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
}

export function Checkbox({ children, ...rest }: CheckboxProps) {
  return (
    <label className="m-check">
      <input type="checkbox" {...rest} />
      <span>{children}</span>
    </label>
  );
}
