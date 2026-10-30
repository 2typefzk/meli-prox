import payPhone from "../assets/anima-pay-phone.png";
import payPos from "../assets/anima-pay-pos.png";
import sendPhone from "../assets/anima-send-phone.png";
import receivePhone from "../assets/anima-receive-phone.png";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight, Radar, Settings } from "lucide-react";
import { Button, IconButton, SegmentedControl } from "../../src/components";
import { ContactlessMark } from "../../src/components";

export type ApproachMode = "pay" | "transfer";

const MODES: { value: ApproachMode; label: string }[] = [
  { value: "pay", label: "Pagar" },
  { value: "transfer", label: "Transferir ou Receber" },
];

const COPY: Record<ApproachMode, { title: string; subtitle: string }> = {
  pay: { title: "Aproxime para Pagar", subtitle: "Encoste seu celular na maquininha para fazer um pagamento." },
  transfer: { title: "Aproxime para Transferir ou Receber", subtitle: "Encoste seu celular no da outra pessoa." },
};

const SWIPE_THRESHOLD = 60; // px para confirmar a troca de aba

const Phone = ({ x, y, rotate }: { x: number; y: number; rotate: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-48} y={-92} width={96} height={184} rx={16} className="approach-phone__body" />
    <rect x={-43} y={-86} width={86} height={172} rx={12} className="approach-phone__screen" />
    <ContactlessMark cx={0} cy={0} r={22} />
  </g>
);

export const PayIllustration = () => (
  <svg viewBox="0 0 320 240" className="approach-illustration" role="img" aria-label="Celular encostando na maquininha">
    <ellipse cx={170} cy={212} rx={130} ry={14} className="approach-shadow" />
    <g transform="translate(205 108) rotate(-24)">
      <rect x={-62} y={-96} width={124} height={192} rx={20} className="approach-pos__body" />
      <rect x={-50} y={-84} width={100} height={124} rx={8} className="approach-pos__screen" />
      <rect x={-40} y={-74} width={80} height={14} rx={4} className="approach-pos__bar" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={-24 + (i % 3) * 24} cy={-38 + Math.floor(i / 3) * 22} r={4} className="approach-pos__key" />
      ))}
      <rect x={-30} y={56} width={60} height={8} rx={4} className="approach-pos__slot" />
    </g>
    <Phone x={112} y={142} rotate={-48} />
  </svg>
);

export const TransferIllustration = () => (
  <svg viewBox="0 0 320 240" className="approach-illustration" role="img" aria-label="Dois celulares encostando um no outro">
    <ellipse cx={160} cy={212} rx={130} ry={14} className="approach-shadow" />
    <Phone x={102} y={118} rotate={-14} />
    <Phone x={218} y={118} rotate={14} />
  </svg>
);

export interface ApproachProps {
  notify: (msg: string) => void;
  /** "pay" → Stand by de pagamento · "transfer" → Insira o valor */
  onSelect: (mode: ApproachMode) => void;
  /** Botão "Receber" da aba Transferir ou Receber */
  onReceive: () => void;
  /** Ícone de radar → "Perto de mim" */
  /** Sem a prop, "Perto de mim" está desligado e o radar não aparece */
  onOpenNearby?: () => void;
  onOpenSettings: () => void;
  initialMode?: ApproachMode;
}

/* ===================== Animação fotorrealista (Figma › Mock-ups › AnimaPay / AnimaSendReceive) =====================
 * Quadros-chave Instant=0 / 50 / 100 num palco de 375×300. cx/cy = centro do dispositivo no palco;
 * rot = rotação em CSS (o inverso da rotação do Figma). Interpolação linear por trechos 0→50→100.
 */
