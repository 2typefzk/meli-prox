import type { ButtonHTMLAttributes } from "react";
import { User } from "lucide-react";

export type NearbyAvatarKind = "contact" | "open" | "anon";

export interface NearbyAvatarProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** contact = foto (está nos meus contatos) · open = só iniciais (permite ser adicionado) · anon = placeholder */
  kind: NearbyAvatarKind;
  photo?: string;
  initials?: string;
  /** Diâmetro em px */
  size?: number;
  online?: boolean;
  selected?: boolean;
}

/** Avatar do "Perto de mim": sempre clicável, com indicador online e estado selecionado. */
export function NearbyAvatar({ kind, photo, initials, size = 40, online, selected, className = "", style, ...rest }: NearbyAvatarProps) {
  return (
    <button type="button" className={`nearby-avatar nearby-avatar--${kind}${selected ? " nearby-avatar--selected" : ""} ${className}`}
      style={{ width: size, height: size, ...style }} {...rest}>
      {kind === "contact" && photo && <img src={photo} alt="" width={size} height={size} draggable={false} />}
      {kind === "open" && <span className="nearby-avatar__initials">{initials}</span>}
      {kind === "anon" && <User size={Math.round(size * 0.66)} strokeWidth={1.75} aria-hidden />}
      {online && <span className="nearby-avatar__online" />}
    </button>
  );
}
