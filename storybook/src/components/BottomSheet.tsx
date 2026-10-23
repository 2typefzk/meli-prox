import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

export interface BottomSheetProps {
  /** Chamado depois da animação de saída */
  onClose: () => void;
  "aria-label": string;
  className?: string;
  /** Conteúdo; como função, recebe `close()` para fechar com a animação de saída */
  children: ReactNode | ((close: () => void) => ReactNode);
}

/** Arrasto mínimo (px) ou velocidade (px/ms) para fechar ao soltar */
const CLOSE_DISTANCE = 96;
const CLOSE_VELOCITY = 0.5;

/**
 * Bottom drawer modal. Entra subindo com ease-out; ao tocar fora (ou chamar `close`)
 * desce 50% da própria altura com fade-out e só então chama `onClose`.
 * Também fecha arrastando para baixo (a partir do topo do conteúdo); soltando antes
 * do limite, volta ao lugar. Posiciona-se no ancestral com `position: relative` (a tela).
 */
export function BottomSheet({ onClose, className = "", children, ...rest }: BottomSheetProps) {
  const [leaving, setLeaving] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; y: number; t: number; lastY: number; lastT: number; moved: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const done = useRef(onClose);
  done.current = onClose;

  useEffect(() => {
    if (!leaving) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => done.current(), reduce ? 0 : 280);
    return () => clearTimeout(t);
  }, [leaving]);

  // Com conteúdo rolável, o gesto vertical do toque fica com a rolagem (arrasta-se pela alça)
  useEffect(() => {
    const el = sheetRef.current;
    if (el) setScrollable(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  const close = () => setLeaving(true);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (leaving || (e.pointerType === "mouse" && e.button !== 0)) return;
    const onHandle = (e.target as HTMLElement).closest(".sheet__grab");
    if (!onHandle && (sheetRef.current?.scrollTop ?? 0) > 0) return;
    const now = performance.now();
    drag.current = { id: e.pointerId, y: e.clientY, t: now, lastY: e.clientY, lastT: now, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (dy < -6) { drag.current = null; return; } // gesto para cima: não é fechar
      if (dy < 6) return;
      d.moved = true; setDragging(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ponteiro já liberado */ }
    }
    d.lastY = e.clientY; d.lastT = performance.now();
    setDragY(Math.max(0, dy));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    suppressClickUntil.current = performance.now() + 400; // o clique que encerra o arrasto não aciona botões
    setDragging(false);
    const dy = Math.max(0, e.clientY - d.y);
    const velocity = (e.clientY - d.lastY) / Math.max(1, performance.now() - d.lastT) || dy / Math.max(1, performance.now() - d.t);
    if (dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) close();
    else setDragY(0);
  };

  const height = sheetRef.current?.offsetHeight || 1;
  const progress = Math.min(1, dragY / height);

  return (
    <div className={`sheet-scrim sheet-scrim--eased${leaving ? " is-leaving" : ""}`} onClick={close}
      style={dragY && !leaving ? { backgroundColor: `rgba(18, 17, 24, ${0.45 * (1 - progress)})` } : undefined}>
      <div ref={sheetRef} className={`sheet ${className}${dragging ? " is-dragging" : ""}${scrollable ? " is-scrollable" : ""}`}
        role="dialog" aria-modal="true" aria-label={rest["aria-label"]}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
        onClickCapture={(e) => { if (performance.now() < suppressClickUntil.current) { e.stopPropagation(); e.preventDefault(); } }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <div className="sheet__grab" aria-hidden><div className="sheet__handle" /></div>
        {typeof children === "function" ? children(close) : children}
      </div>
    </div>
  );
}