type Key = [number, number, number];
interface Device { src: string; w: number; h: number; cx: Key; cy: number; rot: Key; shadow: string }
const STAGE_W = 375, STAGE_H = 300;
/** Escala a partir do centro do palco: aparelhos maiores, sempre cortados nas laterais em 375px. */
const SCALE = 1.3;
/* Instant=50 e 100 vêm do Figma. Instant=0 foi afastado até os dispositivos saírem do palco (ocultos). */
const ANIMA: Record<ApproachMode, Device[]> = {
  pay: [
    { src: payPos, w: 151, h: 349, cx: [570, 402.5, 359.5], cy: 150, rot: [-90, -90, -90], shadow: "none" },
    { src: payPhone, w: 112, h: 230, cx: [-140, 27, 92], cy: 151, rot: [90, 90, 90], shadow: "drop-shadow(10px 0 10px rgba(0,0,0,.3))" },
  ],
  transfer: [
    { src: receivePhone, w: 111, h: 228, cx: [520, 346, 305], cy: 149.5, rot: [-70, -80, -90], shadow: "drop-shadow(-10px 0 10px rgba(0,0,0,.12))" },
    { src: sendPhone, w: 112, h: 230, cx: [-145, 29, 68], cy: 150.5, rot: [70, 80, 90], shadow: "drop-shadow(10px 0 10px rgba(0,0,0,.12))" },
  ],
};
const lerp = (k: Key, t: number) => (t <= 0.5 ? k[0] + (k[1] - k[0]) * (t / 0.5) : k[1] + (k[2] - k[1]) * ((t - 0.5) / 0.5));
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Dispositivos de uma aba no palco: progress 0 = separados (fora de cena) · 1 = encontrados ao centro. */
function ApproachDevices({ mode, progress }: { mode: ApproachMode; progress: number }) {
  const t = clamp01(progress);
  return (
    <>
      {ANIMA[mode].map((d) => (
        <div key={d.src} className="anima__device" style={{
          width: d.w * SCALE, height: d.h * SCALE, filter: d.shadow, visibility: t === 0 ? "hidden" : undefined,
          transform: `translate(calc(-50% + ${(lerp(d.cx, t) - STAGE_W / 2) * SCALE}px), calc(-50% + ${(d.cy - STAGE_H / 2) * SCALE}px)) rotate(${lerp(d.rot, t)}deg)`,
        }}>
          <img src={d.src} alt="" draggable={false} />
        </div>
      ))}
    </>
  );
}

/** Tween com ease-out cúbico (respeita "reduzir movimento"). */
function useTween() {
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return useCallback((from: number, to: number, ms: number, onUpdate: (v: number) => void, onDone?: () => void) => {
    cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || ms <= 0) { onUpdate(to); onDone?.(); return; }
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - k, 3);
      onUpdate(from + (to - from) * e);
      if (k < 1) raf.current = requestAnimationFrame(step); else onDone?.();
    };
    raf.current = requestAnimationFrame(step);
  }, []);
}

/**
 * Tela "Aproxime" (Figma › Screens › Aproxime · Pagar / Aproxime · Transferir ou Receber).
 * `pos` contínuo (0 = Pagar, 1 = Transferir ou Receber) move a trilha e controla as duas animações:
 * a aba que sai separa os dispositivos (→ 0%) e a que entra os aproxima (→ 100%).
 * Ao abrir a tela, a animação da aba começa em 50% e completa sozinha.
 */
