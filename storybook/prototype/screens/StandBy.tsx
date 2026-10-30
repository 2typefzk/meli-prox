import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, IconButton } from "../../src/components";
import { formatBRL } from "../data";
import { ContactlessIllustration, type ContactlessKind, type ContactlessPhase } from "../../src/components";

/** Ação: aguardando a aproximação. */
interface ActionProps {
  state: "action";
  icon: ContactlessKind;
  title: string;
  text: string;
  amount?: number;
  /** Simula a detecção da aproximação (protótipo) */
  onDetected?: () => void;
  /** Ao detectar, exibe a variação Sucesso por SUCCESS_HOLD_MS antes de chamar onDetected (Pagamento) */
  successOnDetect?: boolean;
}
/** Confirmação: "Transferir R$ x Para Destinatário" / "Receber R$ x De Origem". */
interface ConfirmProps {
  state: "confirm";
  icon: ContactlessKind;
  action: string;
  /** Mensagem enquanto processa ("Transferindo" / "Recebendo") */
  processingLabel: string;
  amount: number;
  preposition: string;
  counterpart: string;
  /** Chamado após processamento + sucesso (abre o comprovante) */
  onConfirm: () => void;
}
export type StandByProps = (ActionProps | ConfirmProps) & { onBack: () => void };

const DETECT_AFTER_MS = 2500;
/** Confirmar → "Transferindo/Recebendo" por 2 s → "Sucesso" por 2 s → comprovante */
const PROCESSING_MS = 2000;
const SUCCESS_HOLD_MS = 2000;

/** Template "Stand by" (Figma: StandBy, State=Default | Confirm). */
export function StandBy(props: StandByProps) {
  const { onBack, icon } = props;
  const [phase, setPhase] = useState<ContactlessPhase>("waiting");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Callbacks mais recentes (o App re-renderiza; os temporizadores não devem reiniciar)
  const latest = useRef(props);
  latest.current = props;

  // Ação: detecção simulada
  const autoDetect = props.state === "action" && !!props.onDetected;
  useEffect(() => {
    if (!autoDetect) return;
    later(() => {
      const p = latest.current;
      if (p.state !== "action") return;
      if (p.successOnDetect) { setPhase("success"); later(() => p.onDetected?.(), SUCCESS_HOLD_MS); }
      else p.onDetected?.();
    }, DETECT_AFTER_MS);
  }, [autoDetect]);

  const confirm = () => {
    if (phase !== "waiting") return;
    setPhase("processing");
    later(() => {
      setPhase("success");
      later(() => { const p = latest.current; if (p.state === "confirm") p.onConfirm(); }, SUCCESS_HOLD_MS);
    }, PROCESSING_MS);
  };

  const busy = phase !== "waiting";
  return (
    <div className="standby" role="status" aria-live="polite">
      <div className="proto-status-bar" />
      <div className="standby__header">
        <IconButton className="standby__back" icon={<ArrowLeft size={22} />} aria-label="Voltar" onClick={onBack} disabled={busy} />
      </div>
      <div className="standby__body">
        <div className={`standby__mark${phase === "success" ? " standby__mark--done" : ""}`} aria-hidden>
          <span className="standby__ring" />
          <span className="standby__ring standby__ring--late" />
          <ContactlessIllustration kind={icon} phase={phase} />
        </div>
        {props.state === "action" ? (
          <div className="standby__copy">
            <h1 className="t-h2">{phase === "success" ? "Sucesso" : props.title}</h1>
            {props.amount !== undefined && <span className="standby__amount">{formatBRL(props.amount)}</span>}
            {phase !== "success" && <p className="t-body-lg">{props.text}</p>}
          </div>
        ) : (
          <>
            <div className="standby__copy">
              <span className="t-h2">{props.action}</span>
              <span className="standby__amount">{formatBRL(props.amount)}</span>
              <span className="t-body-lg standby__muted">{props.preposition}</span>
              <span className="t-h2">{props.counterpart}</span>
            </div>
            <Button fullWidth variant="secondary" className="standby__cta" onClick={confirm} disabled={busy} aria-busy={phase === "processing" || undefined}>
              {phase === "processing" ? `${props.processingLabel}...` : phase === "success" ? "Sucesso" : "Confirmar"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
