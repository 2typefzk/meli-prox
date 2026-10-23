import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Arrastar para rolar na horizontal (mouse/caneta). Toque usa a rolagem nativa.
 * Mantém inércia curta ao soltar e cancela o clique quando houve arrasto.
 */
export function useDragScroll<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0, startScroll = 0, lastX = 0, lastT = 0, velocity = 0, dragging = false, moved = false, raf = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      dragging = true; moved = false;
      startX = lastX = e.clientX; startScroll = el.scrollLeft; lastT = performance.now(); velocity = 0;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true; el.classList.add("is-dragging");
        try { el.setPointerCapture(e.pointerId); } catch { /* ponteiro já liberado */ }
      }
      if (!moved) return;
      el.scrollLeft = startScroll - dx;
      const now = performance.now();
      velocity = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      // inércia: desacelera ~0,95 por quadro, depois devolve o snap ao navegador
      let v = -velocity * 16;
      const step = () => {
        v *= 0.95;
        el.scrollLeft += v;
        if (Math.abs(v) > 0.5) raf = requestAnimationFrame(step);
        else el.classList.remove("is-dragging");
      };
      raf = requestAnimationFrame(step);
    };
    // Não dispara o clique do tile depois de um arrasto
    const click = (e: MouseEvent) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, []);
  return ref;
}

/** Container de rolagem mais próximo (a "tela" do protótipo). */
const scroller = (el: HTMLElement | null) => el?.closest<HTMLElement>(".proto-screen") ?? null;

/** true quando a tela rolou além de `threshold` px. */
export function useScrolledPast(ref: RefObject<HTMLElement>, threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const s = scroller(ref.current);
    if (!s) return;
    const on = () => setPast(s.scrollTop > threshold);
    on();
    s.addEventListener("scroll", on, { passive: true });
    return () => s.removeEventListener("scroll", on);
  }, [ref, threshold]);
  return past;
}

export type PullState = { pull: number; dragging: boolean; refreshing: boolean };

/**
 * Puxar para recarregar: no topo da tela, arrastar para baixo abre um espaço (com resistência)
 * acima do conteúdo; soltando além de `threshold` mantém o spinner por `durationMs`.
 * Funciona com toque e com mouse (para testar no desktop).
 */
export function usePullToRefresh(ref: RefObject<HTMLElement>, onRefresh: () => void, { threshold = 64, max = 120, durationMs = 1200 } = {}) {
  const [state, setState] = useState<PullState>({ pull: 0, dragging: false, refreshing: false });
  const latest = useRef({ onRefresh, state });
  latest.current = { onRefresh, state };

  useEffect(() => {
    const el = ref.current;
    const s = scroller(el);
    if (!el || !s) return;
    let startY: number | null = null, startX = 0, engaged = false, timer = 0;
    const resist = (dy: number) => Math.min(max, dy * 0.5);

    const begin = (x: number, y: number) => { if (s.scrollTop <= 0 && !latest.current.state.refreshing) { startY = y; startX = x; engaged = false; } };
    const drag = (x: number, y: number, e: Event) => {
      if (startY === null) return;
      const dy = y - startY;
      // trava de eixo: só engata se o gesto for para baixo e mais vertical que horizontal
      if (!engaged) {
        if (Math.abs(x - startX) > Math.abs(dy)) { startY = null; return; }
        if (dy < 6) return;
        engaged = true;
      }
      if (dy <= 0) { if (latest.current.state.pull) setState((p) => ({ ...p, pull: 0, dragging: false })); return; }
      if (e.cancelable) e.preventDefault(); // não deixa a página rolar/esticar enquanto puxa
      setState({ pull: resist(dy), dragging: true, refreshing: false });
    };
    const end = () => {
      if (startY === null) return;
      startY = null;
      if (!engaged) return;
      if (latest.current.state.pull >= threshold) {
        setState({ pull: threshold, dragging: false, refreshing: true });
        timer = window.setTimeout(() => { latest.current.onRefresh(); setState({ pull: 0, dragging: false, refreshing: false }); }, durationMs);
      } else setState({ pull: 0, dragging: false, refreshing: false });
    };

    const ts = (e: TouchEvent) => begin(e.touches[0].clientX, e.touches[0].clientY);
    const tm = (e: TouchEvent) => drag(e.touches[0].clientX, e.touches[0].clientY, e);
    const md = (e: PointerEvent) => { if (e.pointerType !== "touch" && e.button === 0) begin(e.clientX, e.clientY); };
    const mm = (e: PointerEvent) => { if (e.pointerType !== "touch") drag(e.clientX, e.clientY, e); };
    const mu = (e: PointerEvent) => { if (e.pointerType !== "touch") end(); };

    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchmove", tm, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    el.addEventListener("pointerdown", md);
    window.addEventListener("pointermove", mm);
    window.addEventListener("pointerup", mu);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
      el.removeEventListener("pointerdown", md);
      window.removeEventListener("pointermove", mm);
      window.removeEventListener("pointerup", mu);
    };
  }, [ref, threshold, max, durationMs]);
  return state;
}

/** Saída animada: `leave()` marca `leaving` e chama `onDone` quando a animação de saída termina. */
export function useLeave(onDone: () => void, ms = 280) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (!leaving) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => done.current(), reduce ? 0 : ms);
    return () => clearTimeout(t);
  }, [leaving, ms]);
  return [leaving, () => setLeaving(true)] as const;
}

/** Segundos restantes até `until` (atualiza a cada segundo); 0 quando inativo. */
export function useSecondsLeft(until: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [until]);
  return until ? Math.max(0, Math.ceil((until - now) / 1000)) : 0;
}

export const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
