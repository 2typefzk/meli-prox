import { useEffect, useRef, useState, type ReactNode } from "react";

export interface BottomSheetProps {
  /** Chamado depois da animação de saída */
  onClose: () => void;
  "aria-label": string;
  className?: string;
  /** Conteúdo; como função, recebe `close()` para fechar com a animação de saída */
  children: ReactNode | ((close: () => void) => ReactNode);
}

/**
 * Bottom drawer modal. Entra subindo com ease-out; ao tocar fora (ou chamar `close`)
 * desce 50% da própria altura com fade-out e só então chama `onClose`.
 * Posiciona-se no ancestral com `position: relative` (a tela).
 */
export function BottomSheet({ onClose, className = "", children, ...rest }: BottomSheetProps) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onClose);
  done.current = onClose;
  useEffect(() => {
    if (!leaving) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => done.current(), reduce ? 0 : 280);
    return () => clearTimeout(t);
  }, [leaving]);
  const close = () => setLeaving(true);

  return (
    <div className={`sheet-scrim sheet-scrim--eased${leaving ? " is-leaving" : ""}`} onClick={close}>
      <div className={`sheet ${className}`} role="dialog" aria-modal="true" aria-label={rest["aria-label"]} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__handle" />
        {typeof children === "function" ? children(close) : children}
      </div>
    </div>
  );
}
