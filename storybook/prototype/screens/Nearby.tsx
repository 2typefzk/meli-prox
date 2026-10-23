import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Copy, Lock, Phone, RefreshCw, Settings, User, UserPlus } from "lucide-react";
import { BottomSheet, Button, IconButton, LiveDot, NearbyAvatar, TransactionItem } from "../../src/components";
import { AREA, NEARBY, type KnownUser, type NearbyUser } from "../nearby-data";
import { formatBRL } from "../data";
import { formatCountdown, useSecondsLeft } from "../hooks";
import type { AppSettings } from "./Settings";

/* ========================= Projeção do plano (Figma › Perto de mim 2 e swipe) =========================
 * e = 0 → perspectiva: plano 300×401 inclinado ~62°, perspectiva 327px, escala 0,685
 *          (reproduz o trapézio do Figma: base 327px, topo ~150px, altura ~150px)
 * e = 1 → visão de cima (2D): sem inclinação, escala 1 (área 300×401 inteira)
 * O mesmo cálculo posiciona os avatares, que ficam sempre de frente (billboard).
 * Um zoom externo faz a borda mais próxima do plano ocupar a largura da tela − 2×32px. */
const P = 327;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const view = (e: number) => ({ tilt: lerp(62, 0, e), scale: lerp(0.685, 1, e) });
function project(u: number, v: number, e: number) {
  const { tilt, scale } = view(e);
  const a = (tilt * Math.PI) / 180;
  const y = v * scale, z = y * Math.sin(a);
  const f = P / (P - z);
  return { x: u * scale * f, y: y * Math.cos(a) * f, f };
}
const MARGIN = 32;
/** Largura projetada da borda mais próxima (base do trapézio), em px */
const nearWidth = (e: number) => { const p = project(AREA.w / 2, AREA.h / 2, e); return p.x * 2; };
const VISIBLE_IN_PERSPECTIVE = 3;
// Ordem de revelação: distância até mim (centro da área)
const RANK = new Map([...NEARBY].sort((a, b) => Math.hypot(a.x - AREA.w / 2, a.y - AREA.h / 2) - Math.hypot(b.x - AREA.w / 2, b.y - AREA.h / 2)).map((u, i) => [u.id, i]));
/** 0…1: os 3 mais próximos sempre visíveis; os demais surgem, do mais perto ao mais longe, enquanto o plano gira */
function reveal(id: string, e: number) {
  const r = RANK.get(id) ?? 0;
  if (r < VISIBLE_IN_PERSPECTIVE) return 1;
  const t = 0.08 + ((r - VISIBLE_IN_PERSPECTIVE) / (NEARBY.length - VISIBLE_IN_PERSPECTIVE)) * 0.62;
  return clamp01((e - t) / 0.2);
}
const SIZE: Record<string, number> = { "c-man": 48, "c-purple": 40, "c-woman": 48, "c-house": 32 }; // tamanhos do Figma (2D)

function useTween() {
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return useCallback((from: number, to: number, ms: number, onUpdate: (v: number) => void) => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { onUpdate(to); return; }
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms), ease = 1 - Math.pow(1 - k, 3);
      onUpdate(from + (to - from) * ease);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);
}

const initialsOf = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

export interface NearbyProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onBack: () => void;
  notify: (msg: string) => void;
  onTransfer: (user: KnownUser) => void;
  onReceive: (user: KnownUser) => void;
}

