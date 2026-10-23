export interface PaymentCardProps {
  type?: "debit" | "credit";
  label?: string;
  last4?: string;
  finish?: "navy" | "graphite";
}

/** Representação do cartão (virtual/físico) usada no carrossel de Cartões. */
export function PaymentCard({ type = "debit", label = "VIRTUAL", last4 = "6872", finish = "navy" }: PaymentCardProps) {
  return (
    <div className={`m-pcard${finish === "graphite" ? " m-pcard--graphite" : ""}`}>
      <div className="m-pcard__top">
        <span className="m-pcard__chip">{type === "debit" ? "Débito" : "Crédito"}</span>
        <span className="m-pcard__type">{label}</span>
      </div>
      <div className="m-pcard__num">•••• {last4}</div>
    </div>
  );
}
