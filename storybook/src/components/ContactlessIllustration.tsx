import sendArrow from "../assets/contactless-send-arrow.svg";
import receiveArrow from "../assets/contactless-receive-arrow.svg";
import nfcWaves from "../assets/contactless-nfc-waves.svg";
import checkLight from "../assets/contactless-check-light.svg";

/** Símbolo de pagamento por aproximação (anel + ondas animadas), centralizado em (cx, cy). Usar dentro de um <svg>. */
export const ContactlessMark = ({ cx, cy, r = 26, stroke = 2.5 }: { cx: number; cy: number; r?: number; stroke?: number }) => (
  <g className="approach-mark" style={{ strokeWidth: stroke }}>
    <circle cx={cx} cy={cy} r={r} className="approach-mark__ring" />
    {[0.28, 0.5, 0.72].map((k, i) => (
      <path key={k} className="approach-mark__wave" style={{ animationDelay: `${i * 0.18}s` }}
        d={`M ${cx - r * 0.5 + i * r * 0.32} ${cy - r * k} a ${r * k * 1.25} ${r * k * 1.25} 0 0 1 0 ${r * k * 2}`} />
    ))}
  </g>
);


export type ContactlessKind = "nfc" | "send" | "receive";
/** waiting: loop da seta / ondas · processing: seta saiu, aguardando · success: variação "Sucesso" */
export type ContactlessPhase = "waiting" | "processing" | "success";

const SUCCESS = {
  send: <span className="contactless__emoji" role="img" aria-label="dinheiro com asas">💸</span>,
  receive: <span className="contactless__emoji" role="img" aria-label="rosto com cifrões">🤑</span>,
  nfc: <img src={checkLight} width={52} height={37} alt="" />,
};

/**
 * IllustrationContactless (Figma 27:1648) — NFC | Send | Receive + variações Sucesso.
 * Anel/borda/fundo em CSS para transicionar entre estados; seta, ondas e check são os vetores do Figma.
 * Send: amarelo (sucesso amarelo + 💸) · Receive: azul → verde (sucesso + 🤑) · NFC: branco → verde (sucesso + check).
 */
export function ContactlessIllustration({ kind, phase = "waiting" }: { kind: ContactlessKind; phase?: ContactlessPhase }) {
  return (
    <div className={`contactless contactless--${kind} contactless--${phase}`}>
      <div className="contactless__disc">
        {kind === "nfc" ? (
          <img src={nfcWaves} width={40} height={58} alt="" className="contactless__waves" />
        ) : (
          <img src={kind === "send" ? sendArrow : receiveArrow} width={52} height={52} alt="" className="contactless__arrow" />
        )}
        {phase === "success" && <span className="contactless__success">{SUCCESS[kind]}</span>}
      </div>
    </div>
  );
}