/** "Perto de mim": busca por geolocalização e mostra quem está próximo numa vista 3D minimalista. */
export function Nearby({ settings, onOpenSettings, onBack, notify, onTransfer, onReceive }: NearbyProps) {
  const [phase, setPhase] = useState<"searching" | "found">("searching");
  const [scan, setScan] = useState(0);         // reinicia as animações de entrada a cada busca
  const [e, setE] = useState(0);               // 0 perspectiva · 1 visão de cima
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<NearbyUser | null>(null);
  const tween = useTween();
  const drag = useRef<{ y: number; base: number; moved: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(375);
  const findMeLeft = useSecondsLeft(settings.findMeUntil);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Busca simulada
  useEffect(() => {
    setPhase("searching");
    const t = setTimeout(() => setPhase("found"), 2200);
    return () => clearTimeout(t);
  }, [scan]);

  // Recarregar mantém a visão atual (perspectiva ou de cima)
  const refresh = () => { setSelected(null); setScan((s) => s + 1); };

  // Deslizar para baixo expande (perspectiva → 2D); para cima volta. Sem rolagem dentro da área.
  const onPointerDown = (ev: PointerEvent) => { if (phase === "found") drag.current = { y: ev.clientY, base: e, moved: false }; };
  const onPointerMove = (ev: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dy = ev.clientY - d.y;
    if (!d.moved && Math.abs(dy) < 6) return;
    if (!d.moved) { d.moved = true; setDragging(true); try { (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId); } catch { /* */ } }
    setE(clamp01(d.base + dy / 220));
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d?.moved) return;
    const target = e > d.base ? (e > d.base + 0.15 ? 1 : d.base) : (e < d.base - 0.15 ? 0 : d.base);
    tween(e, target, 420, setE);
  };
  // um arrasto não deve abrir o avatar
  const onClickCapture = (ev: React.MouseEvent) => { if (drag.current?.moved || dragging) { ev.stopPropagation(); ev.preventDefault(); } };

  const { tilt, scale } = view(e);
  const zoom = (stageW - MARGIN * 2) / nearWidth(e);
  // centraliza o trapézio projetado (a perspectiva empurra o centro visual para baixo)
  const shift = -(project(0, -AREA.h / 2, e).y + project(0, AREA.h / 2, e).y) / 2 * zoom;
  const placed = NEARBY.map((u) => {
    const p = project(u.x - AREA.w / 2, u.y - AREA.h / 2, e);
    const base = SIZE[u.id] ?? 24;
    const k = Math.max(0.7, Math.min(1.3, p.f)) * lerp(1.1, 1, e);
    return { u, x: p.x * zoom, y: p.y * zoom + shift, size: base * k, shown: reveal(u.id, e) };
  }).sort((a, b) => a.y - b.y); // os mais distantes primeiro
  const hidden = placed.filter((p) => p.shown < 0.5).length;

  return (
    <div className="nearby">
      <div className="proto-status-bar" />
      <div className="nearby__top">
        <div className="nearby__bar">
          <IconButton className="nearby__back" icon={<ArrowLeft size={22} />} aria-label="Voltar" onClick={onBack} />
          <IconButton icon={<Settings size={22} />} aria-label="Configurações" onClick={onOpenSettings} />
        </div>
        <div className="nearby__heading">
          <h1 className="t-h2">Perto de mim</h1>
          <p className="t-body-lg">Contatos que estão perto para quem você pode transferir ou receber</p>
        </div>
      </div>

      <div ref={stageRef} className={`nearby__stage${dragging ? " nearby__stage--dragging" : ""}`}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClickCapture={onClickCapture}>
        {phase === "searching" ? (
          <div className="nearby__search" role="status">
            <span className="nearby__ring" /><span className="nearby__ring" style={{ animationDelay: ".6s" }} /><span className="nearby__ring" style={{ animationDelay: "1.2s" }} />
            <span className="nearby__me" />
            <span className="nearby__search-label">Procurando pessoas por perto…</span>
          </div>
        ) : (
          <div className="nearby__scene" key={scan}>
            <div className="nearby__plane" style={{ transform: `translate(-50%, calc(-50% + ${shift}px)) scale(${zoom}) perspective(${P}px) rotateX(${tilt}deg) scale(${scale})` }} />
            {placed.map(({ u, x, y, size, shown }, i) => {
              const isSel = selected?.id === u.id;
              const label = u.kind === "contact" ? u.name : u.kind === "open" ? `Pessoa ${u.initials}` : "Usuário anônimo";
              return (
                <NearbyAvatar key={u.id} kind={u.kind} photo={u.kind === "contact" ? u.photo : undefined} initials={u.kind === "open" ? u.initials : undefined}
                  size={size} online={u.online} selected={isSel}
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${lerp(0.4, 1, shown)})`,
                    opacity: shown, pointerEvents: shown < 0.6 ? "none" : undefined, zIndex: Math.round(y + 1000), animationDelay: `${i * 70}ms` }}
                  aria-label={label} aria-hidden={shown < 0.6 || undefined} tabIndex={shown < 0.6 ? -1 : undefined} onClick={() => setSelected(u)} />
              );
            })}
          </div>
        )}
        {phase === "found" && (
          <span className="nearby__hint" style={{ opacity: 1 - e }} aria-hidden>
            <ChevronDown size={16} /> {hidden > 0 ? `Deslize para baixo para ver mais ${hidden} pessoas` : "Deslize para baixo para ver toda a área"}
          </span>
        )}
      </div>

      {findMeLeft > 0 && (
        <span className="nearby__visible" role="status"><LiveDot /> Você está visível · {formatCountdown(findMeLeft)}</span>
      )}

      <div className="nearby__footer">
        <IconButton className="nearby__back" icon={<RefreshCw size={20} className={phase === "searching" ? "nearby__spin" : undefined} />}
          aria-label="Buscar novamente" onClick={refresh} disabled={phase === "searching"} />
      </div>

      {selected && <NearbyDrawer user={selected} onClose={() => setSelected(null)} notify={notify}
        onTransfer={(u) => { setSelected(null); onTransfer(u); }} onReceive={(u) => { setSelected(null); onReceive(u); }} />}
    </div>
  );
}

/** Bottom drawer com as informações do usuário tocado (3 casos). */
function NearbyDrawer({ user, onClose, notify, onTransfer, onReceive }: {
  user: NearbyUser; onClose: () => void; notify: (m: string) => void; onTransfer: (u: KnownUser) => void; onReceive: (u: KnownUser) => void;
}) {
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* sem permissão: o aviso basta no protótipo */ }
    notify("Chave Pix copiada");
  };
  return (
    <BottomSheet className="nearby-sheet" aria-label="Detalhes do usuário" onClose={onClose}>
      {(leave) => (<>
        {user.kind === "contact" && (
          <>
            <div className="nearby-sheet__head">
              <img className="nearby-sheet__avatar" src={user.photo} alt="" />
              <div className="home-grow">
                <h2 className="t-h3">{user.name}</h2>
                <p className="nearby-sheet__meta"><Phone size={16} /> {user.phone}</p>
              </div>
            </div>
            <label className="nearby-sheet__pix">
              <span className="t-caption t-secondary">Chave Pix</span>
              <span className="m-field__box">
                <input className="m-field__input" readOnly value={user.pixKey} aria-label="Chave Pix" />
                <IconButton icon={<Copy size={18} />} aria-label="Copiar chave Pix" onClick={() => copy(user.pixKey)} />
              </span>
            </label>
            <div className="nearby-sheet__actions">
              <Button fullWidth variant="secondary" onClick={() => onReceive(user)}>Receber</Button>
              <Button fullWidth trailingIcon={<ArrowRight size={18} />} onClick={() => onTransfer(user)}>Transferir</Button>
            </div>
            <div>
              <h3 className="t-h5 nearby-sheet__section">Últimas transações</h3>
              {user.history.map((t, i) => (
                <TransactionItem key={i} thumb={<span className="nearby-sheet__thumb">{initialsOf(user.name)}</span>} title={t.title} kind={t.kind}
                  method={t.amount < 0 ? "Enviado" : "Recebido"} amount={`${t.amount < 0 ? "-" : "+"} ${formatBRL(Math.abs(t.amount))}`} date={t.date} />
              ))}
            </div>
          </>
        )}
        {user.kind === "open" && (
          <>
            <div className="nearby-sheet__head">
              <span className="nearby-sheet__avatar nearby-sheet__avatar--initials">{user.initials}</span>
              <div className="home-grow">
                <h2 className="t-h3">{user.initials}</h2>
                <p className="nearby-sheet__meta"><Phone size={16} /> {user.phonePrefix}</p>
              </div>
            </div>
            <Button fullWidth icon={<UserPlus size={18} />} onClick={() => { notify(`Convite enviado para ${user.initials}`); leave(); }}>Adicionar aos contatos</Button>
          </>
        )}
        {user.kind === "anon" && (
          <div className="nearby-sheet__head">
            <span className="nearby-sheet__avatar nearby-sheet__avatar--anon"><User size={28} /></span>
            <div className="home-grow">
              <h2 className="t-h3">Usuário Desconhecido</h2>
              <p className="nearby-sheet__meta"><Lock size={16} /> Não é possível interagir</p>
            </div>
          </div>
        )}
      </>)}
    </BottomSheet>
  );
}