export function Approach({ notify, onSelect, onReceive, onOpenNearby, onOpenSettings, initialMode = "pay" }: ApproachProps) {
  const startIndex = MODES.findIndex((m) => m.value === initialMode);
  const [index, setIndex] = useState(startIndex);
  const [pos, setPos] = useState(startIndex);
  // progresso da animação de cada aba (0 = separados/ocultos · 1 = encontrados)
  const [prog, setProg] = useState<number[]>(() => MODES.map((_, i) => (i === startIndex ? 0.5 : 0)));
  const progRef = useRef(prog); progRef.current = prog;
  const setProgAt = useCallback((i: number, v: number) => setProg((p) => p.map((x, k) => (k === i ? v : x))), []);
  const [dragging, setDragging] = useState(false);
  const trackTween = useTween();
  const inTween = useTween();   // aba que entra / volta: → 100%
  const outTween = useTween();  // aba que sai: → 0%
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; id: number; horizontal?: boolean; base: number } | null>(null);

  // Entrada por link: a aba começa em 50% e completa sozinha
  useEffect(() => { inTween(0.5, 1, 700, (v) => setProgAt(startIndex, v)); }, [inTween, setProgAt, startIndex]);

  const width = () => trackRef.current?.clientWidth || STAGE_W;
  /** Vai para a aba `target`: a trilha desliza e, ao soltar, a animação da nova aba toca de 0% a 100%. */
  const settle = (target: number) => {
    const from = index;
    trackTween(pos, target, 380, setPos);
    if (target === from) { inTween(progRef.current[from], 1, 300, (v) => setProgAt(from, v)); return; }
    setIndex(target);
    outTween(progRef.current[from], 0, 250, (v) => setProgAt(from, v));
    setProgAt(target, 0);
    inTween(0, 1, 900, (v) => setProgAt(target, v));
  };

  // Swipe: esquerda → próxima aba, direita → anterior; gestos verticais seguem para a rolagem.
  // Durante o arrasto só os dispositivos da aba ativa se separam.
  const onPointerDown = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, base: pos }; };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (d.horizontal === undefined) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.horizontal = Math.abs(dx) > Math.abs(dy);
      if (d.horizontal) { setDragging(true); inTween(0, 0, 0, () => {}); try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* */ } }
    }
    if (!d.horizontal) return;
    const w = width();
    let next = d.base - dx / w;
    if (next < 0) next = next / 4; else if (next > MODES.length - 1) next = MODES.length - 1 + (next - (MODES.length - 1)) / 4; // resistência
    setPos(next);
    setProgAt(index, 1 - clamp01(Math.abs(dx) / (w * 0.5))); // separa até 0% na metade da largura
  };
  const onPointerEnd = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.horizontal) return;
    setDragging(false);
    const dx = e.clientX - d.x;
    let target = index;
    if (dx <= -SWIPE_THRESHOLD) target = Math.min(MODES.length - 1, index + 1);
    else if (dx >= SWIPE_THRESHOLD) target = Math.max(0, index - 1);
    settle(target);
  };

  const progress = (i: number) => prog[i];

  return (
    <div className="pix approach">
      <div className="proto-status-bar" />
      <div className="approach__content">
        <div className="approach__top">
          <div className="pix__header">
            <h1 className="t-h1 home-grow">Aproxime</h1>
            {onOpenNearby && <IconButton icon={<Radar size={22} />} aria-label="Perto de mim" onClick={onOpenNearby} />}
            <IconButton icon={<Settings size={22} />} aria-label="Configurações" onClick={onOpenSettings} />
          </div>
          <SegmentedControl aria-label="O que você quer fazer" options={MODES} value={MODES[index].value}
            onChange={(v) => settle(MODES.findIndex((m) => m.value === v))} />
        </div>

        <div className="approach__viewport" ref={trackRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
          {/* Palco fixo: só os aparelhos entram e saem de cena */}
          <div className="anima" aria-hidden>
            {MODES.map((m, i) => <ApproachDevices key={m.value} mode={m.value} progress={progress(i)} />)}
          </div>
          <div className={`approach__track${dragging ? " approach__track--dragging" : ""}`} style={{ transform: `translateX(${-pos * 100}%)` }}>
            {MODES.map((m, i) => (
              <section key={m.value} className="approach__panel" aria-hidden={i !== index} aria-label={m.label}>
                <div className="approach__action">
                  <div className="approach__copy">
                    <h2 className="t-h4">{COPY[m.value].title}</h2>
                    <p className="t-body-lg t-secondary">{COPY[m.value].subtitle}</p>
                  </div>
                  {m.value === "pay" ? (
                    <Button size="md" trailingIcon={<ArrowRight size={16} />} tabIndex={i === index ? 0 : -1} onClick={() => onSelect("pay")}>Aproximar</Button>
                  ) : (
                    <div className="approach__buttons">
                      <Button size="md" variant="secondary" className="approach__btn-120" tabIndex={i === index ? 0 : -1} onClick={onReceive}>Receber</Button>
                      <Button size="md" className="approach__btn-120" tabIndex={i === index ? 0 : -1} onClick={() => onSelect("transfer")}>Transferir</Button>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="approach__dots" aria-hidden>
          {MODES.map((m, i) => <span key={m.value} data-active={i === index} />)}
        </div>
      </div>
    </div>
  );
}
