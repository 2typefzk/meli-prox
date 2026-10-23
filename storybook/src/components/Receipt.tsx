export interface ReceiptRowProps {
  label: string;
  value: string;
  /** total = rótulo 16/600 e valor 18/600 em texto primário */
  emphasis?: "default" | "total";
}

/** Linha do comprovante: rótulo à esquerda, valor à direita. */
export function ReceiptRow({ label, value, emphasis = "default" }: ReceiptRowProps) {
  return (
    <div className={`m-receipt-row${emphasis === "total" ? " m-receipt-row--total" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export interface ReceiptSectionProps {
  title: string;
  /** Até 3 linhas secundárias */
  lines: string[];
  divider?: boolean;
}

/** Bloco do comprovante (Forma de pagamento, Origem, Destino, Identificação). */
export function ReceiptSection({ title, lines, divider = false }: ReceiptSectionProps) {
  return (
    <section className={`m-receipt-section${divider ? " m-receipt-section--divider" : ""}`}>
      <h3 className="m-receipt-section__title">{title}</h3>
      {lines.map((l) => <p key={l} className="m-receipt-section__line">{l}</p>)}
    </section>
  );
}

/** Borda serrilhada que separa o resumo dos detalhes no comprovante. */
export function ZigzagDivider() {
  return <div className="m-zigzag" aria-hidden />;
}
